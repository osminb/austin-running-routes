import React, { useState, useEffect } from 'react';
import { fetchRouteWeather } from '../utils/api';

const WeatherWidget = ({ routeId }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!routeId) return;
    
    const loadWeather = async () => {
      setLoading(true);
      try {
        const data = await fetchRouteWeather(routeId);
        setWeather(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load weather data');
        setLoading(false);
        console.error('Error loading weather:', err);
      }
    };
    
    loadWeather();
  }, [routeId]);

  // Get weather icon based on description
  const getWeatherIcon = (description) => {
    if (!description) return '🌤️';
    
    const desc = description.toLowerCase();
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('clear')) return '☀️';
    if (desc.includes('sun')) return '☀️';
    if (desc.includes('storm')) return '⛈️';
    if (desc.includes('wind')) return '💨';
    if (desc.includes('fog')) return '🌫️';
    
    return '🌤️'; // Default
  };

  if (loading) {
    return (
      <div className="weather-widget">
        <h3>Weather Conditions</h3>
        <div className="weather-loading">
          <div className="loading-spinner"></div>
          <p>Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget">
        <h3>Weather Conditions</h3>
        <div className="weather-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="weather-widget">
      <h3>Current Weather Conditions</h3>
      
      <div className="weather-overview">
        <div className="weather-icon">
          {getWeatherIcon(weather.description)}
        </div>
        <div className="weather-primary">
          <div className="weather-temp">{Math.round(weather.temperature)}°F</div>
          <div className="weather-desc">{weather.description}</div>
        </div>
      </div>
      
      <div className="weather-data">
        <div className="weather-item">
          <div className="weather-label">Feels Like</div>
          <div className="weather-value">{Math.round(weather.feels_like)}°F</div>
        </div>
        
        <div className="weather-item">
          <div className="weather-label">Humidity</div>
          <div className="weather-value">{weather.humidity}%</div>
        </div>
        
        <div className="weather-item">
          <div className="weather-label">Wind Speed</div>
          <div className="weather-value">{weather.wind_speed} mph</div>
        </div>
      </div>
      
      <div className={`good-for-running ${weather.is_good_for_running ? 'yes' : 'no'}`}>
        {weather.is_good_for_running 
          ? '✓ Good conditions for running!' 
          : '✗ Not ideal conditions for running'}
      </div>
    </div>
  );
};

export default WeatherWidget;
