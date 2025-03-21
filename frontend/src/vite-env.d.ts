
/// <reference types="vite/client" />

// Google Maps Types
declare namespace google {
  namespace maps {
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }
    
    namespace visualization {
      class HeatmapLayer {
        constructor(options: {
          data: any;
          map: any;
          radius?: number;
          opacity?: number;
          gradient?: string[];
        });
      }
    }
  }
}
