import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api';

/**
 * Fetch all running routes or filter by query parameters
 * @param {Object} filters - Optional filter parameters
 * @returns {Promise<Array>} Array of route objects
 */
export const fetchRoutes = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    if (filters.min_distance) {
      queryParams.append('min_distance', filters.min_distance);
    }
    
    if (filters.max_distance) {
      queryParams.append('max_distance', filters.max_distance);
    }
    
    if (filters.difficulty) {
      queryParams.append('difficulty', filters.difficulty);
    }
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/routes${queryString ? `?${queryString}` : ''}`;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw error;
  }
};

/**
 * Fetch a specific route by ID
 * @param {string} routeId - The ID of the route to fetch
 * @returns {Promise<Object>} Route object
 */
export const fetchRouteById = async (routeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/routes/${routeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching route ${routeId}:`, error);
    throw error;
  }
};

/**
 * Fetch weather data for a specific route
 * @param {string} routeId - The ID of the route to fetch weather for
 * @returns {Promise<Object>} Weather data object
 */
export const fetchRouteWeather = async (routeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/routes/${routeId}/weather`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching weather for route ${routeId}:`, error);
    throw error;
  }
};

/**
 * Fetch route recommendations based on preferences
 * @param {Object} preferences - User preferences for recommendations
 * @returns {Promise<Array>} Array of recommended route objects
 */
export const fetchRecommendations = async (preferences = {}) => {
  try {
    // Build query string from preferences
    const queryParams = new URLSearchParams();
    
    if (preferences.weather) {
      queryParams.append('weather', preferences.weather);
    }
    
    if (preferences.distance) {
      queryParams.append('distance', preferences.distance);
    }
    
    if (preferences.difficulty) {
      queryParams.append('difficulty', preferences.difficulty);
    }
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/recommendations${queryString ? `?${queryString}` : ''}`;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};


  // TODO: Add Route Sharing Functionality
  // This function will call the backend API to generate a shareable link for a route
  // 
  // Example implementation:
  // export const shareRoute = async (routeId) => {
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/routes/${routeId}/share`);
  //     return response.data;
  //   } catch (error) {
  //     console.error(`Error sharing route ${routeId}:`, error);
  //     throw error;
  //   }
  // };
  
export const shareRoute = async (routeId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/routes/${routeId}/share`);
    return response.data;
  } catch (error) {
    console.error(`Error sharing route ${routeId}:`, error);
    throw error;
  }
};
