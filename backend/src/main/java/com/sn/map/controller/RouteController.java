package com.sn.map.controller;

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
@CrossOrigin(origins = "*")
public class RouteController {
    private final RouteService service;
    private final RouteRepository repo;

    @GetMapping
    public RouteSearch get(@RequestParam String source, @RequestParam String destination) {
        return service.getRoute(source, destination);
    }

    @GetMapping("/recent")
    public List<RouteSearch> getRecent() {
        return repo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}
