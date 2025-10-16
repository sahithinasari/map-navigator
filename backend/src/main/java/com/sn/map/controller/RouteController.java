package com.sn.map.controller;

import com.sn.map.exception.InvalidInputException;
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
    private final RouteService service;
    private final RouteRepository repo;

    @GetMapping
    public RouteSearch get(@RequestParam String source, @RequestParam String destination) {
        if (source == null || source.isBlank() || destination == null || destination.isBlank()) {
            throw new InvalidInputException("Source and destination must not be empty.");
        }
        RouteSearch routeSearch=service.getRoute(source, destination);
        if(routeSearch==null){
            throw new RuntimeException("Route not found for the given locations");
        }
        return routeSearch;
    }

    @GetMapping("/recent")
    public List<RouteSearch> getRecent() {
        return repo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}
