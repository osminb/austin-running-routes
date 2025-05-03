import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import RouteList from './components/RouteList';
import RouteDetail from './components/RouteDetail';
import WeatherWidget from './components/WeatherWidget';
import RouteRecommendations from './components/RouteRecommendations';
import RouteCategories from './components/RouteCategories';
import { fetchRoutes } from './utils/api';
import './index.css';
import './components/RouteCategories.css';
import './modern-theme.css'; // Import the new modern theme

function App() {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('filter');
  const [filters, setFilters] = useState({
    minDistance: '',
    maxDistance: '',
    difficulty: ''
  });
  
  // Load routes on component mount
  useEffect(() => {
    loadRoutes();
    
    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);
  
  // Apply dark mode class when darkMode state changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  const loadRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchRoutes();
      console.log('Fetched routes:', data);
      
      if (data && Array.isArray(data)) {
        setRoutes(data);
        setFilteredRoutes(data);
      } else {
        console.error('Invalid data format:', data);
        setError('Failed to load routes: Invalid data format');
      }
    } catch (err) {
      console.error('Error loading routes:', err);
      setError(`Failed to load routes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };
  
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const applyFilters = () => {
    let filtered = [...routes];
    
    if (filters.minDistance) {
      filtered = filtered.filter(route => route.distance >= parseFloat(filters.minDistance));
    }
    
    if (filters.maxDistance) {
      filtered = filtered.filter(route => route.distance <= parseFloat(filters.maxDistance));
    }
    
    if (filters.difficulty) {
      filtered = filtered.filter(route => route.difficulty === filters.difficulty);
    }
    
    setFilteredRoutes(filtered);
  };
  
  const resetFilters = () => {
    setFilters({
      minDistance: '',
      maxDistance: '',
      difficulty: ''
    });
    setFilteredRoutes(routes);
  };
  
  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <header className="header">
        <div className="header-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="logo-icon">🏃</span>
          <h1>Austin Trail Runner</h1>
        </div>
        <div className="header-content">
          <nav className="header-nav">
            <a href="#routes" className="nav-link">Routes</a>
            <a href="#map" className="nav-link">Map</a>
            <a href="#about" className="nav-link">About</a>
          </nav>
          <div className="header-actions">
            <div className="dark-mode-toggle">
              <label className="switch">
                <input type="checkbox" checked={darkMode} onChange={handleDarkModeToggle} />
                <span className="slider round"></span>
              </label>
              <span className="toggle-label">{darkMode ? 'Dark' : 'Light'}</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">Discover Austin's Best Running Trails</h1>
        <p className="hero-subtitle">Find the perfect route for your next run with our interactive map and detailed trail information</p>
        <button className="hero-button" onClick={() => document.querySelector('.app-content').scrollIntoView({ behavior: 'smooth' })}>
          Explore Trails
        </button>
      </div>
      
      {/* Main App Content */}
      <div className="app-content">
        <div className="main-content">
          {/* Left Column: Sidebar */}
          <div className="sidebar">
            {/* Tabs Navigation */}
            <div className="tabs-navigation">
              <button 
                className={activeTab === 'filter' ? 'active-tab' : ''} 
                onClick={() => setActiveTab('filter')}
              >
                Filter Routes
              </button>
              <button 
                className={activeTab === 'recommendations' ? 'active-tab' : ''} 
                onClick={() => setActiveTab('recommendations')}
              >
                Get Recommendations
              </button>
              <button 
                className={activeTab === 'categories' ? 'active-tab' : ''} 
                onClick={() => setActiveTab('categories')}
              >
                Route Categories
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'filter' && (
                <div className="filter-panel">
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
                      placeholder="Enter minimum distance"
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
                      placeholder="Enter maximum distance"
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
                      <option value="">All Difficulties</option>
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  
                  <div className="filter-buttons">
                    <button className="apply-button" onClick={applyFilters}>
                      Apply Filters
                    </button>
                    <button className="reset-button" onClick={resetFilters}>
                      Reset
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'recommendations' && (
                <RouteRecommendations onRouteSelect={handleRouteSelect} />
              )}
              
              {activeTab === 'categories' && (
                <RouteCategories routes={routes} onRouteSelect={handleRouteSelect} />
              )}
            </div>
            
            {/* Routes List */}
            <div className="routes-panel">
              {loading ? (
                <div className="loading-indicator">Loading routes...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : (
                <RouteList 
                  routes={filteredRoutes} 
                  onRouteSelect={handleRouteSelect} 
                  selectedRoute={selectedRoute} 
                />
              )}
            </div>
          </div>
          
          {/* Middle Column: Route Details */}
          <div className="details-panel">
            {selectedRoute ? (
              <>
                <RouteDetail route={selectedRoute} />
                <WeatherWidget routeId={selectedRoute.id} />
              </>
            ) : (
              <div className="no-route-selected">
                <p>Select a route from the list to view details</p>
              </div>
            )}
          </div>
          
          {/* Right Column: Map */}
          <div className="map-panel">
            <Map 
              routes={routes} 
              selectedRoute={selectedRoute} 
              onRouteSelect={handleRouteSelect} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
