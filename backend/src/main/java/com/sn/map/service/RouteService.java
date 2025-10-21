package com.sn.map.service;

import com.sn.map.exception.InvalidInputException;
import com.sn.map.model.PlaceSuggestion;
import com.sn.map.model.PlaceSuggestions;
import com.sn.map.model.RouteSearch;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class RouteService {
    private final RestTemplate restTemplate = new RestTemplate();
    @Cacheable(value="placeSuggestions", key="#q")
    public PlaceSuggestions getPlaceSuggestions(String q) {
        log.info("🌍 Cache MISS → Fetching place suggestions for query: {}", q);
        return callNominatimApi(q);
    }

    public PlaceSuggestions callNominatimApi(String q) {
        log.info("🌍 Cache MISS → Fetching place suggestions for query: {}", q);

        String url = "https://nominatim.openstreetmap.org/search?"
                + "format=json&addressdetails=1&limit=5&q="
                + UriUtils.encode(q, StandardCharsets.UTF_8);

        List<Map> results = restTemplate.getForObject(url, List.class);
        if (results == null || results.isEmpty()) {
            return new PlaceSuggestions(List.of());
        }

        List<PlaceSuggestion> suggestions = results.stream()
                .map(r -> PlaceSuggestion.builder()
                        .label((String) r.get("display_name"))
                        .lat((String) r.get("lat"))
                        .lng((String) r.get("lon"))
                        .type((String) r.get("type"))
                        .importance((Double) r.get("importance"))
                        .build())
                .toList();

        return new PlaceSuggestions(suggestions);
    }

    @Cacheable(
            value = "routes",
            key = "#sourceLabel + '_' + #destLabel + '_' + #srcLat + '_' + #srcLng + '_' + #destLat + '_' + #destLng"
    )
    public RouteSearch getRoute(String sourceLabel, String destLabel,
                                double srcLat, double srcLng,
                                double destLat, double destLng) {
        log.info("🚀 Cache MISS → Fetching route from OSRM API for {} → {}", sourceLabel, destLabel);

        try {
            String routeUrl = String.format(
                    "https://router.project-osrm.org/route/v1/driving/%f,%f;%f,%f?overview=full&geometries=geojson",
                    srcLng, srcLat, destLng, destLat
            );

            Map resp = restTemplate.getForObject(routeUrl, Map.class);
            if (resp == null || resp.get("routes") == null) {
                throw new InvalidInputException("No route data returned for the selected locations.");
            }

            List<Map> routes = (List<Map>) resp.get("routes");
            Map first = routes.get(0);

            double distance = ((Number) first.get("distance")).doubleValue() / 1000;
            double duration = ((Number) first.get("duration")).doubleValue() / 60;
            Map geometry = (Map) first.get("geometry");
            List<List<Double>> coords = (List<List<Double>>) geometry.get("coordinates");

            return RouteSearch.builder()
                    .source(sourceLabel)
                    .destination(destLabel)
                    .sourceLat(srcLat)
                    .sourceLng(srcLng)
                    .destLat(destLat)
                    .destLng(destLng)
                    .distanceKm(distance)
                    .durationMin(duration)
                    .coordinates(coords)
                    .build();

        } catch (Exception e) {
            log.error("❌ Error fetching route: {}", e.getMessage());
            throw new InvalidInputException("Failed to fetch route between selected locations.");
        }
    }

    @CacheEvict(value = "routes", allEntries = true)
    public void clearRoutesCache() {
        System.out.println("Cache cleared!");
    }
    @CacheEvict(value = "placeSuggestions", allEntries = true)
    public void clearPlaceSuggestion() {
        System.out.println("place suggestions Cache cleared!");
    }
}
