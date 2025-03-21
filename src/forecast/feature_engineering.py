import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
from tqdm import tqdm
from sklearn.preprocessing import OrdinalEncoder

def time_features(df: pd.DataFrame):
    df['hour'] = df['date'].dt.hour
    df['day_of_week'] = df['date'].dt.dayofweek  # Monday=0, Sunday=6
    df['month'] = df['date'].dt.month
    df['day_of_month'] = df['date'].dt.day
    df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
    df.sort_values(['date', 'location'], inplace=True)
 
    return df    

def cyclical_features(df: pd.DataFrame):
    df['dow_sin'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
    df['dow_cos'] = np.cos(2 * np.pi * df['day_of_week'] / 7)
    return df
        
def interaction_features(df: pd.DataFrame):
    # Create interaction features for all columns starting with 'lag_' or 'rolling_'
    for col in df.columns:
        if col.startswith('lag_') or col.startswith('rolling_'):
            interaction_col_name = f'{col}_dow_sin'
            df[interaction_col_name] = df[col] * df['dow_sin']
    return df
    
def lags_features(df: pd.DataFrame, dependent_vars: list, horizon: int):
    df.sort_values(['date'], inplace=True)
    
    for var in dependent_vars:
        # Primary lag features (using horizon-day window)
        df[f'lag_{var}'] = df.groupby('location')[var].shift(horizon)
        df[f'lag_{var}'] = np.log(df[f'lag_{var}'] + 1)
        df[f'lag1_{var}'] = df.groupby('location')[f'lag_{var}'].shift(1)
        df[f'lag24_{var}'] = df.groupby('location')[f'lag_{var}'].shift(24)
        
        # Additional lag features at different windows:
        df[f'lag_7d_{var}'] = df.groupby('location')[var].shift(horizon)
        df[f'lag_14d_{var}'] = df.groupby('location')[var].shift(horizon)
        
        # Rolling statistics to smooth out noise:
        # 7-day rolling statistics
        df[f'rolling_mean_7d_{var}'] = df.groupby('location')[var]\
            .transform(lambda x: x.rolling(window=horizon, min_periods=1).mean())
        df[f'rolling_std_7d_{var}'] = df.groupby('location')[var]\
            .transform(lambda x: x.rolling(window=horizon, min_periods=1).std())
        df[f'rolling_q75_7d_{var}'] = df.groupby('location')[var]\
            .transform(lambda x: x.rolling(window=horizon, min_periods=1).quantile(0.75))
        
        # horizon-day rolling statistics
        df[f'rolling_mean_28d_{var}'] = df.groupby('location')[var]\
            .transform(lambda x: x.rolling(window=horizon, min_periods=1).mean())
        df[f'rolling_std_28d_{var}'] = df.groupby('location')[var]\
            .transform(lambda x: x.rolling(window=horizon, min_periods=1).std())
    return df


def feature_engineering(data: pd.DataFrame, dependent_variable: list, independent_variables: list):
    # Manually apply ordinal encoding to the `drought_index` column
    drought_index_mapping = {'High risk': 1, 'No risk': 0}
    
    data['drought_index'] = data['drought_index'].map(drought_index_mapping)

    # Create a stationary version of Energia via differencing
    # data['Energia_stationary'] = data['Energia'].diff()
    
    data = lags_features(data, dependent_variable, 30*4)
    data = time_features(data)
    data = cyclical_features(data)
    data = interaction_features(data)
    data = data.sort_values(['date', 'location'])
    
    data = data.groupby(['location', 'date']).apply(lambda group: group.ffill()).reset_index(drop=True)
    return data


def calculate_daytime_heat_stress(TMax_series, TMaxOptimum, TMaxLimit):
    """
    Calculate daytime heat stress based on maximum daily temperature.
    Returns a stress score from 0 (no stress) to 9 (severe stress).
    """
    stress = pd.Series(0, index=TMax_series.index)
    mask_optimal = TMax_series <= TMaxOptimum
    mask_limit = (TMax_series > TMaxOptimum) & (TMax_series < TMaxLimit)
    stress[mask_limit] = 9 * ((TMax_series[mask_limit] - TMaxOptimum) / (TMaxLimit - TMaxOptimum))
    stress[~mask_optimal & ~mask_limit] = 9
    return stress

def calculate_nighttime_heat_stress(TMin_series, TMinOptimum, TMinLimit):
    """
    Calculate nighttime heat stress based on minimum daily temperature.
    Returns a stress score from 0 (no stress) to 9 (severe stress).
    """
    stress = pd.Series(0, index=TMin_series.index)
    mask_optimal = TMin_series <= TMinOptimum
    mask_limit = (TMin_series > TMinOptimum) & (TMin_series < TMinLimit)
    stress[mask_limit] = 9 * ((TMin_series[mask_limit] - TMinOptimum) / (TMinLimit - TMinOptimum))
    stress[~mask_optimal & ~mask_limit] = 9
    return stress

def calculate_drought_index(cum_precip, cum_evap, soil_moisture, T_average):
    """
    Calculate drought risk index based on cumulative precipitation, evaporation, soil moisture, and temperature.
    Returns qualitative drought risk levels: 'No risk', 'Medium risk', or 'High risk'.
    """
    drought_index = (cum_precip - cum_evap) + soil_moisture / T_average  # Compute drought balance
    if drought_index > 0:
        return 'No risk'  # Sufficient moisture
    elif drought_index < 0:
        return 'High risk'  # Significant moisture deficit
    else:
        return 'Medium risk'  # Moderate risk level

     
def calculate_yield_risk(GDD, P, pH, N, GDD_OPTIMAL, PRECIP_OPTIMAL, 
                          PH_OPTIMAL, N_OPTIMAL, 
                          w1, w2, w3, w4):
    """
    Calculate yield risk based on GDD, Precipitation, pH, and Nitrogen.
    
    Parameters:
    - GDD: Actual Growing Degree Days
    - P: Actual precipitation (mm)
    - pH: Actual soil pH
    - N: Actual available nitrogen (kg/ha)
    - GDD_opt, P_opt, pH_opt, N_opt: Optimal ranges
    - w1, w2, w3, w4: Weighting factors

    Returns:
    - Yield Risk Score (lower is better)
    """

    # Squared deviation from optimal values
    GDD_risk = (GDD - GDD_OPTIMAL)* 2 * w1
    P_risk = (P - PRECIP_OPTIMAL)* 2 * w2
    pH_risk = (pH - PH_OPTIMAL)* 2 * w3
    N_risk = (N - N_OPTIMAL) * 2 * w4

    # Total Yield Risk Score
    YR = GDD_risk + P_risk + pH_risk + N_risk

    return YR


def compute_dependent(df: pd.DataFrame):
    # Define optimal and limit values for stress calculations
    TMaxOptimum = 25  # Example value, adjust as needed
    TMaxLimit = 35    # Example value, adjust as needed
    TMinOptimum = 15  # Example value, adjust as needed
    TMinLimit = 25    # Example value, adjust as needed
    Tbase = 10
    GDD_OPTIMAL = 1000  # Example value, adjust as needed
    PRECIP_OPTIMAL = 500  # Example value, adjust as needed
    PH_OPTIMAL = 6.5  # Example value, adjust as needed
    N_OPTIMAL = 100  # Example value, adjust as needed
    w1, w2, w3, w4 = 0.3, 0.3, 0.2, 0.2  # Example weights, adjust as needed

    # Extract year from date
    df['year'] = df['date'].dt.year
    df_seasonal = df.copy()
    
    df_seasonal['growing_period'] = df_seasonal['date'].dt.month.apply(lambda x: 1 if 5 <= x <= 8 else 0)
    
    # Filter the DataFrame to include only rows where growing_period is 1
    growing_season_df = df_seasonal[df_seasonal['growing_period'] == 1]

    # Filter the DataFrame for Temperature_max and Temperature_min
    df_max = df[df['variable'] == 'Temperature_max'][['location', 'date', 'value']]
    df_min = df[df['variable'] == 'Temperature_min'][['location', 'date', 'value']]

    # Merge the max and min temperature DataFrames
    df_merged = pd.merge(df_max, df_min, on=['location', 'date'], suffixes=('_max', '_min'))

    df = df.merge(df_merged, on=['location', 'date'], how='left')
    df.rename(columns={'value_max': 'TMax', 'value_min': 'TMin'}, inplace=True)
    
    df['GDD_day'] = ((df['TMax'] + df['TMin']) / 2 - Tbase)
    
    # Calculate heat stress using vectorized operations
    df['daytime_heat_stress'] = calculate_daytime_heat_stress(df['TMax'], TMaxOptimum, TMaxLimit)
    df['nighttime_heat_stress'] = calculate_nighttime_heat_stress(df['TMin'], TMinOptimum, TMinLimit)


    seasonal_results = []


    # Group by location for seasonal metrics
    grouped_season = growing_season_df.groupby(['location', 'year'])

    # Calculate seasonal metrics
    for location, group in tqdm(grouped_season, desc="Calculating seasonal metrics"):
        TMax_season = group[group['variable'] == 'Temperature']['value'].max()
        TMin_season = group[group['variable'] == 'Temperature']['value'].min()
        
        cum_precip = group[group['variable'] == 'Precipitation_Total_sum']['value'].sum()
        cum_evap = group[group['variable'] == 'Evapotranspiration_sum']['value'].sum()

        soil_moisture = group[group['variable'] == 'Soil_Moisture']['value'].mean()
        T_average = group[group['variable'] == 'Temperature']['value'].mean()
        pH = group[group['variable'] == 'pH_in_H2O']['value'].mean()
        N = group[group['variable'] == 'Total_Nitrogen_Content']['value'].sum()
        
        GDD_seasonal = ((TMax_season + TMin_season) / 2 - Tbase)

        drought_index = calculate_drought_index(cum_precip, cum_evap, soil_moisture, T_average)
        yield_risk = calculate_yield_risk(GDD_seasonal, cum_precip, pH, N, GDD_OPTIMAL, PRECIP_OPTIMAL, PH_OPTIMAL, N_OPTIMAL, w1, w2, w3, w4)

        representative_date = group['date'].min()

        seasonal_results.append({
            'location': location[0],
            'date': representative_date,
            'year': location[1],
            'drought_index': drought_index,
            'yield_risk': yield_risk
        })

    seasonal_results_df = pd.DataFrame(seasonal_results)

    merged_results_df = df.merge(seasonal_results_df, on=['location', 'year'], how='left')

    merged_results_df.rename(columns={'date_x': 'date'}, inplace=True)
    merged_results_df.drop(columns=['date_y'], inplace=True)

    # Pivot the DataFrame to create a new column for each unique variable
    df_pivot = merged_results_df.pivot_table(index=['location', 'date'], columns='variable', values='value').reset_index()

    # Merge the pivoted DataFrame back to the original DataFrame
    merged_results_df = merged_results_df.merge(df_pivot, on=['location', 'date'], how='left')
    merged_results_df.drop_duplicates(inplace=True)
    
    
    # Drop duplicates based on location and date
    merged_results_df.drop_duplicates(subset=['location', 'date'], inplace=True)
    merged_results_df.drop(columns=['variable', 'value'], inplace=True)

    return merged_results_df

