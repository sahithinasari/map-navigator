package com.sn.map.service;

import com.sn.map.model.RouteSearch;
import com.sn.map.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RouteService {
    private final RestTemplate restTemplate = new RestTemplate();
 //   private final RouteRepository repo;

    public RouteSearch getRoute(String source, String destination) {
        String src = UriUtils.encode(source, StandardCharsets.UTF_8);
        String dest = UriUtils.encode(destination, StandardCharsets.UTF_8);

        // 1️⃣ Convert city → lat/lon using Nominatim
        double[] s = coords("https://nominatim.openstreetmap.org/search?format=json&q=" + src);
        double[] d = coords("https://nominatim.openstreetmap.org/search?format=json&q=" + dest);

        // 2️⃣ Fetch route from OSRM with full geometry
        String routeUrl = String.format(
                "https://router.project-osrm.org/route/v1/driving/%f,%f;%f,%f?overview=full&geometries=geojson",
                s[1], s[0], d[1], d[0]);

        Map resp = restTemplate.getForObject(routeUrl, Map.class);
        Map first = ((List<Map>) resp.get("routes")).get(0);

        double distance = ((Number) first.get("distance")).doubleValue() / 1000;
        double duration = ((Number) first.get("duration")).doubleValue() / 60;

        // Extract coordinates from geometry
        Map geometry = (Map) first.get("geometry");
        List<List<Double>> coords = (List<List<Double>>) geometry.get("coordinates"); // [[lon, lat], ...]

        RouteSearch r = new RouteSearch();
        r.setSource(source);
        r.setDestination(destination);
        r.setSourceLat(s[0]);
        r.setSourceLng(s[1]);
        r.setDestLat(d[0]);
        r.setDestLng(d[1]);
        r.setDistanceKm(distance);
        r.setDurationMin(duration);
        r.setCoordinates(coords); // <-- new field

        //repo.save(r);
        return r;
    }

    private double[] coords(String url) {
        List<Map> list = restTemplate.getForObject(url, List.class);
        Map obj = list.get(0);
        return new double[]{ Double.parseDouble((String)obj.get("lat")),
                             Double.parseDouble((String)obj.get("lon")) };
    }
}
