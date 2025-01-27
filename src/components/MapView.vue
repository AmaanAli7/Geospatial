<template>
  <div>
    <div id="map" style="height: 500px; width: 100%;"></div>
    <!-- Buttons -->
    <div id="controls">
      <button id="toggle-draw" @click="toggleDraw">
        {{ drawEnabled ? "Disable Draw" : "Enable Draw" }}
      </button>
      <button id="measure-distance" @click="enableMeasurement">
        {{ measuring ? "Stop Measurement" : "Measure Distance" }}
      </button>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix marker icon paths for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default {
  name: "MapView",
  data() {
    return {
      map: null,
      drawControl: null,
      drawnItems: null,
      drawEnabled: true,
      measuring: false,
      measureLayer: null,
    };
  },
  mounted() {
    // Initialize the map
    this.map = L.map("map").setView([28.6139, 77.2090], 10);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(this.map);

    // Add a feature group for drawn items
    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    // Add draw control
    this.drawControl = new L.Control.Draw({
      edit: {
        featureGroup: this.drawnItems,
      },
      draw: {
        polygon: true,
        rectangle: true,
        circle: true,
        marker: true,
        polyline: true,
      },
    });
    this.map.addControl(this.drawControl);

    // Handle draw events
    this.map.on("draw:created", (event) => {
      const { layer } = event;
      this.drawnItems.addLayer(layer);
      console.log("Shape drawn:", layer.toGeoJSON());
    });
  },
  methods: {
    toggleDraw() {
      if (this.drawEnabled) {
        this.map.removeControl(this.drawControl);
        console.log("Drawing tools disabled");
      } else {
        this.map.addControl(this.drawControl);
        console.log("Drawing tools enabled");
      }
      this.drawEnabled = !this.drawEnabled;
    },
    enableMeasurement() {
      if (this.measuring) {
        // Stop measurement mode
        this.map.off("click", this.addMeasurementPoint);
        if (this.measureLayer) {
          this.map.removeLayer(this.measureLayer);
          this.measureLayer = null;
        }
        this.measuring = false;
        console.log("Measurement mode disabled");
      } else {
        // Start measurement mode
        this.measuring = true;
        this.measureLayer = L.polyline([], { color: "blue" }).addTo(this.map);
        this.map.on("click", this.addMeasurementPoint);
        console.log("Measurement mode enabled");
      }
    },
    addMeasurementPoint(event) {
      const latlng = event.latlng;
      this.measureLayer.addLatLng(latlng);

      // Calculate total distance
      const latlngs = this.measureLayer.getLatLngs();
      let totalDistance = 0;
      for (let i = 1; i < latlngs.length; i++) {
        totalDistance += latlngs[i - 1].distanceTo(latlngs[i]);
      }

      // Format distance
      const distanceText =
        totalDistance >= 1000
          ? `${(totalDistance / 1000).toFixed(2)} km`
          : `${Math.round(totalDistance)} m`;

      // Display distance on last clicked point
      L.popup()
        .setLatLng(latlng)
        .setContent(`Total Distance: ${distanceText}`)
        .openOn(this.map);

      console.log(`Total Distance: ${distanceText}`);
    },
  },
};
</script>

<style>
/* Map container */
#map {
  border: 2px solid #ddd;
  border-radius: 8px;
  margin: 10px 0;
}

/* Buttons container */
#controls {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  justify-content: center;
}

/* Button styles */
button {
  background-color: #007bff;
  color: white;
  border: 1px solid #0056b3;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}
</style>
