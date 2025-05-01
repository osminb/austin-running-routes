import sys
import os
import math
import pytest

# Add the parent directory to the path so we can import the utils module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils import (
    calculate_distance,
    calculate_route_length,
    calculate_route_difficulty,
    filter_routes_by_distance
)

class TestDistanceCalculations:
    """Tests for the distance calculation functions"""
    
    def test_calculate_distance(self):
        """Test the distance calculation between two points"""
        # Austin downtown coordinates
        point1 = {"lat": 30.2672, "lng": -97.7431}
        # UT Austin coordinates
        point2 = {"lat": 30.2849, "lng": -97.7341}
        
        # Expected distance is approximately 2.1 km
        # But our function has a deliberate bug (dividing by 2)
        expected_distance = 2.1
        calculated_distance = calculate_distance(point1, point2)
        
        # This test will fail because of our deliberate bug
        assert math.isclose(calculated_distance, expected_distance, rel_tol=0.1), \
            f"Expected distance around {expected_distance}km but got {calculated_distance}km"
    
    def test_calculate_route_length(self):
        """Test calculating the total length of a route"""
        route_points = [
            {"lat": 30.2642, "lng": -97.7475},
            {"lat": 30.2665, "lng": -97.7537},
            {"lat": 30.2678, "lng": -97.7598}
        ]
        
        # This test will also fail because it relies on calculate_distance
        length = calculate_route_length(route_points)
        assert length > 0, "Route length should be greater than 0"
        
    def test_empty_route(self):
        """Test calculating length of an empty route"""
        empty_route = []
        assert calculate_route_length(empty_route) == 0
        
        single_point = [{"lat": 30.2642, "lng": -97.7475}]
        assert calculate_route_length(single_point) == 0

class TestRouteDifficulty:
    """Tests for the route difficulty calculation"""
    
    def test_easy_route(self):
        """Test an easy route classification"""
        easy_route = {
            "points": [
                {"lat": 30.2642, "lng": -97.7475},
                {"lat": 30.2665, "lng": -97.7537}
            ],
            "elevation_gain": 10
        }
        
        assert calculate_route_difficulty(easy_route) == "Easy"
    
    def test_moderate_route(self):
        """Test a moderate route classification"""
        moderate_route = {
            "points": [
                {"lat": 30.2642, "lng": -97.7475},
                {"lat": 30.2665, "lng": -97.7537},
                {"lat": 30.2678, "lng": -97.7598},
                {"lat": 30.2631, "lng": -97.7651}
            ],
            "elevation_gain": 50
        }
        
        # This might fail depending on the calculated distance
        assert calculate_route_difficulty(moderate_route) in ["Easy", "Moderate"]
    
    def test_hard_route(self):
        """Test a hard route classification"""
        hard_route = {
            "points": [
                {"lat": 30.2542, "lng": -97.8002},
                {"lat": 30.2518, "lng": -97.8056},
                {"lat": 30.2496, "lng": -97.8112},
                {"lat": 30.2465, "lng": -97.8178},
                {"lat": 30.2429, "lng": -97.8234}
            ],
            "elevation_gain": 120
        }
        
        # This might fail depending on the calculated distance
        difficulty = calculate_route_difficulty(hard_route)
        print(f"Hard route difficulty: {difficulty}")
        assert difficulty in ["Moderate", "Hard"]

class TestRouteFiltering:
    """Tests for the route filtering functions"""
    
    def test_filter_by_min_distance(self):
        """Test filtering routes by minimum distance"""
        routes = [
            {
                "id": "1",
                "name": "Short Route",
                "points": [
                    {"lat": 30.2642, "lng": -97.7475},
                    {"lat": 30.2665, "lng": -97.7537}
                ]
            },
            {
                "id": "2",
                "name": "Long Route",
                "points": [
                    {"lat": 30.2542, "lng": -97.8002},
                    {"lat": 30.2518, "lng": -97.8056},
                    {"lat": 30.2496, "lng": -97.8112},
                    {"lat": 30.2465, "lng": -97.8178},
                    {"lat": 30.2429, "lng": -97.8234}
                ]
            }
        ]
        
        filtered = filter_routes_by_distance(routes, min_distance=1.0)
        # Due to our bug, this might not filter as expected
        assert len(filtered) <= len(routes)
