# Agricultural Risk Forecasting System

This module implements a machine learning-based forecasting system for agricultural risks, including yield risk, drought index, and heat stress indicators. The system uses advanced feature engineering techniques and XGBoost models to provide accurate predictions.

## Overview

The forecasting system predicts four key agricultural risk indicators:

- Yield Risk
- Drought Index
- Daytime Heat Stress
- Nighttime Heat Stress

## Feature Engineering Pipeline

### 1. Location Encoding

- Locations are encoded using ordinal encoding to convert categorical location names into numerical values
- The encoding mapping is preserved for decoding predictions back to original location names

### 2. Time-Based Features

- Hour of day
- Day of week
- Month
- Day of month
- Weekend indicator
- Cyclical encoding for day of week (sine and cosine transformations)

### 3. Lag Features

For each dependent variable, the following lag features are created:

- Primary lag features (30-day window)
- 1-day lag
- 24-hour lag
- 7-day lag
- 14-day lag

### 4. Rolling Statistics

For each dependent variable, the following rolling statistics are calculated:

- 7-day window:
  - Mean
  - Standard deviation
  - 75th percentile
- 28-day window:
  - Mean
  - Standard deviation

### 5. Interaction Features

- Interaction terms between lag features and cyclical time features
- Helps capture complex temporal patterns

## Model Architecture

### Training Process

1. Data Preparation

   - Load and preprocess input data
   - Apply feature engineering pipeline
   - Handle missing values
   - Winsorize dependent variables to handle outliers

2. Model Training
   - Uses XGBoost with custom asymmetric loss function
   - Implements rolling window cross-validation
   - Early stopping to prevent overfitting

### Custom Loss Function

- Asymmetric MAPE (Mean Absolute Percentage Error)
- Weights overpredictions more heavily than underpredictions
- Helps prevent underestimation of risks

## Data Requirements

### Input Data

- Historical weather data
- Soil moisture data
- Temperature data (max/min)
- Precipitation data
- Location information

### Data Format

- CSV format with the following columns:
  - date
  - location
  - variable
  - value

## Usage

### Training

```python
from src.forecast.train import main

# Run the training pipeline
main()
```

### Output

The system generates:

1. Feature-engineered dataset (`df_fe.csv`)
2. Forecast values (`forecast_values.csv`)

## Model Parameters

### XGBoost Parameters

```python
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
    'seed': 42
}
```

## Dependencies

- pandas
- numpy
- scikit-learn
- xgboost
- lightgbm

## File Structure

```
src/forecast/
├── data/
│   ├── df_fe.csv
│   └── forecast_values.csv
├── feature_engineering.py
├── train.py
└── README.md
```

## Notes

- The system uses a 30-day forecast horizon
- Predictions are made for each location independently
- The model includes early stopping to prevent overfitting
- Feature engineering includes both temporal and spatial considerations
