import axios from 'axios';
import { useState } from 'react';
import MapView from './component/MapView';
import { Button, TextField, Box } from '@mui/material';

function App() {
  const [src, setSrc] = useState('');
  const [dst, setDst] = useState('');
  const [info, setInfo] = useState<any>(null);
  const [coords, setCoords] = useState<[number, number][]>([]);

  const search = async () => {
    try {
      const res = await axios.get('http://localhost:2027/api/routes', {
        params: { source: src, destination: dst },
      });

      // ✅ Expecting backend to return something like:
      // { distanceKm, durationMin, coordinates: [[lat, lng], [lat, lng], ...] }

      setInfo({
        distanceKm: res.data.distanceKm,
        durationMin: res.data.durationMin,
      });

      if (res.data.coordinates && res.data.coordinates.length > 0) {
        setCoords(res.data.coordinates);
      }
    } catch (err) {
      console.error('Error fetching route:', err);
    }
  };

  return (
    <Box p={3}>
      <TextField
        label="Source"
        value={src}
        onChange={(e) => setSrc(e.target.value)}
        sx={{ mr: 2 }}
      />
      <TextField
        label="Destination"
        value={dst}
        onChange={(e) => setDst(e.target.value)}
        sx={{ mr: 2 }}
      />
      <Button variant="contained" onClick={search}>
        Search
      </Button>

      {info && (
        <Box mt={2}>
          <p>
            Distance: {info.distanceKm.toFixed(2)} km | Duration:{' '}
            {info.durationMin.toFixed(2)} min
          </p>
        </Box>
      )}

      {coords.length > 0 && (
        <Box mt={2}>
          <MapView source={src} destination={dst} />

        </Box>
      )}
    </Box>
  );
}

export default App;
