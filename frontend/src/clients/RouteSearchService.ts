// src/services/RouteSearchService.ts
const routeSearch = `${process.env.REACT_APP_BASE_URL}/api/routes`;

export const  fetchRoutes =async (source: string, destination: string, sourceLat:number, sourceLng: number, destLat: number, destLng: number) => {
  const coords = [sourceLat, sourceLng, destLat, destLng];
  const url=  `${routeSearch}/route?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&coords=${coords.join(",")}`;
  console.log("Url "+url)
  const res = await fetch(url);
  console.log("Res "+JSON.stringify(res))
  if (!res.ok) throw new Error(`Failed to fetch route: ${res.status} ${res.statusText}`);
  return res;
};

export const fetchSuggestion = async (query: string) => {
  const res = await fetch(`${routeSearch}/api/places?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Failed to fetch route: ${res.status} ${res.statusText}`);
  return res;
};
