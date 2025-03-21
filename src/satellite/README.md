# Satellite Imagery Analysis System

This module implements a comprehensive system for processing and analyzing satellite imagery data using the Sentinel Hub API. The system provides functionality for retrieving, processing, and analyzing satellite imagery for agricultural applications.

## Overview

The system provides capabilities for:

- Retrieving satellite imagery from Sentinel Hub
- Processing and analyzing vegetation indices
- Generating field maps and visualizations
- Calculating field statistics and metrics

## Core Components

### 1. Data Retrieval

- Integration with Sentinel Hub API
- Support for multiple satellite data sources
- Configurable time ranges and spatial resolutions
- Efficient data caching and storage

### 2. Vegetation Indices

The system calculates several important vegetation indices:

- NDVI (Normalized Difference Vegetation Index)
- EVI (Enhanced Vegetation Index)
- NDRE (Normalized Difference Red Edge Index)
- LAI (Leaf Area Index)

### 3. Field Analysis

- Field boundary detection and processing
- Zonal statistics calculation
- Temporal analysis of vegetation patterns
- Field health monitoring

### 4. Visualization

- Interactive field maps
- Time series plots
- Statistical visualizations
- Custom color schemes for different indices

## Data Requirements

### Input Data

- Sentinel Hub credentials
- Field boundaries (GeoJSON format)
- Time period of interest
- Desired vegetation indices

### Data Format

- Satellite imagery: GeoTIFF format
- Field boundaries: GeoJSON format
- Time series data: CSV format

## Usage

### Configuration

```python
from src.satellite.config import Config

# Initialize configuration
config = Config(
    instance_id='your_instance_id',
    client_id='your_client_id',
    client_secret='your_client_secret'
)
```

### Retrieving Satellite Data

```python
from src.satellite.sentinel import SentinelHub

# Initialize Sentinel Hub client
sentinel = SentinelHub(config)

# Get satellite imagery
imagery = sentinel.get_imagery(
    field_id='field_1',
    start_date='2023-01-01',
    end_date='2023-12-31'
)
```

### Processing Vegetation Indices

```python
from src.satellite.indices import calculate_indices

# Calculate vegetation indices
indices = calculate_indices(imagery)
```

### Generating Field Maps

```python
from src.satellite.visualization import create_field_map

# Create interactive field map
map_html = create_field_map(field_data, indices)
```

## File Structure

```
src/satellite/
├── config.py
├── sentinel.py
├── indices.py
├── visualization.py
├── utils.py
├── data/
│   ├── imagery/
│   └── fields/
└── README.md
```

## Dependencies

- sentinelhub
- geopandas
- numpy
- pandas
- folium
- matplotlib
- rasterio

## API Integration

### Sentinel Hub Configuration

```python
INSTANCEID = 'your_instance_id'
CLIENTID = 'your_client_id'
CLIENTSECRET = 'your_client_secret'
```

### Available Endpoints

- `/imagery`: Retrieve satellite imagery
- `/indices`: Calculate vegetation indices
- `/analysis`: Perform field analysis
- `/visualization`: Generate maps and plots

## Visualization Features

### Field Maps

- Interactive web-based maps
- Multiple layer support
- Custom styling options
- Time series visualization

### Statistical Plots

- NDVI time series
- Field health trends
- Anomaly detection
- Seasonal patterns

## Notes

- The system requires valid Sentinel Hub credentials
- Processing large areas may require significant computational resources
- Data caching is implemented to improve performance
- Field boundaries must be in WGS84 coordinate system
- Vegetation indices are calculated using standard formulas
- The system supports both historical and real-time data analysis
