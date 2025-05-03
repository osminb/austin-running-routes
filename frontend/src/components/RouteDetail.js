import React, { useState } from 'react';
import { shareRoute } from '../utils/api';

const RouteDetail = ({ route }) => {
  const [shareStatus, setShareStatus] = useState({ isSharing: false, result: null, error: null });
  
  if (!route) return null;
  
  // Calculate distance from route points if available
  const calculateDistance = () => {
    if (route.distance) return route.distance.toFixed(1);
    if (!route.points || route.points.length < 2) return 'N/A';
    
    // For demo purposes, just return the distance if it exists
    return 'Calculating...';
  };
  
  const handleShareRoute = async () => {
    try {
      setShareStatus({ isSharing: true, result: null, error: null });
      const result = await shareRoute(route.id);
      setShareStatus({ isSharing: false, result, error: null });
    } catch (error) {
      setShareStatus({ isSharing: false, result: null, error: error.message || 'Failed to share route' });
    }
  };
  
  const copyShareLink = () => {
    if (shareStatus.result?.share_url) {
      navigator.clipboard.writeText(shareStatus.result.share_url);
      alert('Share link copied to clipboard!');
    }
  };
  
  return (
    <div className="route-detail">
      <h3>Route Details</h3>
      
      <div className="route-header">
        <h4>{route.name}</h4>
        <div className="route-badge">{route.difficulty || 'Unknown'}</div>
      </div>
      
      <p className="route-description">{route.description}</p>
      
      <div className="route-share">
        {!shareStatus.result ? (
          <button 
            className="share-button" 
            onClick={handleShareRoute}
            disabled={shareStatus.isSharing}
          >
            {shareStatus.isSharing ? 'Sharing...' : 'Share This Route'}
          </button>
        ) : (
          <div className="share-result">
            <p className="share-success">Route shared successfully!</p>
            <div className="share-url-container">
              <input 
                type="text" 
                className="share-url" 
                value={shareStatus.result.share_url} 
                readOnly 
              />
              <button className="copy-button" onClick={copyShareLink}>
                Copy
              </button>
            </div>
          </div>
        )}
        
        {shareStatus.error && (
          <p className="share-error">Error: {shareStatus.error}</p>
        )}
      </div>
      
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
