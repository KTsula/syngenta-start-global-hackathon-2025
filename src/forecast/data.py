import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error
import lightgbm as lgb
import xgboost as xgb
from numpy import fft

from dotenv import load_dotenv
import os

load_dotenv()

METER_BLUE_DATA_PATH = os.getenv('METER_BLUE_DATA_PATH')
METER_BLUE_STATIC_PATH = os.getenv('METER_BLUE_STATIC_PATH')
IN_GOV_DATA_PATH = os.getenv('IN_GOV_DATA_PATH')

def load_csv_data(file_path):
    df = pd.read_csv(file_path)
    return df

def load_xlsx_data(file_path, sheet_name='Statewise 2009-10 & 2010-11'):
    df = pd.read_excel(file_path, sheet_name=sheet_name)
    return df

def preprocess_meter_blue_data(df):    
    # Concatenate 'variable' with 'aggregation' when 'aggregation' is 'max', 'min', or 'sum'
    df['variable'] = df.apply(
        lambda row: f"{row['variable']}_{row['aggregation']}" if row['aggregation'] in ['max', 'min', 'sum'] else row['variable'],
        axis=1
    )
    
    # Drop unnecessary columns
    df.drop(columns=['unit', 'level', 'timeResolution', 'aggregation'], inplace=True)
    
    # Melt the DataFrame
    df = df.melt(
        id_vars=['location', 'lat', 'lon', 'asl', 'variable'],  
        var_name='date',    
        value_name='value'   
    )
    
    # Convert 'date' to datetime
    df['date'] = pd.to_datetime(df['date'], format='%Y%m%dT%H%M', errors='coerce')
    df['variable'] = df['variable'].apply(lambda x: '_'.join(x.split(' ')[1:]).replace(' ', '_'))
    return df

def preprocess_meter_blue_data_static(df):    
    # Concatenate 'variable' with 'aggregation' when 'aggregation' is 'max', 'min', or 'sum'
    df['variable'] = df.apply(
        lambda row: f"{row['variable']}_{row['aggregation']}" if row['aggregation'] in ['max', 'min', 'sum'] else row['variable'],
        axis=1
    )
    
    # Drop unnecessary columns
    df.drop(columns=['unit', 'level', 'timeResolution', 'aggregation'], inplace=True)
    
    # Melt the DataFrame
    df = df.melt(
        id_vars=['location', 'lat', 'lon', 'asl', 'variable'],  
        var_name='date',    
        value_name='value'   
    )
    
    # Convert 'date' to datetime
    df['date'] = pd.to_datetime(df['date'], format='%Y%m%dT%H%M', errors='coerce')
    df['variable'] = df['variable'].apply(lambda x: '_'.join(x.split(' ')[1:]).replace(' ', '_'))
    return df

def preprocess_gov_in_data(df):
    
    
    df.drop(columns=['Unnamed: 0'], inplace=True)
    df.rename(columns={'Unnamed: 1': 'State', 'Unnamed: 2': '2009-10', 'Unnamed: 3': '2010-11'}, inplace=True)

    return df
    
def load_data(file):
    if file == 'METER_BLUE_DATA':
        df_dynamic = load_csv_data(METER_BLUE_DATA_PATH)
        df_dynamic = preprocess_meter_blue_data(df_dynamic)
        
        df_static = load_csv_data(METER_BLUE_STATIC_PATH)
        df_static = preprocess_meter_blue_data_static(df_static)
        
        # Apply forward fill to the 'value' column after sorting by 'date' within each group
        df_static['value'] = df_static.groupby(['location', 'variable'], group_keys=False).apply(
            lambda group: group.sort_values('date')['value'].ffill()
        )
        df_static = df_static.dropna(subset=['value'])
        
        # Create a date range that covers all dates in the dynamic DataFrame
        date_range = pd.date_range(start=df_dynamic['date'].min(), end=df_dynamic['date'].max(), freq='D')
        
        # Create a DataFrame with all combinations of location, variable, and date
        unique_combinations = df_static[['location', 'variable']].drop_duplicates()
        expanded_dates = pd.DataFrame(date_range, columns=['date'])
        df_static_expanded = unique_combinations.merge(expanded_dates, how='cross')
        
        # Merge the expanded date DataFrame with the static data
        df_static_expanded = df_static_expanded.merge(df_static, on=['location', 'variable'], how='left')
        
        df_static_expanded = df_static_expanded[['location', 'variable', 'date_x', 'lat', 'lon', 'asl', 'value']]
        df_static_expanded.rename(columns={'date_x': 'date'}, inplace=True)
        
        # Map the asl values from df_dynamic to df_static_expanded based on location
        df_static_expanded = df_static_expanded.drop(columns=['asl'])
        print(df_dynamic[['location', 'asl']])
        df_static_expanded = df_static_expanded.merge(df_dynamic[['location', 'asl']].drop_duplicates(), on='location', how='left')
        
        # Concatenate the dynamic and expanded static DataFrames
        df = pd.concat([df_dynamic, df_static_expanded], ignore_index=True)
    return df



# if __name__ == "__main__":
    # load_data('METER_BLUE_DATA')
    # load_data('IN_GOV_DATA_PATH')