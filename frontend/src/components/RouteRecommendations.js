import React, { useState } from 'react';
import { fetchRecommendations } from '../utils/api';

const RouteRecommendations = ({ onRouteSelect }) => {
  const [preferences, setPreferences] = useState({
    weather: '',
    distance: '',
    difficulty: ''
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setPreferences({
      ...preferences,
      [name]: value
    });
  };

  const getRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecommendations(preferences);
      setRecommendations(data);
      setShowRecommendations(true);
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
      console.error('Error getting recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetRecommendations = () => {
    setRecommendations([]);
    setShowRecommendations(false);
    setPreferences({
      weather: '',
      distance: '',
      difficulty: ''
    });
  };

  return (
    <div className="recommendations-container">
      <h3>Personalized Route Recommendations</h3>
      
      {!showRecommendations ? (
        <div className="preferences-form">
          <div className="preference-group">
            <label htmlFor="weather">Weather Preference</label>
            <select
              id="weather"
              name="weather"
              value={preferences.weather}
              onChange={handlePreferenceChange}
            >
              <option value="">No Preference</option>
              <option value="sunny">Sunny</option>
              <option value="cloudy">Cloudy</option>
              <option value="cool">Cool</option>
            </select>
          </div>
          
          <div className="preference-group">
            <label htmlFor="distance">Distance Preference</label>
            <select
              id="distance"
              name="distance"
              value={preferences.distance}
              onChange={handlePreferenceChange}
            >
              <option value="">No Preference</option>
              <option value="short">Short (&lt; 5km)</option>
              <option value="medium">Medium (5-10km)</option>
              <option value="long">Long (&gt; 10km)</option>
            </select>
          </div>
          
          <div className="preference-group">
            <label htmlFor="difficulty">Difficulty Preference</label>
            <select
              id="difficulty"
              name="difficulty"
              value={preferences.difficulty}
              onChange={handlePreferenceChange}
            >
              <option value="">No Preference</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          <button 
            className="recommend-button" 
            onClick={getRecommendations}
            disabled={loading}
          >
            {loading ? 'Finding Routes...' : 'Get Personalized Recommendations'}
          </button>
        </div>
      ) : (
        <>
          {recommendations.length > 0 ? (
            <div className="recommendations-list">
              <h4>Recommended Routes for You</h4>
              <ul>
                {recommendations.map(route => (
                  <li 
                    key={route.id} 
                    className="recommendation-item"
                    onClick={() => onRouteSelect(route)}
                  >
                    <div className="route-name">{route.name}</div>
                    <div className="route-details">
                      <span className="route-difficulty">{route.difficulty}</span>
                      <span className="route-distance">
                        {(route.distance || 0).toFixed(1)} km
                      </span>
                    </div>
                    <div className="recommendation-score">
                      Match Score: {route.recommendation_score}/9
                    </div>
                  </li>
                ))}
              </ul>
              <button 
                className="reset-button" 
                onClick={resetRecommendations}
              >
                Start Over
              </button>
            </div>
          ) : (
            <div className="no-recommendations">
              <p>No routes match your preferences. Try different criteria.</p>
              <button 
                className="reset-button" 
                onClick={resetRecommendations}
              >
                Start Over
              </button>
            </div>
          )}
        </>
      )}
      
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default RouteRecommendations;
