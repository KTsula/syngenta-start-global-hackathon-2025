import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error
import lightgbm as lgb
import xgboost as xgb
from numpy import fft

from src.forecast.data import load_data
from src.forecast.feature_engineering import feature_engineering, compute_dependent
from src.forecast.feature_transformation import feature_transformation


def prepare_training_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Applies the complete feature engineering pipeline to the training data.
    """
    print("Computing dependent variables...")
    df = compute_dependent(df)
        
    DEPENDENT_VARIABLE = ['yield_risk', 'drought_index', 'daytime_heat_stress', 'nighttime_heat_stress']
    INDEPENDENT_FEATURES = df[~df.isin(DEPENDENT_VARIABLE)].columns.tolist()
    
    print("Feature engineering...")
    df_fe = feature_engineering(df.copy(), DEPENDENT_VARIABLE, INDEPENDENT_FEATURES)
    # print("Feature transformation...")
    # df_fe = feature_transformation(df_fe, DEPENDENT_VARIABLE, INDEPENDENT_FEATURES)
    
    multipliers = {'yield_risk': 0.0001, 'drought_index': 0.0001, 'daytime_heat_stress': 0.0001, 'nighttime_heat_stress': 0.0001}
    
    df_fe = winsorize_column(df_fe, DEPENDENT_VARIABLE, multipliers)


    # Split into features and target
    X = df_fe[INDEPENDENT_FEATURES]
    y = df_fe[DEPENDENT_VARIABLE]

    print(f"Total training samples: {X.shape[0]}")
    
    return X, y


# Winsorizing
def winsorize_column(df, columns, multipliers):
    """
    Clips the values of each column in columns to be within [Q1 - multiplier*IQR, Q3 + multiplier*IQR].
    """
    for column in columns:
        multiplier = multipliers.get(column, 0.0001)  # Default multiplier if not specified
        q1 = df[column].quantile(0.25)
        q3 = df[column].quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - multiplier * iqr
        upper_bound = q3 + multiplier * iqr
        df[column] = df[column].clip(lower_bound, upper_bound)
    return df



# Rolling Window Cross-Validation
def custom_rolling_window_cv(data: pd.DataFrame, initial_train_window: int, forecast_horizon: int, step: int):
    """
    Custom rolling window cross-validation.
    """
    n = len(data)
    train_end = initial_train_window  
    while (train_end + forecast_horizon) <= n:
        train_idx = list(range(0, train_end))
        test_idx = list(range(train_end, train_end + forecast_horizon))
        yield train_idx, test_idx
        train_end += step
        

def adjusted_mape(y_true, y_pred, epsilon=0.001):
    """Adjusted MAPE: adds epsilon to avoid division by zero."""
    return np.mean(np.abs(y_true - y_pred) / (np.abs(y_true) + epsilon))

def mape_eval(preds, dtrain):
    """Custom evaluation metric: MAPE."""
    labels = dtrain.get_label()
    epsilon = 1e-6
    mape = np.mean(np.abs(preds - labels) / (np.abs(labels) + epsilon))
    return 'mape', mape

# Hyperparameters
params_lgb = {
    'metric': 'mae',
    'learning_rate': 0.04139126441377782,
    'num_leaves': 59,
    'max_depth': 7,
    'min_data_in_leaf': 26,
    'feature_fraction': 0.9999701887398744,
    'bagging_fraction': 0.6553188710984839,
    'bagging_freq': 6,
    'lambda_l1': 0.1,
    'lambda_l2': 0.1,
    'verbose': -1,
    'seed': 42
}

params_xgb = {
    'objective': 'reg:squarederror',
    'learning_rate': 0.08996762182053374,
    'max_depth': 12,
    'min_child_weight': 15,
    'subsample': 0.9311934043147285,
    'colsample_bytree': 0.9207112604165268,
    'gamma': 0.05492341594511156,
    'reg_alpha': 1.8601319939498554e-06,
    'reg_lambda': 1.0612755474577377e-08,
    'seed': 42,
    'verbosity': 1
}

# Asymmetric Loss Function
def asymmetric_mape_obj(preds, dtrain):
    """
    Custom objective function that uses a squared percentage error,
    weighted asymmetrically based on the sign of the error.
    Loss: L = c * ((pred - label) / (label + epsilon))^2
    where c = a if (pred - label) >= 0, else c = b.
    """
    labels = dtrain.get_label()
    epsilon = 1e-6
    # Set weights for asymmetry:
    a = 1.5  # weight when overpredicting
    b = 1.0  # weight when underpredicting
    diff = preds - labels
    c = np.where(diff >= 0, a, b)
    denom = labels + epsilon
    grad = 2 * c * diff / (denom**2)
    hess = 2 * c / (denom**2)
    return grad, hess

def asymmetric_mape_obj_lgb(preds, train_data):
    """
    Custom objective function for LightGBM that uses a squared percentage error,
    weighted asymmetrically based on the sign of the error.
    Loss: L = c * ((pred - label) / (label + epsilon))^2
    where c = a if (pred - label) >= 0, else c = b.
    """
    labels = train_data.get_label()
    epsilon = 1e-6
    # Set weights for asymmetry:
    a = 1.5  # weight when overpredicting
    b = 1.0  # weight when underpredicting
    diff = preds - labels
    c = np.where(diff >= 0, a, b)
    
    min_label = 0.1  # adjust based on your data distribution
    safe_labels = np.maximum(labels, min_label)
    denom = safe_labels + epsilon

    # denom = labels + epsilon
    
    
    grad = 2 * c * diff / (denom**2)
    hess = 2 * c / (denom**2)
    return grad, hess


def train_model(X, y):
    
    forecast_start = pd.Timestamp('2020-05-01')
    forecast_end   = pd.Timestamp('2021-01-01')
    
    
    nunique_location = X['location'].nunique()
    timestamp = 30*4

    INITIAL_TRAIN_WINDOW = timestamp*nunique_location
    FORECAST_HORIZON = timestamp*nunique_location
    STEP = 7*nunique_location

    # Metrics Functions
    epsilon = 0.001

    mae_scores = []
    mape_scores = []

    for fold, (train_index, val_index) in enumerate(custom_rolling_window_cv(X, INITIAL_TRAIN_WINDOW, FORECAST_HORIZON, STEP)):
        X_tr = X.iloc[train_index]
        y_tr = y.iloc[train_index]
        X_val_fold = X.iloc[val_index]
        y_val_fold = y.iloc[val_index]
                
        # ----- Train LightGBM -----
        lgb_train = lgb.Dataset(X_tr, label=y_tr, categorical_feature=categorical_features + ['zero_indicator'])
        lgb_val = lgb.Dataset(X_val_fold, label=y_val_fold, categorical_feature=categorical_features + ['zero_indicator'])
        
        params_lgb['objective'] = asymmetric_mape_obj_lgb
        
        model_lgb = lgb.train(
            params_lgb,
            lgb_train,
            num_boost_round=1000,
            valid_sets=[lgb_train, lgb_val],
            callbacks=[lgb.early_stopping(stopping_rounds=50)]
        )
        
        y_pred_lgb = model_lgb.predict(X_val_fold, num_iteration=model_lgb.best_iteration)
        
        # ----- Train XGBoost with custom asymmetric loss -----
        dtrain = xgb.DMatrix(X_tr, label=y_tr, enable_categorical=True)
        dval = xgb.DMatrix(X_val_fold, label=y_val_fold, enable_categorical=True)
        watchlist = [(dtrain, 'train'), (dval, 'eval')]
        
        model_xgb = xgb.train(
            params_xgb,
            dtrain,
            num_boost_round=1000,
            evals=watchlist,
            early_stopping_rounds=50,
            verbose_eval=False,
            obj=asymmetric_mape_obj,
            custom_metric=mape_eval
        )
        
        dX_val = xgb.DMatrix(X_val_fold, enable_categorical=True)
        if hasattr(model_xgb, 'best_iteration'):
            y_pred_xgb = model_xgb.predict(dX_val, iteration_range=(0, model_xgb.best_iteration + 1))
        else:
            y_pred_xgb = model_xgb.predict(dX_val)
        
        # ----- Ensemble Predictions (Simple Average) -----
        y_pred_ensemble = (y_pred_lgb + y_pred_xgb) / 2.0
        
        # Clip predictions using a floor and ceiling to reduce extreme errors:
        floor_value = 0  # Energy supply cannot be negative.
        ceiling_solar = 453.3
        ceiling_wind = 453.3 

        # Clip predictions for Solar category
        solar_mask = (X_val_fold['Categoria'] == 'Solar')
        y_pred_ensemble_clipped = y_pred_ensemble.copy()
        y_pred_ensemble_clipped[solar_mask] = np.clip(y_pred_ensemble[solar_mask], floor_value, ceiling_solar)

        # Clip predictions for Wind category
        wind_mask = (X_val_fold['Categoria'] == 'Eolica')
        y_pred_ensemble_clipped[wind_mask] = np.clip(y_pred_ensemble[wind_mask], floor_value, ceiling_wind)
        
        # Adjust predictions
        solar_mask = (X_val_fold['Categoria'] == 'Solar') & ((X_val_fold['hour'] >= 1) | (X_val_fold['hour'] < 6))
        y_pred_ensemble_clipped[solar_mask] = 0
        
        wind_mask = (X_val_fold['Categoria'] == 'Eolica') & ((X_val_fold['hour'] >=00) | (X_val_fold['hour'] < 6))
        y_pred_ensemble_clipped[wind_mask] = 0
        
        fold_mae = mean_absolute_error(y_val_fold, y_pred_ensemble_clipped)
        fold_mape = adjusted_mape(y_val_fold, y_pred_ensemble_clipped)
        print("\n--------------------------------------------")
        print(f"Fold {fold}: Ensemble MAE = {fold_mae:.4f}, Ensemble MAPE = {fold_mape:.4f}\n")
        
        mae_scores.append(fold_mae)
        mape_scores.append(fold_mape)
        fold += 1

    avg_mae = np.mean(mae_scores)
    avg_mape = np.mean(mape_scores)

    print("--------------------------------------------")
    print(f"\nAverage Ensemble MAE  across folds: {avg_mae:.4f}")
    print("--------------------------------------------")
    print(f"\nAverage Ensemble MAPE across folds: {avg_mape:.4f}")


def main():
    df = load_data('METER_BLUE_DATA')
    
    df = df[(df['date'] >= pd.to_datetime('2020-01-01')) & (df['date'] <= pd.to_datetime('2021-01-01'))]
    
    X, y = prepare_training_data(df.copy())
    
    train_model(X, y)
    
    
    
    
if __name__ == "__main__":
    main()
    
    
    