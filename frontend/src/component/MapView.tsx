import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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
}

export default function MapView({ source, destination }: Props) {
  const [route, setRoute] = useState<RouteSearch | null>(null);

  useEffect(() => {
    if (!source || !destination) return;

    async function fetchRoute() {
      try {
        const res = await fetch(
          `http://localhost:2027/api/routes?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`
        );
        const data: RouteSearch = await res.json();
        setRoute(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchRoute();
  }, [source, destination]);

  if (!route) return null;

  // Convert [[lon, lat]] → [[lat, lon]] for Leaflet
  const latLngs: [number, number][] = route.coordinates.map(([lon, lat]) => [lat, lon]);

  return (
    <MapContainer
      center={[route.sourceLat, route.sourceLng]}
      zoom={6}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline positions={latLngs} color="blue" />
    </MapContainer>
  );
}
