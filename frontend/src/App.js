import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import RouteList from './components/RouteList';
import RouteDetail from './components/RouteDetail';
import WeatherWidget from './components/WeatherWidget';
import RouteRecommendations from './components/RouteRecommendations';
import { fetchRoutes } from './utils/api';
import './index.css';

function App() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minDistance: '',
    maxDistance: '',
    difficulty: ''
  });
  const [activeTab, setActiveTab] = useState('filters');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadRoutes();
  }, []);

  useEffect(() => {
    // Apply dark mode class to body when darkMode state changes
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const loadRoutes = async (filterParams = {}) => {
    setLoading(true);
    try {
      const data = await fetchRoutes(filterParams);
      setRoutes(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load routes. Please try again later.');
      setLoading(false);
      console.error('Error loading routes:', err);
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const applyFilters = () => {
    const filterParams = {};
    
    if (filters.minDistance) {
      filterParams.min_distance = parseFloat(filters.minDistance);
    }
    
    if (filters.maxDistance) {
      filterParams.max_distance = parseFloat(filters.maxDistance);
    }
    
    if (filters.difficulty) {
      filterParams.difficulty = filters.difficulty;
    }
    
    loadRoutes(filterParams);
  };

  const resetFilters = () => {
    setFilters({
      minDistance: '',
      maxDistance: '',
      difficulty: ''
    });
    loadRoutes();
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Austin Trail Runner</h1>
        <div className="header-content">
          <p>Find the best running routes in Austin, TX</p>
          <div className="dark-mode-toggle">
            <label className="switch">
              <input type="checkbox" checked={darkMode} onChange={handleDarkModeToggle} />
              <span className="slider round"></span>
            </label>
            <span className="toggle-label">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
        </div>
      </header>
      
      <div className="main-content">
        <div className="sidebar">
          <div className="filter-section">
            <div className="section-tabs">
              <button 
                className={activeTab === 'filters' ? 'active-tab' : ''} 
                onClick={() => setActiveTab('filters')}
              >
                Filter Routes
              </button>
              <button 
                className={activeTab === 'recommendations' ? 'active-tab' : ''} 
                onClick={() => setActiveTab('recommendations')}
              >
                Get Recommendations
              </button>
            </div>
            
            {activeTab === 'filters' ? (
              <div className="filters">
                <h3>Filter Routes</h3>
                <div className="filter-group">
                  <label htmlFor="minDistance">Min Distance (km)</label>
                  <input
                    type="number"
                    id="minDistance"
                    name="minDistance"
                    value={filters.minDistance}
                    onChange={handleFilterChange}
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div className="filter-group">
                  <label htmlFor="maxDistance">Max Distance (km)</label>
                  <input
                    type="number"
                    id="maxDistance"
                    name="maxDistance"
                    value={filters.maxDistance}
                    onChange={handleFilterChange}
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div className="filter-group">
                  <label htmlFor="difficulty">Difficulty</label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={filters.difficulty}
                    onChange={handleFilterChange}
                  >
                    <option value="">All</option>
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                
                <div className="filter-buttons">
                  <button className="apply-button" onClick={applyFilters}>Apply Filters</button>
                  <button className="reset-button" onClick={resetFilters}>Reset</button>
                </div>
              </div>
            ) : (
              <RouteRecommendations onRouteSelect={handleRouteSelect} />
            )}
          </div>
          
          {loading ? (
            <p>Loading routes...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <>
              <RouteList 
                routes={routes} 
                onRouteSelect={handleRouteSelect} 
                selectedRoute={selectedRoute} 
              />
              
              {selectedRoute && (
                <>
                  <RouteDetail route={selectedRoute} />
                  <WeatherWidget routeId={selectedRoute.id} />
                </>
              )}
            </>
          )}
        </div>
        
        <div className="map-container">
          <Map routes={routes} selectedRoute={selectedRoute} onRouteSelect={handleRouteSelect} />
        </div>
      </div>
    </div>
  );
}

export default App;

// TODO: Import and integrate the ShareRoute component
// 1. Import the ShareRoute component at the top of the file
// import ShareRoute from './components/ShareRoute';
//
// 2. Add the ShareRoute component to the JSX where the RouteDetail is displayed
// {selectedRoute && (
//   <>
//     <RouteDetail route={selectedRoute} />
//     <ShareRoute route={selectedRoute} />
//     <WeatherWidget routeId={selectedRoute.id} />
//   </>
// )}
