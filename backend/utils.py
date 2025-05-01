import math
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def calculate_distance(point1, point2):
    """
    Calculate the distance between two geographic points using the Haversine formula.
    
    Args:
        point1 (dict): Dictionary with 'lat' and 'lng' keys
        point2 (dict): Dictionary with 'lat' and 'lng' keys
        
    Returns:
        float: Distance in kilometers
    """
    # Earth radius in kilometers
    R = 6371.0
    
    # Convert latitude and longitude from degrees to radians
    lat1 = math.radians(point1['lat'])
    lon1 = math.radians(point1['lng'])
    lat2 = math.radians(point2['lat'])
    lon2 = math.radians(point2['lng'])
    
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    # Distance in kilometers
    distance = R * c
    return distance

def calculate_route_length(route_points):
    """
    Calculate the total length of a route based on its waypoints.
    
    Args:
        route_points (list): List of dictionaries with 'lat' and 'lng' keys
        
    Returns:
        float: Total route length in kilometers
    """
    if len(route_points) < 2:
        return 0
    
    total_distance = 0
    for i in range(len(route_points) - 1):
        total_distance += calculate_distance(route_points[i], route_points[i + 1])
    
    return total_distance

def calculate_route_difficulty(route):
    """
    Calculate the difficulty level of a route based on distance and elevation gain.
    
    Args:
        route (dict): Route dictionary with 'points' and 'elevation_gain' keys
        
    Returns:
        str: Difficulty level ('Easy', 'Moderate', 'Hard')
    """
    # Calculate total distance
    distance = calculate_route_length(route['points'])
    
    # Get elevation gain in meters
    elevation_gain = route.get('elevation_gain', 0)
    
    # Calculate difficulty score
    difficulty_score = (distance * 0.4) + (elevation_gain / 10)
    
    # Determine difficulty level
    if difficulty_score < 5:
        return 'Easy'
    elif difficulty_score < 10:
        return 'Moderate'
    else:
        return 'Hard'

def filter_routes_by_distance(routes, min_distance=None, max_distance=None):
    """
    Filter routes by minimum and maximum distance.
    
    Args:
        routes (list): List of route dictionaries
        min_distance (float, optional): Minimum distance in kilometers
        max_distance (float, optional): Maximum distance in kilometers
        
    Returns:
        list: Filtered list of routes
    """
    filtered_routes = []
    
    for route in routes:
        distance = calculate_route_length(route['points'])
        
        if min_distance is not None and distance < min_distance:
            continue
            
        if max_distance is not None and distance > max_distance:
            continue
            
        filtered_routes.append(route)
    
    return filtered_routes

def get_weather_for_coordinates(lat, lng):
    """
    Get current weather conditions for a specific location.
    
    Args:
        lat (float): Latitude
        lng (float): Longitude
        
    Returns:
        dict: Weather data
    """
    api_key = os.getenv('OPENWEATHER_API_KEY', 'demo_key')
    
    # For demo purposes, return mock data if no API key is provided
    if api_key == 'demo_key':
        return {
            "temperature": 75.2,
            "feels_like": 76.1,
            "humidity": 65,
            "wind_speed": 8.5,
            "description": "Partly cloudy",
            "is_good_for_running": True
        }
    
    # Make API request to OpenWeatherMap
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lng}&appid={api_key}&units=imperial"
    response = requests.get(url)
    
    if response.status_code != 200:
        return {"error": "Failed to fetch weather data"}
    
    data = response.json()
    
    # Extract relevant weather information
    weather = {
        "temperature": data["main"]["temp"],
        "feels_like": data["main"]["feels_like"],
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"],
        "description": data["weather"][0]["description"],
    }
    
    # Determine if conditions are good for running
    # Good conditions: Temperature between 45-75°F, not raining heavily
    is_good = (45 <= weather["temperature"] <= 75 and 
               "rain" not in weather["description"].lower() and
               "storm" not in weather["description"].lower())
    
    weather["is_good_for_running"] = is_good
    
    return weather

def recommend_routes(routes, weather_preference=None, distance_preference=None, difficulty_preference=None):
    """
    Recommend routes based on weather and user preferences
    
    Args:
        routes (list): List of route dictionaries
        weather_preference (str): Weather preference (sunny/cloudy/cool)
        distance_preference (str): Distance preference (short/medium/long)
        difficulty_preference (str): Difficulty preference (Easy/Moderate/Hard)
            
    Returns:
        list: Recommended routes sorted by relevance
    """
    recommended_routes = []
    
    for route in routes:
        score = 0
        
        # Get route details
        distance = calculate_route_length(route['points'])
        difficulty = calculate_route_difficulty(route)
        
        # Score based on distance preference
        if distance_preference:
            if distance_preference == 'short' and distance < 5:
                score += 3
            elif distance_preference == 'medium' and 5 <= distance <= 10:
                score += 3
            elif distance_preference == 'long' and distance > 10:
                score += 3
        
        # Score based on difficulty preference
        if difficulty_preference and difficulty == difficulty_preference:
            score += 3
        
        # Score based on weather preference and current weather
        if weather_preference:
            # Get weather for route
            lat = route['start_coordinates']['lat']
            lng = route['start_coordinates']['lng']
            weather = get_weather_for_coordinates(lat, lng)
            
            weather_desc = weather.get('description', '').lower()
            temp = weather.get('temperature', 70)
            
            if weather_preference == 'sunny' and ('sun' in weather_desc or 'clear' in weather_desc):
                score += 3
            elif weather_preference == 'cloudy' and ('cloud' in weather_desc):
                score += 3
            elif weather_preference == 'cool' and temp < 65:
                score += 3
        
        # Always add route to recommendations, but with a score
        route_with_score = route.copy()
        route_with_score['recommendation_score'] = score
        route_with_score['distance'] = distance  # Add calculated distance for display
        recommended_routes.append(route_with_score)
    
    # Sort routes by score (highest first)
    return sorted(recommended_routes, key=lambda x: x['recommendation_score'], reverse=True)
