import React from 'react';

const RouteDetail = ({ route }) => {
  if (!route) return null;
  
  // Calculate distance from route points if available
  const calculateDistance = () => {
    if (route.distance) return route.distance.toFixed(1);
    if (!route.points || route.points.length < 2) return 'N/A';
    
    // For demo purposes, just return the distance if it exists
    return 'Calculating...';
  };
  
  return (
    <div className="route-detail">
      <h3>Route Details</h3>
      
      <div className="route-header">
        <h4>{route.name}</h4>
        <div className="route-badge">{route.difficulty || 'Unknown'}</div>
      </div>
      
      <p className="route-description">{route.description}</p>
      
      <div className="route-stats">
        <div className="detail-item">
          <div className="detail-label">Distance</div>
          <div className="detail-value">{calculateDistance()} km</div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">Surface Type</div>
          <div className="detail-value">{route.surface_type || 'Not specified'}</div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">Elevation Gain</div>
          <div className="detail-value">{route.elevation_gain || 0}m</div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">Difficulty</div>
          <div className="detail-value">{route.difficulty || 'Not rated'}</div>
        </div>
      </div>
      
      <div className="route-amenities">
        <h4>Amenities</h4>
        {route.amenities && route.amenities.length > 0 ? (
          <ul className="amenities-list">
            {route.amenities.map((amenity, index) => (
              <li key={index} className="amenity-item">
                <span className="amenity-icon">✓</span> {amenity}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-amenities">No amenities listed for this route</p>
        )}
      </div>
      
      {route.notes && (
        <div className="route-notes">
          <h4>Notes</h4>
          <p>{route.notes}</p>
        </div>
      )}
    </div>
  );
};

export default RouteDetail;
