import geopandas as gpd
import numpy as np
import matplotlib.pyplot as plt
from sentinelhub import SHConfig, SentinelHubRequest, MimeType, CRS, BBox, DataCollection
import json
from shapely.geometry import shape, mapping
import folium
from folium import plugins
from utils import SENTINEL_CLIENTID, SENTINEL_CLIENTSECRET, SENTINEL_INSTANCEID, CROPS_PATH
import logging
import os
from datetime import datetime
from functools import lru_cache
import matplotlib.patches as patches
from sentinelhub import bbox_to_dimensions

# Configure logging
def setup_logger():
    """Configure logging to both file and console."""
    # Create logs directory if it doesn't exist
    if not os.path.exists('logs'):
        os.makedirs('logs')
    
    # Create a timestamp for the log file
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    log_file = f'logs/satellite_{timestamp}.log'
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler()
        ]
    )
    return logging.getLogger(__name__)

# Initialize logger
logger = setup_logger()

# 1. Configure Sentinel Hub with your credentials
config = SHConfig()
config.instance_id = SENTINEL_INSTANCEID
config.sh_client_id = SENTINEL_CLIENTID
config.sh_client_secret = SENTINEL_CLIENTSECRET

def remove_third_coordinate(geojson_data):
    """
    Removes the third coordinate value from every coordinate in the given GeoJSON FeatureCollection.
    
    This function assumes that each coordinate is in the form [longitude, latitude, elevation].
    After processing, each coordinate will only include [longitude, latitude].
    
    Args:
        geojson_data (dict): A GeoJSON FeatureCollection.
        
    Returns:
        dict: The modified GeoJSON FeatureCollection with coordinates as [longitude, latitude].
    """
    # Loop over each feature in the collection.
    for feature in geojson_data.get("features", []):
        geometry = feature.get("geometry", {})
        geom_type = geometry.get("type")
        
        if geom_type == "Polygon":
            # For each linear ring in the polygon, keep only the first two elements of each coordinate.
            geometry["coordinates"] = [
                [point[:2] for point in linear_ring]
                for linear_ring in geometry["coordinates"]
            ]
        elif geom_type == "MultiPolygon":
            # Process each polygon in a MultiPolygon.
            geometry["coordinates"] = [
                [
                    [point[:2] for point in linear_ring]
                    for linear_ring in polygon
                ]
                for polygon in geometry["coordinates"]
            ]
    return geojson_data

@lru_cache(maxsize=32)
def get_field_data(field_id, date, metric='NDVI'):
    """
    Get field data including NDVI and cloud coverage for a specific field and date.
    
    Args:
        field_id (str): The field ID
        date (str): The date in YYYY-MM-DD format
        metric (str): The metric to calculate (default: 'NDVI')
    
    Returns:
        tuple: (field_data, avg_cloud_cover, field_name)
    """
    logger.info(f"Getting field data for field {field_id} on date {date}")
    
    # Load crops data
    with open(CROPS_PATH, 'r') as f:
        crops_data = json.load(f)

    clean_geojson = remove_third_coordinate(crops_data)
    
    # Find the field with matching ID
    field_polygon = None
    field_name = None
    for feature in clean_geojson["features"]:
        # Get the ID from properties and convert to string
        feature_id = str(feature["properties"].get("id", ""))
        if feature_id == str(field_id):
            field_polygon = feature
            field_name = f"Field {field_id}"  # Use a consistent naming scheme
            break
    
    if not field_polygon:
        logger.error(f"Field with ID {field_id} not found")
        raise ValueError(f"Field with ID {field_id} not found")
    
    logger.info(f"Found field: {field_name}")
    
    field_shape = shape(field_polygon["geometry"])
    minx, miny, maxx, maxy = field_shape.bounds
    bbox = BBox(bbox=[minx, miny, maxx, maxy], crs='EPSG:4326')
    
    logger.info(f"Field bounds: {minx}, {miny}, {maxx}, {maxy}")

    # Define evalscript for NDVI and cloud probability
    evalscript = """
    function setup() {
        return {
            input: ["B04", "B08", "CLP", "dataMask"],
            output: { bands: 4, sampleType: "FLOAT32" }
        };
    }

    function evaluatePixel(sample) {
        let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
        // Return B04, B08, NDVI, and the data mask
        return [sample.B04, sample.B08, ndvi, sample.dataMask];
    }
    """

    # Create the Sentinel Hub request
    request = SentinelHubRequest(
        evalscript=evalscript,
        input_data=[
            SentinelHubRequest.input_data(
                data_collection=DataCollection.SENTINEL2_L2A,
                time_interval=(date, date),
                mosaicking_order='leastCC'
            )
        ],
        responses=[
            SentinelHubRequest.output_response('default', MimeType.TIFF)
        ],
        bbox=bbox,
        size=(512, 512),
        config=config
    )

    # Fetch the data
    logger.info("Fetching data from Sentinel Hub...")
    try:
        data = request.get_data()
        logger.info(f"Data shape: {data[0].shape}")
        
        # Check if we got valid data
        if data[0].size == 0:
            logger.error("No data received from Sentinel Hub")
            raise ValueError("No data received from Sentinel Hub")
            
        # Get raw band values
        red_data = data[0][..., 0]    # Red band (B04)
        nir_data = data[0][..., 1]    # NIR band (B08)
        clp_data = data[0][..., 2]    # Cloud Probability band
        
        # Log detailed statistics for each band
        logger.info("\nRed Band (B04) Statistics:")
        logger.info(f"Min: {np.min(red_data):.4f}")
        logger.info(f"Max: {np.max(red_data):.4f}")
        logger.info(f"Mean: {np.mean(red_data):.4f}")
        logger.info(f"Number of zeros: {np.sum(red_data == 0)}")
        logger.info(f"Number of non-zeros: {np.sum(red_data != 0)}")
        
        logger.info("\nNIR Band (B08) Statistics:")
        logger.info(f"Min: {np.min(nir_data):.4f}")
        logger.info(f"Max: {np.max(nir_data):.4f}")
        logger.info(f"Mean: {np.mean(nir_data):.4f}")
        logger.info(f"Number of zeros: {np.sum(nir_data == 0)}")
        logger.info(f"Number of non-zeros: {np.sum(nir_data != 0)}")
        
        logger.info("\nCLP Statistics:")
        logger.info(f"Min: {np.min(clp_data):.4f}")
        logger.info(f"Max: {np.max(clp_data):.4f}")
        logger.info(f"Mean: {np.mean(clp_data):.4f}")
        logger.info(f"Number of zeros: {np.sum(clp_data == 0)}")
        logger.info(f"Number of non-zeros: {np.sum(clp_data != 0)}")
        
        # Calculate NDVI manually
        ndvi_data = np.where(
            (red_data + nir_data) != 0,
            (nir_data - red_data) / (nir_data + red_data),
            0
        )
        
        # Log NDVI statistics
        logger.info("\nCalculated NDVI Statistics:")
        logger.info(f"Min: {np.min(ndvi_data):.4f}")
        logger.info(f"Max: {np.max(ndvi_data):.4f}")
        logger.info(f"Mean: {np.mean(ndvi_data):.4f}")
        logger.info(f"Number of zeros: {np.sum(ndvi_data == 0)}")
        logger.info(f"Number of non-zeros: {np.sum(ndvi_data != 0)}")
        
        # Check if we have any valid data
        if np.all(ndvi_data == 0):
            logger.warning("All NDVI values are zero. This might indicate:")
            logger.warning("1. No valid data for the selected date")
            logger.warning("2. The field location is outside Sentinel-2 coverage")
            logger.warning("3. The data mask is filtering out all pixels")
            logger.warning("4. The bands contain invalid values")
            logger.warning("5. The date might not have any cloud-free images")
            logger.warning("6. The bounding box might be incorrect or too small")
        
    except Exception as e:
        logger.error(f"Error fetching data: {str(e)}")
        raise

    # Create a GeoDataFrame with the field boundary
    field_gdf = gpd.GeoDataFrame({'geometry': [field_shape]}, crs='EPSG:4326')
    
    # Calculate average cloud coverage
    avg_cloud_cover = float(np.mean(clp_data))  # Convert to Python float
    logger.info(f"Average cloud coverage: {avg_cloud_cover:.2f}%")

    # Create a grid of points within the field
    x = np.linspace(minx, maxx, 512)
    y = np.linspace(miny, maxy, 512)
    xx, yy = np.meshgrid(x, y)
    
    # Create points GeoDataFrame
    points = []
    for i in range(512):
        for j in range(512):
            if field_shape.contains(shape({'type': 'Point', 'coordinates': [xx[i,j], yy[i,j]]})):
                points.append({
                    'geometry': shape({'type': 'Point', 'coordinates': [xx[i,j], yy[i,j]]}),
                    f'{metric}_{date}': float(ndvi_data[i,j]),  # Convert to Python float
                    f'CLP_{date}': float(clp_data[i,j])  # Convert to Python float
                })
    
    field_data = gpd.GeoDataFrame(points, crs='EPSG:4326')
    logger.info(f"Number of points created: {len(points)}")
    
    return field_data, avg_cloud_cover, field_name

def visualize_field_data(field_data, field_name, date, metric='NDVI'):
    """
    Create an interactive map with the field data overlaid on a satellite image using Folium.
    
    Args:
        field_data (GeoDataFrame): The field data
        field_name (str): Name of the field
        date (str): The date
        metric (str): The metric being visualized
    """
    # Calculate the bounding box dimensions
    minx, miny, maxx, maxy = field_data.total_bounds  # Unpack the total_bounds array
    bbox = BBox(bbox=(minx, miny, maxx, maxy), crs=CRS.WGS84)  # Use unpacked values
    width, height = bbox_to_dimensions(bbox, resolution=10)

    # Define evalscript for true color image
    evalscript_true_color = """
    function setup() {
        return {
            input: ["B04", "B03", "B02"],
            output: { bands: 3 }
        };
    }

    function evaluatePixel(sample) {
        return [sample.B04, sample.B03, sample.B02];
    }
    """

    # Create the Sentinel Hub request for true color image
    request = SentinelHubRequest(
        evalscript=evalscript_true_color,
        input_data=[
            SentinelHubRequest.input_data(
                data_collection=DataCollection.SENTINEL2_L2A,
                time_interval=(date, date),
                mosaicking_order='leastCC'
            )
        ],
        responses=[
            SentinelHubRequest.output_response('default', MimeType.PNG)
        ],
        bbox=bbox,
        size=(width, height),
        config=config
    )

    # Fetch the true color image
    logger.info("Fetching true color image from Sentinel Hub...")
    image = request.get_data()[0]

    # Create a Folium map centered on the field
    center_lat = (miny + maxy) / 2
    center_lon = (minx + maxx) / 2
    m = folium.Map(location=[center_lat, center_lon], zoom_start=100)

    # Add the true color image as an overlay
    folium.raster_layers.ImageOverlay(
        image=image,
        bounds=[[miny, minx], [maxy, maxx]],
        opacity=0.7
    ).add_to(m)

    # Overlay the NDVI data as a heatmap
    ndvi_points = [
        [geom.y, geom.x, ndvi] for geom, ndvi in zip(field_data['geometry'], field_data[f'{metric}_{date}'])
    ]
    folium.plugins.HeatMap(ndvi_points, min_opacity=0.2, max_val=1, radius=5, blur=7, gradient={0.2: 'blue', 0.4: 'lime', 0.6: 'yellow', 0.8: 'orange', 1: 'red'}).add_to(m)

    # Save the map to an HTML file
    output_map = f"{field_name}_field_map_{date}.html"
    m.save(output_map)
    logger.info(f"Map saved to {output_map}")

    # Display the map
    return m

def main(field_id, date, metric='NDVI'):
    """
    Main function to process field data and create visualizations.
    
    Args:
        field_id (str): The field ID
        date (str): The date in YYYY-MM-DD format
        metric (str): The metric to calculate (default: 'NDVI')
    """
    try:
        logger.info(f"Starting processing for field {field_id} on date {date}")
        
        # Get field data
        field_data, avg_cloud_cover, field_name = get_field_data(field_id, date, metric)
        
        # Check cloud coverage
        if avg_cloud_cover > 80:
            logger.warning(f'⚠️ Warning: The Average Cloud Cover is {avg_cloud_cover:.2f}%')
            logger.warning('Please Select A Different Date')
            return
        
        # Create and save the image
        visualize_field_data(field_data, field_name, date, metric)
        
        # Convert geometries to GeoJSON format before serialization
        field_data['geometry'] = field_data['geometry'].apply(lambda x: mapping(x))
        
        # Convert numpy types to Python native types
        field_data_dict = field_data.to_dict(orient='records')
        for record in field_data_dict:
            for key, value in record.items():
                if isinstance(value, (np.float32, np.float64, np.int32, np.int64)):
                    record[key] = float(value)
        
        # Export data
        output = {
            "indicator_name": metric,  # Add indicator name
            "date": date,  # Add date
            "raw_values": field_data_dict,
            "statistics": {
                "mean": float(field_data[f'{metric}_{date}'].mean()),
                "std": float(field_data[f'{metric}_{date}'].std()),
                "quartiles": {
                    "25%": float(field_data[f'{metric}_{date}'].quantile(0.25)),
                    "50%": float(field_data[f'{metric}_{date}'].quantile(0.5)),
                    "75%": float(field_data[f'{metric}_{date}'].quantile(0.75))
                }
            }
        }
        
        output_path = f"{field_name}_field_data_{date}.json"
        with open(output_path, "w") as json_file:
            json.dump(output, json_file, indent=4)
        logger.info(f"\nData exported to {output_path}")
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise

if __name__ == "__main__":
    # Example usage
    field_id = "6"  # Replace with your field ID
    date = "2023-06-14"   # Replace with your desired date
    main(field_id, date)
