package com.sn.map.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sn.map.model.PlaceSuggestion;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CacheInspectorService {

    private final RedisTemplate<String, Object> redisTemplate;

    // List all keys in Redis
    public Set<String> getAllKeys() {
        return redisTemplate.keys("*");
    }


    public List<PlaceSuggestion> getPlaceSuggestionsFromCache(String key) {
        // prepend cache name
        String redisKey = "placeSuggestions::" + key;
        Object value = redisTemplate.opsForValue().get(redisKey);

        if (value == null) return List.of();

        ObjectMapper mapper = new ObjectMapper();
        return mapper.convertValue(value, new TypeReference<List<PlaceSuggestion>>() {});
    }



    // Delete a key (optional, for testing)
    public boolean evict(String key) {
        return Boolean.TRUE.equals(redisTemplate.delete(key));
    }
}
