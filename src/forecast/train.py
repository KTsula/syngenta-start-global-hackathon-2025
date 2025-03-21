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
    df_fe = pd.read_csv('/Users/armandhubler/Documents/coding_project/syngenta-start-global-hackathon-2025/src/forecast/data/df_fe.csv')
    
    print("Computing dependent variables...")
    # df = compute_dependent(df)
        
    DEPENDENT_VARIABLE = ['yield_risk', 'drought_index', 'daytime_heat_stress', 'nighttime_heat_stress']
    # INDEPENDENT_FEATURES = df[~df.isin(DEPENDENT_VARIABLE)].columns.tolist()
    
    print("Feature engineering...")
    # df_fe = feature_engineering(df.copy(), DEPENDENT_VARIABLE, INDEPENDENT_FEATURES)
    # print("Feature transformation...")
    # df_fe = feature_transformation(df_fe, DEPENDENT_VARIABLE, INDEPENDENT_FEATURES)
    # df_fe.to_csv('/Users/armandhubler/Documents/coding_project/syngenta-start-global-hackathon-2025/src/forecast/data/df_fe.csv', index=False)
    
    print(df_fe.info())
    
    multipliers = {'yield_risk': 0.0001, 'drought_index': 0.0001, 'daytime_heat_stress': 0.0001, 'nighttime_heat_stress': 0.0001}
    
    df_fe = winsorize_column(df_fe, DEPENDENT_VARIABLE, multipliers)

    INDEPENDENT_FEATURES = df_fe[~df_fe.isin(DEPENDENT_VARIABLE)].columns.tolist()

    # Split into features and target
    X = df_fe[INDEPENDENT_FEATURES]
    y = df_fe[DEPENDENT_VARIABLE]
    
    nan_counts = X.isna().sum()
    
    # Sort the counts in descending order
    nan_counts_sorted = nan_counts.sort_values(ascending=False)
    
    # Print the sorted counts
    print("NaN counts per column (sorted):")
    print(nan_counts_sorted)
    

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
    
    # Reshape predictions and labels to ensure they have the same shape
    preds = preds.reshape(labels.shape)
    
    mape = np.mean(np.abs(preds - labels) / (np.abs(labels) + epsilon))
    return 'mape', mape

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
    Custom objective function for multi-forecasting that uses a squared percentage error,
    weighted asymmetrically based on the sign of the error.
    """
    labels = dtrain.get_label().reshape(preds.shape)
    epsilon = 1e-6
    a = 1.5  # weight when overpredicting
    b = 1.0  # weight when underpredicting

    diff = preds - labels
    c = np.where(diff >= 0, a, b)
    denom = labels + epsilon

    grad = 2 * c * diff / (denom**2)
    hess = 2 * c / (denom**2)
    
    return grad.flatten(), hess.flatten()

def asymmetric_mape_obj_lgb(preds, train_data):
    """
    Custom objective function for LightGBM for multi-forecasting that uses a squared percentage error,
    weighted asymmetrically based on the sign of the error.
    """
    labels = train_data.get_label().reshape(preds.shape)
    epsilon = 1e-6
    a = 1.5  # weight when overpredicting
    b = 1.0  # weight when underpredicting

    diff = preds - labels
    c = np.where(diff >= 0, a, b)

    min_label = 0.1  # adjust based on your data distribution
    safe_labels = np.maximum(labels, min_label)
    denom = safe_labels + epsilon

    grad = 2 * c * diff / (denom**2)
    hess = 2 * c / (denom**2)
    
    return grad.flatten(), hess.flatten()



def train_model(X, y):
    # Convert 'date' to a datetime type
    X['date'] = pd.to_datetime(X['date'])
    
    forecast_start = pd.Timestamp('2020-05-01')
    forecast_end   = pd.Timestamp('2021-01-01')
    
    nunique_location = X['location'].nunique()
    timestamp = 30*4

    INITIAL_TRAIN_WINDOW = timestamp*nunique_location
    FORECAST_HORIZON = timestamp*nunique_location
    STEP = 30*nunique_location
    DEPENDENT_VARIABLE = ['yield_risk', 'drought_index', 'daytime_heat_stress', 'nighttime_heat_stress']

    # Initialize dictionaries to store scores for each dependent variable
    mae_scores = {var: [] for var in DEPENDENT_VARIABLE}
    mape_scores = {var: [] for var in DEPENDENT_VARIABLE}
    
    X['date'] = X['date'].dt.date

    n = len(X)
    num_folds = (n - INITIAL_TRAIN_WINDOW - FORECAST_HORIZON) // STEP + 1
    print(f"Total number of folds: {num_folds}")
    
    # ----- Cross-Validation -----
    print(f"Cross-Validation: {INITIAL_TRAIN_WINDOW} - {FORECAST_HORIZON} - {STEP}")
    
    # Initialize fold counter
    fold_count = 0
    
    for fold, (train_index, val_index) in enumerate(custom_rolling_window_cv(X, INITIAL_TRAIN_WINDOW, FORECAST_HORIZON, STEP)):
        fold_count += 1  # Increment fold counter
        X_tr = X.iloc[train_index]
        y_tr = y.iloc[train_index]
        X_val_fold = X.iloc[val_index]
        y_val_fold = y.iloc[val_index]
                
        X_tr.drop(columns=['location', 'date'], inplace=True)
        X_val_fold.drop(columns=['location', 'date'], inplace=True)
                
        # ----- Train XGBoost -----
        dtrain = xgb.DMatrix(X_tr, label=y_tr[DEPENDENT_VARIABLE], enable_categorical=True)
        dval = xgb.DMatrix(X_val_fold, label=y_val_fold[DEPENDENT_VARIABLE], enable_categorical=True)
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
        
        # Calculate MAE and MAPE for each target
        for i, target in enumerate(DEPENDENT_VARIABLE):
            mae_xgb = mean_absolute_error(y_val_fold[target], y_pred_xgb[:, i])
            mape_xgb = adjusted_mape(y_val_fold[target], y_pred_xgb[:, i])
            
            mae_scores[target].append(mae_xgb)
            mape_scores[target].append(mape_xgb)
            
            print(f"XGBoost {target} --> MAE: {mae_xgb:.4f}, MAPE: {mape_xgb:.4f}")
        
        fold += 1

    # Print the total number of folds
    print(f"Total number of folds: {fold_count}")

    # Calculate and print average scores for each target
    for target in DEPENDENT_VARIABLE:
        avg_mae = np.mean(mae_scores[target])
        avg_mape = np.mean(mape_scores[target])
        print("--------------------------------------------")
        print(f"\nAverage XGB MAE for {target} across folds: {avg_mae}")
        print(f"Average XGB MAPE for {target} across folds: {avg_mape}")
        print("--------------------------------------------")


def forecast_dependents(X, y, forecast_start='2023-05-01', forecast_duration=4):
    """
    Forecast the dependent variables starting from a given date for a specified duration.
    
    Parameters:
    - X: DataFrame containing the features.
    - y: DataFrame containing the dependent variables.
    - forecast_start: The start date for forecasting (string in 'YYYY-MM-DD' format).
    - forecast_duration: The number of months to forecast.
    
    Returns:
    - DataFrame with forecasted values for each dependent variable.
    """
    DEPENDENT_VARIABLE = ['yield_risk', 'drought_index', 'daytime_heat_stress', 'nighttime_heat_stress']

    # Convert forecast_start to a Timestamp
    forecast_start = pd.Timestamp(forecast_start)
    
    # Ensure the 'date' column is of datetime type
    X['date'] = pd.to_datetime(X['date'])
    
    # Calculate the end date for the forecast
    forecast_end = forecast_start + pd.DateOffset(months=forecast_duration)
    
    # Filter the data to include only the training period
    X_train = X[X['date'] < forecast_start]
    y_train = y[X['date'] < forecast_start]
    
    # Create a complete grid of locations and dates for the forecast period
    locations = X['location'].unique()
    forecast_dates = pd.date_range(start=forecast_start, end=forecast_end - pd.Timedelta(days=1), freq='D')
    forecast_grid = pd.MultiIndex.from_product([locations, forecast_dates], names=['location', 'date']).to_frame(index=False)
    
    # Merge the forecast grid with the original features to prepare the forecast dataset
    X_forecast = forecast_grid.merge(X.drop(columns=['date']), on='location', how='left')
    
    # Drop unnecessary columns from the training data
    X_train.drop(columns=['location', 'date'], inplace=True)
    
    # Train the model on the training data
    dtrain = xgb.DMatrix(X_train, label=y_train[DEPENDENT_VARIABLE], enable_categorical=True)
    model_xgb = xgb.train(
        params_xgb,
        dtrain,
        num_boost_round=1000,
        verbose_eval=False,
        obj=asymmetric_mape_obj,
        custom_metric=mape_eval
    )
    
    # Prepare the forecast data
    X_forecast.drop(columns=['location', 'date'], inplace=True)
    dX_forecast = xgb.DMatrix(X_forecast, enable_categorical=True)
    
    # Forecast using the trained model
    y_pred_forecast = model_xgb.predict(dX_forecast)
    
    # Create a DataFrame for the forecasted values
    forecast_df = pd.DataFrame(y_pred_forecast, columns=DEPENDENT_VARIABLE)
    forecast_df['location'] = forecast_grid['location']
    forecast_df['date'] = forecast_grid['date']
    
    return forecast_df

def decode_location(df: pd.DataFrame, location_mapping: dict) -> pd.DataFrame:
    # Create a reverse mapping from integer to location
    reverse_location_mapping = {idx: location for location, idx in location_mapping.items()}
    
    # Map the integer values back to location names
    df['location'] = df['location'].map(reverse_location_mapping)
    
    return df

def main():
    df = load_data('METER_BLUE_DATA')
    
    df = df[(df['date'] >= pd.to_datetime('2017-01-01')) & (df['date'] <= pd.to_datetime('2024-01-01'))]
    
    X, y = prepare_training_data(df.copy())
    
    # Forecast for May 2023 for 4 months
    forecast_df = forecast_dependents(X, y, forecast_start='2023-05-01', forecast_duration=4)

    # Decode the location
    location_mapping = {location: idx for idx, location in enumerate(sorted(df['location'].unique()))}
    forecast_df = decode_location(forecast_df, location_mapping)

    # Save the forecasted values to a CSV file
    forecast_df.to_csv('/Users/armandhubler/Documents/coding_project/syngenta-start-global-hackathon-2025/src/forecast/data/forecast_values.csv', index=True)


if __name__ == "__main__":
    main()
    
    
    