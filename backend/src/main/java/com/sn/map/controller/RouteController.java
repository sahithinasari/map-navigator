package com.sn.map.controller;

import com.sn.map.exception.InvalidInputException;
import com.sn.map.model.PlaceSuggestions;
import com.sn.map.model.RouteSearch;
import com.sn.map.repository.RouteRepository;
import com.sn.map.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/routes")
public class RouteController {
    private final RouteService routeService;
    private final RouteRepository repo;

    @GetMapping("/api/places")
    public PlaceSuggestions getPlaceSuggestions(@RequestParam String q) {
        if (q == null || q.isBlank()) return (PlaceSuggestions) List.of();
        return routeService.getPlaceSuggestions(q);
    }


    @GetMapping("/route")
    public RouteSearch getRoute(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam String coords // e.g. "17.4,83.3,17.5,83.4"
    ) {
        String[] arr = coords.split(",");
        double srcLat = Double.parseDouble(arr[0]);
        double srcLng = Double.parseDouble(arr[1]);
        double destLat = Double.parseDouble(arr[2]);
        double destLng = Double.parseDouble(arr[3]);

        if (source == null || source.isBlank() || destination == null || destination.isBlank()) {
            throw new InvalidInputException("Source and destination must not be empty.");
        }
        RouteSearch routeSearch=routeService.getRoute(source, destination, srcLat, srcLng, destLat, destLng);

        if(routeSearch==null){
            throw new RuntimeException("Route not found for the given locations");
        }

        return routeSearch;
    }

    @GetMapping("/recent")
    public List<RouteSearch> getRecent() {
        return repo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @GetMapping("/clear/route")
    public void clearRoutes(){
        routeService.clearRoutesCache();
    }
    @GetMapping("/clear/place")
    public void clearPlace(){
        routeService.clearPlaceSuggestion();
    }
}
