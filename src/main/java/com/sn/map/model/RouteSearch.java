package com.sn.map.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class RouteSearch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String source;
    private String destination;
    private double sourceLat;
    private double sourceLng;
    private double destLat;
    private double destLng;
    private double distanceKm;
    private double durationMin;
    private List<List<Double>> coordinates; // [[lon, lat], [lon, lat], ...]

}
