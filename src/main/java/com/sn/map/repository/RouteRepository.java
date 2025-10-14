package com.sn.map.repository;

import com.sn.map.model.RouteSearch;
import org.springframework.data.jpa.repository.JpaRepository;
public interface RouteRepository extends JpaRepository<RouteSearch, Long> {}
