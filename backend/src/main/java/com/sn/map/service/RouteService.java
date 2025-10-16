package com.sn.map.service;

import com.sn.map.exception.InvalidInputException;
import com.sn.map.exception.RouteNotFoundException;
import com.sn.map.model.RouteSearch;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class RouteService {
    private final RestTemplate restTemplate = new RestTemplate();

    public RouteSearch getRoute(String source, String destination) {
        try {
            // 1️⃣ Validate input
            if (source == null || source.isBlank() || destination == null || destination.isBlank()) {
                throw new InvalidInputException("Source and destination must not be empty.");
            }

            // 2️⃣ Encode and fetch coordinates
            String src = UriUtils.encode(source, StandardCharsets.UTF_8);
            String dest = UriUtils.encode(destination, StandardCharsets.UTF_8);

            double[] s = coords("https://nominatim.openstreetmap.org/search?format=json&q=" + src, source);
            double[] d = coords("https://nominatim.openstreetmap.org/search?format=json&q=" + dest, destination);

            // 3️⃣ Fetch route from OSRM API
            String routeUrl = String.format(
                    "https://router.project-osrm.org/route/v1/driving/%f,%f;%f,%f?overview=full&geometries=geojson",
                    s[1], s[0], d[1], d[0]);

            Map resp = restTemplate.getForObject(routeUrl, Map.class);
            if (resp == null || resp.get("routes") == null) {
                throw new RouteNotFoundException("No route data returned from OSRM for given cities.");
            }

            List<Map> routes = (List<Map>) resp.get("routes");
            if (routes.isEmpty()) {
                throw new RouteNotFoundException("No route found between " + source + " and " + destination);
            }

            Map first = routes.get(0);
            double distance = ((Number) first.get("distance")).doubleValue() / 1000;
            double duration = ((Number) first.get("duration")).doubleValue() / 60;

            Map geometry = (Map) first.get("geometry");
            List<List<Double>> coords = (List<List<Double>>) geometry.get("coordinates");

            // 4️⃣ Build result
            RouteSearch r = new RouteSearch();
            r.setSource(source);
            r.setDestination(destination);
            r.setSourceLat(s[0]);
            r.setSourceLng(s[1]);
            r.setDestLat(d[0]);
            r.setDestLng(d[1]);
            r.setDistanceKm(distance);
            r.setDurationMin(duration);
            r.setCoordinates(coords);

            log.info("✅ Route successfully fetched: {} → {}", source, destination);
            return r;
        } catch (HttpClientErrorException e) {
            log.error("HTTP error while calling external API: {}", e.getMessage());
            throw new RouteNotFoundException("External API error: " + e.getStatusText());
        } catch (RestClientException e) {
            log.error("Network/API call failed: {}", e.getMessage());
            throw new RouteNotFoundException("Failed to reach external map service.");
        } catch (Exception e) {
            log.error("Unexpected error in getRoute(): {}", e.getMessage(), e);
            throw new RouteNotFoundException("Error while fetching route: " + e.getMessage());
        }
    }

    private double[] coords(String url, String cityName) {
        try {
            List<Map> list = restTemplate.getForObject(url, List.class);
            if (list == null || list.isEmpty()) {
                throw new InvalidInputException("No matching city found for: " + cityName);
            }

            Map obj = list.get(0);
            double lat = Double.parseDouble((String) obj.get("lat"));
            double lon = Double.parseDouble((String) obj.get("lon"));
            return new double[]{lat, lon};
        } catch (HttpClientErrorException e) {
            log.error("City lookup failed for '{}': {}", cityName, e.getMessage());
            throw new InvalidInputException("Invalid city: " + cityName);
        } catch (Exception e) {
            log.error("Error parsing coordinates for '{}': {}", cityName, e.getMessage());
            throw new InvalidInputException("Could not determine location for: " + cityName);
        }
    }
}
