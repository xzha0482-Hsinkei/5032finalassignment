// functions/orsProxy.js
import { onRequest } from "firebase-functions/v2/https";
import fetch from "node-fetch";
import { defineSecret } from "firebase-functions/params";

const ORS_API_KEY = defineSecret("ORS_API_KEY");

export const orsProxy = onRequest(
  { cors: true, region: "us-central1", secrets: [ORS_API_KEY] },
  async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ error: "Missing start or end parameter" });
    }

    try {
      // Step 1: Convert addresses to coordinates
      const geoRes = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY.value()}&text=${encodeURIComponent(start)}`
      );
      const geoDataStart = await geoRes.json();
      const startCoord = geoDataStart.features?.[0]?.geometry?.coordinates;

      const geoRes2 = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY.value()}&text=${encodeURIComponent(end)}`
      );
      const geoDataEnd = await geoRes2.json();
      const endCoord = geoDataEnd.features?.[0]?.geometry?.coordinates;

      if (!startCoord || !endCoord) {
        return res.status(404).json({ error: "Geocoding failed" });
      }

      // Step 2: Request route between coordinates
      const routeRes = await fetch("https://api.openrouteservice.org/v2/directions/driving-car/geojson", {
        method: "POST",
        headers: {
          "Authorization": ORS_API_KEY.value(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          coordinates: [startCoord, endCoord]
        })
      });

      const routeData = await routeRes.json();
      if (!routeData?.features?.length) {
        return res.status(404).json({ error: "No route found" });
      }

      res.json({ route: routeData.features[0] });
    } catch (err) {
      console.error("ORS proxy error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);
