import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error
import lightgbm as lgb
import xgboost as xgb
from numpy import fft


def rolling_mean_features(df: pd.DataFrame):
    features = ['lag_Energia', 'lag_PrecEuro']
    groups = ['Codigo', 'Categoria']
    times = [12, 24, 48, 168]
    for group in groups:
        for feature in features:
            for time in times:
                df[f'roll{time}_mean_{feature}'] = df.groupby(group)[feature] \
                    .transform(lambda x: x.rolling(window=time, min_periods=1).mean())
    return df

def ewm_features(df: pd.DataFrame):
    features = ['lag_Energia', 'lag_PrecEuro']
    groups = ['Codigo', 'Categoria']
    spans = [12, 24, 48, 168]
    for group in groups:
        for feature in features:
            for span in spans:
                df[f'ewm{span}_mean_{feature}'] = df.groupby(group)[feature] \
                    .transform(lambda x: x.ewm(span=span, min_periods=1).mean())
    return df

def diff_features(df: pd.DataFrame):
    features = ['lag_Energia', 'lag_PrecEuro']
    for feature in features:
        df[f'diff_{feature}'] = df.groupby('Codigo')[feature].diff()
        df[f'diff_{feature}'] = df.groupby(['Codigo'])[f'diff_{feature}'].transform(lambda x: x.fillna(x.mean()))
    return df

def volatility_features(df: pd.DataFrame):
    features = ['lag_Energia', 'lag_PrecEuro']
    groups = ['Codigo', 'Categoria']
    windows = [12, 24, 48, 168]
    for group in groups:
        for feature in features:
            for window in windows:
                df[f'volatility_{window}_{feature}'] = df.groupby(group)[feature] \
                    .transform(lambda x: x.rolling(window=window, min_periods=1).std())
                df[f'volatility_{window}_{feature}'] = df.groupby(['Codigo'])[f'volatility_{window}_{feature}'].transform(lambda x: x.fillna(x.mean()))

    return df

def fourrier_features(df: pd.DataFrame):    
    def apply_fft(group):
            X = fft.fft(group['lag_Energia'])
            N = len(X)
            group['lag_Energia_fft'] = np.abs(X) / N  # Normalize by length
            return group

    df = df.groupby('Codigo', group_keys=False).apply(apply_fft)
    return df

def frequency_power_features(df: pd.DataFrame):
    df['power_spectrum'] = df.groupby('Codigo')['lag_Energia'].transform(lambda x: np.abs(fft.fft(x))**2 / len(x))
    return df

def feature_transformation(x_train: pd.DataFrame, dependent_variables: list, independent_variables: list):
    # x_train = rolling_mean_features(x_train)
    # x_train = ewm_features(x_train)
    # x_train = diff_features(x_train)
    x_train = volatility_features(x_train)
    x_train = fourrier_features(x_train)
    x_train = frequency_power_features(x_train)
    # x_train['zero_indicator'] = (x_train['lag_Energia'] == 0).astype(int)
    return x_train
