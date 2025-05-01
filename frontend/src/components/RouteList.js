import React, { useEffect, useState } from 'react';

const RouteList = ({ routes, onRouteSelect, selectedRoute }) => {
  const [routesWithDistance, setRoutesWithDistance] = useState([]);
  
  // Calculate distances for all routes
  useEffect(() => {
    if (!routes || routes.length === 0) {
      setRoutesWithDistance([]);
      return;
    }
    
    // Calculate distances for all routes
    const updatedRoutes = routes.map(route => {
      const distance = calculateRouteDistance(route.points);
      return { ...route, distance };
    });
    
    setRoutesWithDistance(updatedRoutes);
  }, [routes]);
  
  // Helper function to calculate distance between two points using Haversine formula
  const calculateDistance = (point1, point2) => {
    // Earth radius in kilometers
    const R = 6371.0;
    
    // Convert latitude and longitude from degrees to radians
    const lat1 = point1.lat * Math.PI / 180;
    const lon1 = point1.lng * Math.PI / 180;
    const lat2 = point2.lat * Math.PI / 180;
    const lon2 = point2.lng * Math.PI / 180;
    
    // Haversine formula
    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;
    const a = Math.sin(dlat / 2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    // Distance in kilometers
    return R * c;
  };
  
  // Calculate total route distance
  const calculateRouteDistance = (points) => {
    if (!points || points.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += calculateDistance(points[i], points[i + 1]);
    }
    
    return totalDistance;
  };
  
  // Helper function to get distance display
  const getDistanceDisplay = (route) => {
    if (route.distance !== undefined) return `${route.distance.toFixed(1)} km`;
    return 'N/A';
  };

  return (
    <div className="route-list">
      <h3>Available Routes {routesWithDistance.length > 0 && `(${routesWithDistance.length})`}</h3>
      
      {routesWithDistance.length === 0 ? (
        <div className="no-routes">
          <p>No routes found. Try adjusting your filters.</p>
        </div>
      ) : (
        <ul>
          {routesWithDistance.map(route => (
            <li 
              key={route.id} 
              className={`route-item ${selectedRoute && selectedRoute.id === route.id ? 'selected' : ''}`}
              onClick={() => onRouteSelect(route)}
            >
              <h4>{route.name}</h4>
              <div className="route-item-details">
                <span className="route-item-distance">
                  <i className="icon-distance">↔</i> {getDistanceDisplay(route)}
                </span>
                
                {route.difficulty && (
                  <span className={`route-item-difficulty ${route.difficulty.toLowerCase()}`}>
                    {route.difficulty}
                  </span>
                )}
              </div>
              
              <div className="route-item-info">
                <span className="route-item-surface">
                  <i className="icon-surface">◯</i> {route.surface_type || 'Unknown'}
                </span>
                
                <span className="route-item-elevation">
                  <i className="icon-elevation">▲</i> {route.elevation_gain || 0}m
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RouteList;
