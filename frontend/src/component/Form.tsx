import { Autocomplete, Box, Button, CircularProgress, TextField } from "@mui/material";
import React, { useState, useMemo } from "react";
import MapView from "./MapView";
import theme from "../styles/theme";
import { fetchSuggestion } from "../clients/RouteSearchService";

// Frontend model for each place suggestion
interface PlaceOption {
  label: string;  // display name
  lat: number;
  lng: number;
}

// DTO returned from backend
interface PlaceSuggestionsDTO {
  suggestions: PlaceOption[];
}

export default function SearchForm() {
  const [src, setSrc] = useState<PlaceOption | null>(null);
  const [dst, setDst] = useState<PlaceOption | null>(null);
  const [srcOptions, setSrcOptions] = useState<PlaceOption[]>([]);
  const [dstOptions, setDstOptions] = useState<PlaceOption[]>([]);
  const [loadingSrc, setLoadingSrc] = useState(false);
  const [loadingDst, setLoadingDst] = useState(false);
  const [trigger, setTrigger] = useState(false);

  // Debounce helper
  const debounce = (func: Function, delay = 300) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch suggestions from backend and unwrap PlaceSuggestions DTO
  const fetchSuggestions = async (
    query: string,
    setOptions: React.Dispatch<React.SetStateAction<PlaceOption[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!query.trim()) return setOptions([]);
    setLoading(true);
    try {
      const res = await fetchSuggestion(query);
      if (!res.ok) {
        setOptions([]);
        return;
      }

      const data: PlaceSuggestionsDTO = await res.json();
      setOptions(data.suggestions || []);
    } catch (e) {
      console.error("Error fetching suggestions:", e);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Memoized debounced fetch functions
  const debouncedSrcFetch = useMemo(
    () => debounce((value: string) => fetchSuggestions(value, setSrcOptions, setLoadingSrc)),
    []
  );

  const debouncedDstFetch = useMemo(
    () => debounce((value: string) => fetchSuggestions(value, setDstOptions, setLoadingDst)),
    []
  );

  // Form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!src || !dst) return;
    setTrigger(prev => !prev); // trigger MapView refresh
  };

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Map */}
      {src && dst && trigger && (
        <MapView
          sourceLabel={src.label}
          destinationLabel={dst.label}
          sourceLat={src.lat}
          sourceLng={src.lng}
          destLat={dst.lat}
          destLng={dst.lng}
          trigger={trigger}
        />
      )}

      {/* Floating search form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: "absolute",
          top: { xs: 20, md: 40 },
          left: { xs: "50%", md: 20 },
          transform: { xs: "translateX(-50%)", md: "none" },
          bgcolor: theme.palette.background.paper,
          p: 2,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          minWidth: { xs: 250, md: 350 },
          zIndex: 1000,
          boxShadow: 3,
        }}
      >
        {/* Source Autocomplete */}
        <Autocomplete
          value={src}
          options={srcOptions}
          getOptionLabel={(option) => option.label}
          loading={loadingSrc}
          onInputChange={(_, value) => debouncedSrcFetch(value)}
          onChange={(_, value: PlaceOption | null) => setSrc(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Source"
              size="small"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingSrc ? <CircularProgress size={16} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        {/* Destination Autocomplete */}
        <Autocomplete
          value={dst}
          options={dstOptions}
          getOptionLabel={(option) => option.label}
          loading={loadingDst}
          onInputChange={(_, value) => debouncedDstFetch(value)}
          onChange={(_, value: PlaceOption | null) => setDst(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Destination"
              size="small"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingDst ? <CircularProgress size={16} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        <Button type="submit" variant="contained" size="small">
          Search
        </Button>
      </Box>
    </Box>
  );
}
