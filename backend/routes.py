from flask import jsonify, request
import json
import os
from utils import calculate_route_difficulty, filter_routes_by_distance, get_weather_for_coordinates, recommend_routes

# Path to our data file
ROUTES_DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'running_routes.json')

def register_routes(app):
    """Register all API routes with the Flask app"""
    
    @app.route('/api/routes', methods=['GET'])
    def get_routes():
        """Get all running routes or filter by query parameters"""
        try:
            # Load routes data
            with open(ROUTES_DATA_PATH, 'r') as f:
                routes = json.load(f)
            
            # Apply filters if provided
            min_distance = request.args.get('min_distance', type=float)
            max_distance = request.args.get('max_distance', type=float)
            difficulty = request.args.get('difficulty')
            
            if min_distance or max_distance:
                routes = filter_routes_by_distance(routes, min_distance, max_distance)
            
            if difficulty:
                routes = [route for route in routes if route.get('difficulty') == difficulty]
                
            return jsonify(routes)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @app.route('/api/routes/<route_id>', methods=['GET'])
    def get_route_by_id(route_id):
        """Get a specific route by ID"""
        try:
            # Load routes data
            with open(ROUTES_DATA_PATH, 'r') as f:
                routes = json.load(f)
            
            # Find the route with the matching ID
            route = next((r for r in routes if r.get('id') == route_id), None)
            
            if not route:
                return jsonify({"error": f"Route with ID {route_id} not found"}), 404
                
            return jsonify(route)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @app.route('/api/routes/<route_id>/weather', methods=['GET'])
    def get_route_weather(route_id):
        """Get current weather conditions for a specific route"""
        try:
            # Load routes data
            with open(ROUTES_DATA_PATH, 'r') as f:
                routes = json.load(f)
            
            # Find the route with the matching ID
            route = next((r for r in routes if r.get('id') == route_id), None)
            
            if not route:
                return jsonify({"error": f"Route with ID {route_id} not found"}), 404
            
            # Get coordinates from the route
            start_coords = route.get('start_coordinates', {})
            lat = start_coords.get('lat')
            lng = start_coords.get('lng')
            
            if not lat or not lng:
                return jsonify({"error": "Route does not have valid coordinates"}), 400
            
            # Get weather data
            weather_data = get_weather_for_coordinates(lat, lng)
            
            return jsonify(weather_data)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
            
    @app.route('/api/recommendations', methods=['GET'])
    def get_recommendations():
        """Get route recommendations based on preferences"""
        try:
            # Load routes data
            with open(ROUTES_DATA_PATH, 'r') as f:
                routes = json.load(f)
            
            # Get preference parameters
            weather_pref = request.args.get('weather')
            distance_pref = request.args.get('distance')
            difficulty_pref = request.args.get('difficulty')
            
            # Get recommendations
            recommended_routes = recommend_routes(
                routes, 
                weather_preference=weather_pref,
                distance_preference=distance_pref,
                difficulty_preference=difficulty_pref
            )
            
            return jsonify(recommended_routes[:5])  # Return top 5 recommendations
        except Exception as e:
            return jsonify({"error": str(e)}), 500

# TODO: Add Route Sharing Functionality Below


