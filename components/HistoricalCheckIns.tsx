import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2hyZXlhc2gxNSIsImEiOiJjbDY0MGx6d3cwZHFkM3FwZ3Mwb2htMGZoIn0.0BtzRvleOZQpq9EiZbBU_A";

export default function HistoricalCheckIns() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(77.5946);
  const [lat, setLat] = useState(12.9716);
  const [zoom, setZoom] = useState(9);
  const [data, setData] = useState([]);
  const wallet = useWallet();
  let baseUrl = "https://proto-api.onrender.com";

  async function fetchCheckins() {
    if (wallet.publicKey) {
      let response = await axios({
        url: `${baseUrl}/checkins`,
        params: {
          user_wallet_address: wallet.publicKey.toString(),
        },
      });
      setData(response.data);
    }
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      projection: {
        name: "mercator",
        center: [lng, lat],
        parallels: [30, 30],
      },
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
      minZoom: 1,
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    // Add the control to the map.
    map.current.addControl(geolocate);
    map.current.on("load", () => {
      geolocate.trigger();
    });
  });

  useEffect(() => {
    fetchCheckins();
  }, [wallet]);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
    console.log(data);
    const marker1 = data.map((d) => {
      new mapboxgl.Marker()
        .setLngLat([d.longitude, d.latitude])
        .setPopup(
          new mapboxgl.Popup()
            .setLngLat([d.longitude, d.latitude])
            .setText(d.message)
        )
        .addTo(map.current);
    });
  }, [data]);

  return (
    <div>
      <div
        className="mapContain"
        style={{ width: `100%`, height: "calc(100vh - 122px)" }}
      >
        <div ref={mapContainer} className="map-container" />
      </div>
    </div>
  );
}
