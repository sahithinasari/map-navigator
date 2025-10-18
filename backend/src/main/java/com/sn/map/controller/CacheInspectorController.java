package com.sn.map.controller;

import com.sn.map.service.CacheInspectorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/cache")
@RequiredArgsConstructor
public class CacheInspectorController {

    private final CacheInspectorService cacheService;

    @GetMapping("/keys")
    public Set<String> getKeys() {
        return cacheService.getAllKeys();
    }

    @GetMapping("/value/{key}")
    public Object getValue(@PathVariable String key) {
        return cacheService.getPlaceSuggestionsFromCache(key);
    }

    @DeleteMapping("/evict/{key}")
    public Map<String, String> evict(@PathVariable String key) {
        boolean removed = cacheService.evict(key);
        return Map.of("key", key, "removed", String.valueOf(removed));
    }
}
