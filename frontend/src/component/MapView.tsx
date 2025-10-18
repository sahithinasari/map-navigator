import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, CircularProgress, Typography } from '@mui/material';
import { fetchRoutes } from "../clients/RouteSearchService";

interface RouteSearch {
  sourceLat: number;
  sourceLng: number;
  destLat: number;
  destLng: number;
  distanceKm: number;
  durationMin: number;
  coordinates: [number, number][]; // [[lon, lat], ...]
}

interface Props {
  sourceLabel: string;
  destinationLabel: string;
  sourceLat: number;
  sourceLng: number;
  destLat: number;
  destLng: number;
  trigger: boolean;
}

export default function MapView({ sourceLabel, destinationLabel, sourceLat, sourceLng, destLat, destLng, trigger }: Props) {
  const [route, setRoute] = useState<RouteSearch | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setLoading(true);
        setError(null);
        setRoute(null);

        const res = await fetchRoutes(sourceLabel, destinationLabel, sourceLat, sourceLng, destLat, destLng);
        const data: RouteSearch = await res.json();
        setRoute(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching route');
      } finally {
        setLoading(false);
      }
    };

    if (trigger) fetchRoute();
  }, [sourceLabel, destinationLabel, sourceLat, sourceLng, destLat, destLng, trigger]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={2}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" mt={2}>
        {error}
      </Typography>
    );

  if (!route) return null;

  // Convert [[lon, lat]] → [[lat, lon]] for Leaflet
  const latLngs: [number, number][] = route.coordinates.map(([lon, lat]) => [lat, lon]);

  return (
    <Box>
      {/* Floating info card */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          bgcolor: "rgba(255,255,255,0.85)",
          p: 1.5,
          borderRadius: 2,
          boxShadow: 3,
          zIndex: 1000,
        }}
      >
        <Typography variant="body2">
          Distance: {route.distanceKm.toFixed(2)} km
        </Typography>
        <Typography variant="body2">
          Duration: {route.durationMin.toFixed(2)} min
        </Typography>
      </Box>

      <MapContainer
        center={[route.sourceLat, route.sourceLng]}
        zoom={13} // closer zoom for intra-city routes
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={latLngs} color="blue" />
      </MapContainer>
    </Box>
  );
}
