import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for the default marker icon issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom start marker icon
const startIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map view updates when selected route changes
const MapController = ({ selectedRoute }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedRoute && selectedRoute.points && selectedRoute.points.length > 0) {
      // Create bounds from route points
      const points = selectedRoute.points.map(point => [point.lat, point.lng]);
      const bounds = L.latLngBounds(points);
      
      // Add padding to bounds for better visibility
      map.fitBounds(bounds, { 
        padding: [30, 30],
        maxZoom: 16,
        animate: true,
        duration: 0.5
      });
    }
  }, [selectedRoute, map]);
  
  return null;
};

const Map = ({ routes, selectedRoute, onRouteSelect }) => {
  // Austin, TX center coordinates
  const defaultCenter = [30.2672, -97.7431];
  const defaultZoom = 12;
  
  // Colors for different route difficulties
  const difficultyColors = {
    'Easy': '#4CAF50',     // Green
    'Moderate': '#FF9800', // Orange
    'Hard': '#F44336'      // Red
  };
  
  // Convert route points to GeoJSON
  const routesToGeoJSON = (routes) => {
    return {
      type: 'FeatureCollection',
      features: routes.map(route => {
        // Ensure we have valid points
        if (!route.points || route.points.length < 2) return null;
        
        return {
          type: 'Feature',
          properties: {
            id: route.id,
            name: route.name,
            description: route.description,
            difficulty: route.difficulty,
            isSelected: selectedRoute && selectedRoute.id === route.id
          },
          geometry: {
            type: 'LineString',
            coordinates: route.points.map(point => [point.lng, point.lat]) // GeoJSON uses [lng, lat] order
          }
        };
      }).filter(feature => feature !== null)
    };
  };
  
  // Style function for GeoJSON
  const styleRoute = (feature) => {
    const color = difficultyColors[feature.properties.difficulty] || '#3388ff';
    const isSelected = feature.properties.isSelected;
    
    return {
      color: color,
      weight: isSelected ? 6 : 4,
      opacity: isSelected ? 1 : 0.8,
      lineCap: 'round',
      lineJoin: 'round'
    };
  };
  
  // Event handlers for GeoJSON features
  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      layer.on({
        click: () => {
          const routeId = feature.properties.id;
          const route = routes.find(r => r.id === routeId);
          if (route) {
            onRouteSelect(route);
          }
        }
      });
    }
  };
  
  // Create GeoJSON data
  const geojsonData = routesToGeoJSON(routes);
  
  return (
    <div className="map-wrapper">
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // We'll add zoom control in a better position
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Add zoom control to top-right */}
        <div className="leaflet-top leaflet-right">
          <div className="leaflet-control-zoom leaflet-bar leaflet-control">
            <a className="leaflet-control-zoom-in" href="#" title="Zoom in" role="button" aria-label="Zoom in">+</a>
            <a className="leaflet-control-zoom-out" href="#" title="Zoom out" role="button" aria-label="Zoom out">−</a>
          </div>
        </div>
        
        {/* Map controller to handle view updates */}
        <MapController selectedRoute={selectedRoute} />
        
        {/* Render routes as GeoJSON */}
        <GeoJSON 
          data={geojsonData} 
          style={styleRoute} 
          onEachFeature={onEachFeature} 
        />
        
        {/* Add start markers for each route */}
        {routes.map(route => (
          <Marker 
            key={`marker-${route.id}`}
            position={[route.start_coordinates.lat, route.start_coordinates.lng]}
            icon={startIcon}
            eventHandlers={{
              click: () => onRouteSelect(route)
            }}
          >
            <Popup>
              <div className="map-popup">
                <h3>{route.name}</h3>
                <p>{route.description}</p>
                <button 
                  className="view-details-btn"
                  onClick={() => onRouteSelect(route)}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Legend */}
        <div className="map-legend">
          <h4>Route Difficulty</h4>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: difficultyColors['Easy'] }}></span>
            <span>Easy</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: difficultyColors['Moderate'] }}></span>
            <span>Moderate</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: difficultyColors['Hard'] }}></span>
            <span>Hard</span>
          </div>
        </div>
      </MapContainer>
    </div>
  );
};

export default Map;
