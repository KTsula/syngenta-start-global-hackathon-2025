from sentinelhub import SHConfig, SentinelHubRequest, MimeType, CRS, BBox, DataCollection
from utils import SENTINEL_CLIENTID, SENTINEL_CLIENTSECRET, SENTINEL_INSTANCEID

# Configure Sentinel Hub
config = SHConfig()
config.instance_id = SENTINEL_INSTANCEID
config.sh_client_id = SENTINEL_CLIENTID
config.sh_client_secret = SENTINEL_CLIENTSECRET

# Create a simple test request
evalscript = """
//VERSION=3
function setup() {
  return {
    input: ["B04", "B08"],
    output: {
      bands: 1,
      sampleType: "FLOAT32"
    }
  };
}

function evaluatePixel(sample) {
  return [index(sample.B08, sample.B04)];
}
"""

# Test bbox (a small area in Switzerland)
bbox = BBox(bbox=[7.5, 46.5, 7.6, 46.6], crs=CRS.WGS84)

request = SentinelHubRequest(
    evalscript=evalscript,
    input_data=[
        SentinelHubRequest.input_data(
            data_collection=DataCollection.SENTINEL2_L2A,
            time_interval=("2023-08-30", "2023-08-30"),
            mosaicking_order='leastCC'
        )
    ],
    responses=[
        SentinelHubRequest.output_response('default', MimeType.TIFF)
    ],
    bbox=bbox,
    size=(100, 100),
    config=config
)

print("Testing Sentinel Hub connection...")
try:
    data = request.get_data()
    print("Success! Data shape:", data[0].shape)
    print("Data range:", data[0].min(), "to", data[0].max())
except Exception as e:
    print("Error:", str(e)) 