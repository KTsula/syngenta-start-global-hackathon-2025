import meteoblue_dataset_sdk
import logging

# Display information about the current download state
logging.basicConfig(level=logging.INFO)

query = {
    "units": {
        "temperature": "C",
        "velocity": "km/h",
        "length": "metric",
        "energy": "watts",
    },
    "geometry": {
        "type": "MultiPoint",
        "coordinates": [[7.57327, 47.558399, 279]],
        "locationNames": ["Basel"],
    },
    "format": "protobuf",
    "timeIntervals": ["2019-01-01T+04:00/2019-01-01T+04:00"],
    "timeIntervalsAlignment": "none",
    "queries": [
        {
            "domain": "NEMSGLOBAL",
            "gapFillDomain": None,
            "timeResolution": "hourly",
            "codes": [{"code": 11, "level": "2 m above gnd"}],
        }
    ],
}
client = meteoblue_dataset_sdk.Client(apikey="9c579db416ae")
result = client.query_sync(query)
print(result)
# result is a structured object containing timestamps and data

timeInterval = result.geometries[0].timeIntervals[0]
data = result.geometries[0].codes[0].timeIntervals[0].data

print(timeInterval)
# start: 1546286400
# end: 1546372800
# stride: 3600