import React, {
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
  useMemo,
} from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPoint } from "@/hooks/useMapData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Delaunay } from "d3-delaunay";

// Fallback display when Google Maps can't load
const MapFallback = ({ error }: { error: string | null }) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-center w-full h-[600px] bg-muted rounded-md">
      <p className="text-muted-foreground text-center px-4">
        {error || t("unable_to_load_map")}
      </p>
    </div>
  );
};

// Map legend component
const MapLegend = () => {
  const { t } = useLanguage();

  return (
    <div className="absolute bottom-2 right-2 bg-white/80 p-2 rounded-md shadow-md z-10 text-xs">
      <div className="font-medium mb-1">{t("ndvi_legend")}</div>
      <div className="flex items-center gap-1">
        <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
        <span>{t("low")} (0.2)</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
        <span>{t("healthy_vegetation")} (0.4)</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
        <span>{t("moderate_vegetation")} (0.6)</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-1"></span>
        <span>{t("high")} (0.8)</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
        <span>{t("very_high")} (1.0)</span>
      </div>
    </div>
  );
};

interface FarmMapProps {
  points: MapPoint[];
  isLoading?: boolean;
}

// Helper function to get color based on NDVI value
const getNdviColor = (value: number): string => {
  // Normalize value to 0-1 range
  const normalizedValue = value / 100;

  if (normalizedValue <= 0.2) return "rgba(0, 0, 255, 0.7)"; // Blue
  if (normalizedValue <= 0.4) return "rgba(0, 255, 0, 0.7)"; // Green
  if (normalizedValue <= 0.6) return "rgba(255, 255, 0, 0.7)"; // Yellow
  if (normalizedValue <= 0.8) return "rgba(255, 165, 0, 0.7)"; // Orange
  return "rgba(255, 0, 0, 0.7)"; // Red
};

// Helper to check if a point is inside a polygon
const isPointInPolygon = (
  point: [number, number],
  polygon: [number, number][]
) => {
  const x = point[0];
  const y = point[1];
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
};

const FarmMap: React.FC<FarmMapProps> = ({ points, isLoading = false }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInitializedRef = useRef<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [opacityValue, setOpacityValue] = useState(0.8);
  const [map, setMap] = useState<any>(null);
  const [voronoiLayer, setVoronoiLayer] = useState<any>(null);
  const [fieldBoundary, setFieldBoundary] = useState<any>(null);
  const [dotsLayer, setDotsLayer] = useState<any>(null);
  const { t } = useLanguage();

  // First, load the Google Maps script once
  useEffect(() => {
    // Skip if Google Maps is already loaded or we already have an error
    if ((window.google && window.google.maps) || mapError) {
      setGoogleLoaded(true);
      return;
    }

    // Skip if we've already tried to load the script
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) {
      setMapError(t("google_maps_api_key_missing"));
      return;
    }

    // Create script tag to load Google Maps API
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,visualization&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Create a global callback function
    window.initMap = () => {
      setGoogleLoaded(true);
    };

    // Handle errors
    script.onerror = () => {
      setMapError(t("failed_to_load_google_maps"));
    };

    document.head.appendChild(script);

    return () => {
      // Don't remove the script on unmount, as it's needed globally
      if (window.initMap) {
        delete window.initMap;
      }
    };
  }, [mapError, t]);

  // Initialize the map when Google is loaded
  useLayoutEffect(() => {
    if (!googleLoaded || !mapRef.current || mapInitializedRef.current) {
      return;
    }

    try {
      // Set flag to prevent re-initialization
      mapInitializedRef.current = true;

      // Calculate center from a point in India (default if no points)
      const defaultCenter = { lat: 16.9, lng: 81.1 };

      // Create map
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 10,
        maxZoom: 20,
        minZoom: 5,
        mapTypeId: "satellite",
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: false,
      });

      // Store map instance
      setMap(newMap);

      console.log(t("map_initialized_successfully"));
      setMapLoaded(true);
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError(
        error instanceof Error ? error.message : t("map_initialization_error")
      );
      // Reset flag if initialization failed
      mapInitializedRef.current = false;
    }
  }, [googleLoaded, t]);

  // Create and draw Voronoi diagram when points change or map is ready
  useEffect(() => {
    if (!map || isLoading || points.length === 0) {
      if (points.length === 0 && !isLoading) {
        setMapError(t("no_field_data_available"));
      }
      return;
    }

    try {
      console.log(`${t("creating_voronoi")} ${points.length} ${t("points")}`);

      // Find bounds to properly center the map
      const bounds = new window.google.maps.LatLngBounds();
      points.forEach((point) => {
        bounds.extend({ lat: point.lat, lng: point.lng });
      });

      // Fit bounds to show all data
      map.fitBounds(bounds);

      // Clean up previous layers if they exist
      if (voronoiLayer) {
        voronoiLayer.setMap(null);
      }
      if (fieldBoundary) {
        fieldBoundary.setMap(null);
      }
      if (dotsLayer) {
        dotsLayer.forEach((marker: any) => marker.setMap(null));
      }

      // Group points by proximity to create larger cells
      // This helps simplify the visualization when there are many points
      const simplificationFactor = 0.001; // Adjust this value based on your data density
      const pointGroups = new Map();

      points.forEach((point) => {
        // Round coordinates to group nearby points
        const keyLat =
          Math.round(point.lat / simplificationFactor) * simplificationFactor;
        const keyLng =
          Math.round(point.lng / simplificationFactor) * simplificationFactor;
        const key = `${keyLat},${keyLng}`;

        if (!pointGroups.has(key)) {
          pointGroups.set(key, {
            point: { lat: keyLat, lng: keyLng },
            values: [point.value],
            count: 1,
          });
        } else {
          const group = pointGroups.get(key);
          group.values.push(point.value);
          group.count += 1;
        }
      });

      // Calculate average NDVI for each group
      const groupedPoints: MapPoint[] = [];
      pointGroups.forEach((group) => {
        const avgValue =
          group.values.reduce((sum: number, val: number) => sum + val, 0) /
          group.count;
        groupedPoints.push({
          lat: group.point.lat,
          lng: group.point.lng,
          value: avgValue,
        });
      });

      console.log(
        `${t("created")} ${groupedPoints.length} ${t("clustered_points")} ${
          points.length
        } ${t("original_points")}`
      );

      // Calculate the field boundary polygon using the convex hull of the points
      const createConvexHull = (points: MapPoint[]) => {
        if (points.length < 3)
          return points.map((p) => ({ lat: p.lat, lng: p.lng }));

        // Find the point with the lowest y-coordinate (and leftmost if tied)
        let startIndex = 0;
        for (let i = 1; i < points.length; i++) {
          if (
            points[i].lat < points[startIndex].lat ||
            (points[i].lat === points[startIndex].lat &&
              points[i].lng < points[startIndex].lng)
          ) {
            startIndex = i;
          }
        }

        // Swap the starting point to the first position
        [points[0], points[startIndex]] = [points[startIndex], points[0]];

        // Sort the remaining points by polar angle with respect to the starting point
        const sortedPoints = points.slice(1).sort((a, b) => {
          const angleA = Math.atan2(
            a.lat - points[0].lat,
            a.lng - points[0].lng
          );
          const angleB = Math.atan2(
            b.lat - points[0].lat,
            b.lng - points[0].lng
          );
          return angleA - angleB;
        });

        // Construct the convex hull using the Graham scan algorithm
        const hull = [points[0], sortedPoints[0]];

        for (let i = 1; i < sortedPoints.length; i++) {
          while (hull.length >= 2) {
            const a = hull[hull.length - 2];
            const b = hull[hull.length - 1];
            const c = sortedPoints[i];

            // Check if we make a right turn (cross product is negative)
            // If so, pop the last point from the hull
            const cross =
              (b.lng - a.lng) * (c.lat - a.lat) -
              (b.lat - a.lat) * (c.lng - a.lng);
            if (cross > 0) break;
            hull.pop();
          }
          hull.push(sortedPoints[i]);
        }

        // Add some padding to the hull to make it slightly larger than the data points
        const paddedHull = hull.map((p) => ({ lat: p.lat, lng: p.lng }));
        return paddedHull;
      };

      // Create the field boundary from the convex hull
      const hullPoints = createConvexHull(points);

      // Draw the field boundary polygon
      const fieldPolygon = new window.google.maps.Polygon({
        paths: hullPoints,
        strokeColor: "#FFFFFF",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FFFFFF",
        fillOpacity: 0.0,
        map: map,
      });

      setFieldBoundary(fieldPolygon);

      // Create overlay for custom drawing
      class VoronoiOverlay extends window.google.maps.OverlayView {
        private groupedPoints: MapPoint[];
        private opacity: number;
        private boundaryPoints: google.maps.LatLng[];

        constructor(
          groupedPoints: MapPoint[],
          opacity: number,
          boundaryPoints: google.maps.LatLng[]
        ) {
          super();
          this.groupedPoints = groupedPoints;
          this.opacity = opacity;
          this.boundaryPoints = boundaryPoints;
        }

        onAdd() {
          // Create the DIV and set appropriate styles
          const div = document.createElement("div");
          div.style.position = "absolute";
          div.style.width = "100%";
          div.style.height = "100%";
          div.style.pointerEvents = "none";

          // Add a canvas for drawing
          const canvas = document.createElement("canvas");
          canvas.style.width = "100%";
          canvas.style.height = "100%";
          canvas.style.position = "absolute";
          div.appendChild(canvas);

          this.getPanes()!.overlayLayer.appendChild(div);
          this.div = div;
        }

        draw() {
          const overlayProjection = this.getProjection();
          if (!overlayProjection) return;

          const div = this.div as HTMLDivElement;
          const canvas = div.querySelector("canvas") as HTMLCanvasElement;
          const bounds = map.getBounds();
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();

          // Convert bounds to pixels
          const nePixel = overlayProjection.fromLatLngToDivPixel(ne)!;
          const swPixel = overlayProjection.fromLatLngToDivPixel(sw)!;

          // Set canvas dimensions
          const width = nePixel.x - swPixel.x;
          const height = swPixel.y - nePixel.y;
          canvas.width = width;
          canvas.height = height;

          // Position the div
          div.style.left = swPixel.x + "px";
          div.style.top = nePixel.y + "px";
          div.style.width = width + "px";
          div.style.height = height + "px";

          // Get canvas context for drawing
          const ctx = canvas.getContext("2d")!;
          ctx.clearRect(0, 0, width, height);

          // Convert boundary points to pixel coordinates for the clip region
          const boundaryPixels: [number, number][] = this.boundaryPoints.map(
            (latlng) => {
              const pixel = overlayProjection.fromLatLngToDivPixel(latlng)!;
              return [pixel.x - swPixel.x, pixel.y - nePixel.y];
            }
          );

          // Convert lat/lng points to pixel coordinates
          const pixelPoints: [number, number][] = [];
          const pixelToPoint: Map<string, MapPoint> = new Map();

          this.groupedPoints.forEach((point) => {
            const pixel = overlayProjection.fromLatLngToDivPixel(
              new window.google.maps.LatLng(point.lat, point.lng)
            )!;

            // Adjust coordinates relative to div
            const x = pixel.x - swPixel.x;
            const y = pixel.y - nePixel.y;

            // Only use points near or inside the view
            if (
              x >= -100 &&
              y >= -100 &&
              x <= width + 100 &&
              y <= height + 100
            ) {
              pixelPoints.push([x, y]);
              pixelToPoint.set(`${x},${y}`, point);
            }
          });

          // Create Delaunay triangulation for Voronoi diagram
          if (pixelPoints.length > 2) {
            // Need at least 3 points for triangulation
            const delaunay = Delaunay.from(pixelPoints);
            const voronoi = delaunay.voronoi([
              -100,
              -100,
              width + 100,
              height + 100,
            ]);

            // Draw the boundary as a clip path
            ctx.beginPath();
            if (boundaryPixels.length > 2) {
              ctx.moveTo(boundaryPixels[0][0], boundaryPixels[0][1]);
              for (let i = 1; i < boundaryPixels.length; i++) {
                ctx.lineTo(boundaryPixels[i][0], boundaryPixels[i][1]);
              }
              ctx.closePath();

              // Draw a subtle outline for the field boundary
              ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
              ctx.lineWidth = 2;
              ctx.stroke();

              // Set up clipping to this path
              ctx.save();
              ctx.clip();
            }

            // Draw each Voronoi cell within the clipped region
            for (let i = 0; i < pixelPoints.length; i++) {
              const cell = voronoi.cellPolygon(i);
              if (cell) {
                const point = pixelToPoint.get(
                  `${pixelPoints[i][0]},${pixelPoints[i][1]}`
                );

                if (point) {
                  // Check if this cell's center is within or near the field boundary
                  const color = getNdviColor(point.value);

                  ctx.beginPath();
                  ctx.moveTo(cell[0][0], cell[0][1]);
                  for (let j = 1; j < cell.length; j++) {
                    ctx.lineTo(cell[j][0], cell[j][1]);
                  }
                  ctx.closePath();

                  // Fill with NDVI color
                  ctx.fillStyle = color;
                  ctx.globalAlpha = this.opacity;
                  ctx.fill();

                  // Add a thin border for better visibility
                  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
                  ctx.lineWidth = 0.5;
                  ctx.stroke();
                }
              }
            }

            // Restore the canvas context after clipping
            if (boundaryPixels.length > 2) {
              ctx.restore();
            }
          }
        }

        onRemove() {
          if (this.div) {
            this.div.parentNode!.removeChild(this.div);
            delete this.div;
          }
        }

        updateOpacity(opacity: number) {
          this.opacity = opacity;
          this.draw();
        }

        private div?: HTMLDivElement;
      }

      // Create and add Voronoi overlay to map
      const voronoiOverlay = new VoronoiOverlay(
        groupedPoints,
        opacityValue,
        hullPoints.map((p) => new window.google.maps.LatLng(p.lat, p.lng))
      );
      voronoiOverlay.setMap(map);
      setVoronoiLayer(voronoiOverlay);

      // Optional: Add small markers at original points for reference
      const showOriginalPoints = false; // Set to true if you want to see the original points
      if (showOriginalPoints) {
        const markers = points.map(
          (point) =>
            new window.google.maps.Marker({
              position: { lat: point.lat, lng: point.lng },
              map: map,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 2,
                fillColor: "white",
                fillOpacity: 0.5,
                strokeWeight: 0,
              },
            })
        );
        setDotsLayer(markers);
      }
    } catch (error) {
      console.error("Error creating Voronoi diagram:", error);
      setMapError(error instanceof Error ? error.message : t("voronoi_error"));
    }
  }, [map, points, isLoading, t]);

  // Update opacity when control changes
  useEffect(() => {
    if (voronoiLayer) {
      voronoiLayer.updateOpacity(opacityValue);
    }
  }, [voronoiLayer, opacityValue]);

  // Handle opacity change
  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpacityValue(parseFloat(e.target.value));
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[600px] rounded-md" />;
  }

  if (mapError) {
    return <MapFallback error={mapError} />;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-full rounded-md overflow-hidden border">
        <div ref={mapRef} className="w-full h-[600px]" />
        {mapLoaded && <MapLegend />}
        {!mapLoaded && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <Skeleton className="w-full h-full" />
          </div>
        )}
      </div>

      {mapLoaded && (
        <div className="flex flex-col gap-1 p-2 border rounded-md">
          <label className="text-xs font-medium">
            {t("layer_opacity")}: {(opacityValue * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0.2"
            max="1"
            step="0.1"
            value={opacityValue}
            onChange={handleOpacityChange}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

// Add TypeScript declaration for the global callback
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default FarmMap;
