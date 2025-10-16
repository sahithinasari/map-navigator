// src/services/RouteSearchService.ts
const routeSearch = `${process.env.REACT_APP_BASE_URL}/api/routes`;

export const fetchRoutes = async (source: string, destination: string) => {
  const res = await fetch(`http://localhost:2027/api/routes?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`);

  if (!res.ok) throw new Error(`Failed to fetch route: ${res.status} ${res.statusText}`);
  return res;
};

