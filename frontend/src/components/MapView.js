import React, { useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const GOOGLE_MAPS_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY || "";

const MapView = ({ foods }) => {
  const [selected, setSelected] = useState(null);

  // Check key FIRST before trying to load
  if (!GOOGLE_MAPS_KEY) {
    return (
      <div style={styles.noKey}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>🗺️</div>
        <strong>Google Maps key missing</strong>
        <p style={{ margin: "8px 0 0", fontSize: 13 }}>
          Add <code>REACT_APP_GOOGLE_MAPS_KEY=your_key</code> in{" "}
          <code>frontend/.env</code> and restart React.
        </p>
      </div>
    );
  }

  return (
    <MapInner foods={foods} selected={selected} setSelected={setSelected} />
  );
};

// Separate inner component so useJsApiLoader only runs when key exists
const MapInner = ({ foods, selected, setSelected }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_KEY,
  });

  const center =
    foods && foods.length > 0 && foods[0].location?.lat
      ? { lat: foods[0].location.lat, lng: foods[0].location.lng }
      : { lat: 14.4644, lng: 75.9239 }; // Default: Davangere, Karnataka

  if (loadError) {
    return (
      <div style={styles.error}>
        ❌ Failed to load Google Maps. Check your API key is valid and has{" "}
        <strong>Maps JavaScript API</strong> enabled.
        <p style={{ fontSize: 12, marginTop: 8, color: "#888" }}>
          {loadError.message}
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap mapContainerStyle={styles.container} center={center} zoom={13}>
      {foods &&
        foods.map((food) =>
          food.location?.lat ? (
            <Marker
              key={food._id}
              position={{ lat: food.location.lat, lng: food.location.lng }}
              onClick={() => setSelected(food)}
            />
          ) : null,
        )}
      {selected && (
        <InfoWindow
          position={{ lat: selected.location.lat, lng: selected.location.lng }}
          onCloseClick={() => setSelected(null)}
        >
          <div style={{ maxWidth: 200 }}>
            <strong style={{ color: "#2e7d32" }}>{selected.title}</strong>
            <p style={{ margin: "4px 0", fontSize: 12 }}>
              📦 {selected.quantity}
            </p>
            <p style={{ margin: "2px 0", fontSize: 12 }}>
              🏷️ {selected.category}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
              📍 {selected.address}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

const styles = {
  container: { width: "100%", height: "420px", borderRadius: 12 },
  noKey: {
    background: "#fff8e1",
    border: "1.5px dashed #ffb300",
    padding: "28px 20px",
    borderRadius: 12,
    textAlign: "center",
    color: "#555",
  },
  error: {
    background: "#fbe9e7",
    border: "1.5px solid #ef9a9a",
    padding: "20px",
    borderRadius: 12,
    color: "#c62828",
    fontSize: 14,
  },
  loading: {
    height: 420,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f9fbe7",
    borderRadius: 12,
    color: "#888",
    gap: 12,
  },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid #c8e6c9",
    borderTop: "3px solid #2e7d32",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

export default MapView;
