import { Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import MapView from './MapView';

export default function SearchForm() {
  const [src, setSrc] = useState('');
  const [dst, setDst] = useState('');
  const [trigger, setTrigger] = useState(false);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload
    if (!src.trim() || !dst.trim()) return; // simple validation
    setTrigger(prev => !prev); // trigger MapView update
  };

  return (
    <Box p={3}>
      <form onSubmit={handleSubmit}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Source"
            value={src}
            required
            onChange={(e) => setSrc(e.target.value)}
          />
          <TextField
            label="Destination"
            value={dst}
            required
            onChange={(e) => setDst(e.target.value)}
          />
          <Button type="submit" variant="contained">
            Search
          </Button>
        </Box>
      </form>

      {trigger && (
        <Box mt={3}>
          <MapView source={src} destination={dst} trigger={trigger} />
        </Box>
      )}
    </Box>
  );
}
