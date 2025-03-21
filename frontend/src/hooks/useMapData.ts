
import { useEffect, useState } from "react";
import fieldData from "@/data/Field 1_field_data_2023-06-14.json";

export interface MapPoint {
  lat: number;
  lng: number;
  value: number;
}

// Update the interface to match the actual structure in the JSON file
interface FieldData {
  raw_values: Array<{
    geometry: {
      type: string;
      coordinates: number[]; // Change from [number, number] to number[] to be more flexible
    };
    NDVI_2023_06_14?: number;
    "NDVI_2023-06-14"?: number;
    CLP_2023_06_14?: number;
    "CLP_2023-06-14"?: number;
    [key: string]: any;
  }>;
  statistics?: { // Add the statistics field that's in the actual data
    mean: number;
    std: number;
    quartiles: {
      "25%": number;
      "50%": number;
      "75%": number;
    };
  };
}

export const useMapData = () => {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log("Loading field data...");
      setIsLoading(true);

      // Type assertion with a two-step approach to avoid direct type conflict
      const typedFieldData = fieldData as unknown as FieldData;

      // Process the field data
      if (!typedFieldData || !Array.isArray(typedFieldData.raw_values)) {
        console.error("Invalid field data format:", typedFieldData);
        throw new Error("Invalid field data format");
      }

      console.log(`Processing ${typedFieldData.raw_values.length} data points`);

      // Add debug to check the structure of the data
      if (typedFieldData.raw_values.length > 0) {
        console.log(
          "First data point sample:",
          JSON.stringify(typedFieldData.raw_values[0])
        );
      }

      const processedPoints: MapPoint[] = typedFieldData.raw_values
        .filter((point) => {
          // Validate point has the required geometry and coordinates
          return (
            point &&
            point.geometry &&
            point.geometry.coordinates &&
            Array.isArray(point.geometry.coordinates) &&
            point.geometry.coordinates.length >= 2
          );
        })
        .map((point) => {
          // Get coordinates (NOTE: GeoJSON uses [longitude, latitude] order)
          const lng = Number(point.geometry.coordinates[0]);
          const lat = Number(point.geometry.coordinates[1]);

          // Get NDVI value from the appropriate field
          // (trying different possible field names)
          const ndviValue = Number(
            point["NDVI_2023-06-14"] ||
              point.NDVI_2023_06_14 ||
              point["CLP_2023-06-14"] ||
              point.CLP_2023_06_14 ||
              0
          );

          // Skip invalid coordinates or NDVI values
          if (isNaN(lat) || isNaN(lng) || isNaN(ndviValue)) {
            console.log("Invalid point data:", { lat, lng, ndviValue, point });
            return null;
          }

          // Normalize NDVI value (typically between -1 and 1 or 0 and 1) to 0-100 for heatmap intensity
          const normalizedValue = Math.min(
            Math.max(ndviValue > 1 ? ndviValue : ndviValue * 100, 0),
            100
          );

          return {
            lat,
            lng,
            value: normalizedValue,
          };
        })
        .filter(Boolean) as MapPoint[];

      console.log(`Processed ${processedPoints.length} valid points`);

      // Log a sample of the processed points for debugging
      if (processedPoints.length > 0) {
        console.log("Sample points:", processedPoints.slice(0, 3));
      }

      setPoints(processedPoints);
    } catch (err) {
      console.error("Error processing field data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to process field data"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { points, isLoading, error };
};
