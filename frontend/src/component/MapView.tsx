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
  source: string;
  destination: string;
  trigger: boolean; 
}

export default function MapView({ source, destination, trigger }: Props) {
  const [route, setRoute] = useState<RouteSearch | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!source || !destination) return;

    const fetchRoute = async () => {
      try {
        setLoading(true);
        setError(null);
        setRoute(null);

        const res = await fetchRoutes(source,destination) ;

        const data: RouteSearch = await res.json();
        setRoute(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching route');
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [source, destination, trigger]);

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
      <Typography variant="subtitle1" mb={1}>
        Distance: {route.distanceKm.toFixed(2)} km | Duration: {route.durationMin.toFixed(2)} min
      </Typography>

      <MapContainer
        center={[route.sourceLat, route.sourceLng]}
        zoom={6}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={latLngs} color="blue" />
      </MapContainer>
    </Box>
  );
}
