package com.sn.map.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.antlr.v4.runtime.atn.Transition;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlaceSuggestion {
    private String label;
    private String lat;
    private String lng;
    private String type;
    private Double importance;

}
