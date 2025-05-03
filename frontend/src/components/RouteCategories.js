import React, { useState, useEffect } from 'react';

/**
 * RouteCategories component - Displays categorized routes by location, type, and features
 * to help users identify different running options in Austin
 */
const RouteCategories = ({ routes, onRouteSelect }) => {
  const [categories, setCategories] = useState({
    locations: [],
    surfaceTypes: [],
    difficulties: [],
    features: []
  });

  // Process routes to extract categories
  useEffect(() => {
    if (!routes || routes.length === 0) return;

    // Extract unique locations (using route name keywords)
    const locationKeywords = {
      'Downtown': ['Lady Bird', 'Butler', 'Shoal Creek', 'Downtown'],
      'North Austin': ['Walnut Creek', 'Northern', 'North Austin'],
      'South Austin': ['Barton', 'Violet Crown', 'South Austin', 'Southern'],
      'East Austin': ['Southern Walnut', 'East Austin'],
      'West Austin': ['Bull Creek', 'West Austin']
    };

    // Extract unique surface types
    const surfaceTypes = [...new Set(routes.map(route => route.surface_type))].filter(Boolean);
    
    // Extract unique difficulties
    const difficulties = [...new Set(routes.map(route => route.difficulty))].filter(Boolean);
    
    // Extract features from amenities and descriptions
    const featureKeywords = {
      'Water Access': ['Creek access', 'Water', 'Lake', 'River'],
      'Scenic Views': ['views', 'scenic', 'beautiful'],
      'Technical Terrain': ['technical', 'rocky', 'challenging'],
      'Family Friendly': ['easy', 'paved', 'accessible'],
      'Dog Friendly': ['dog', 'pet'],
      'Shaded': ['shaded', 'trees', 'forest']
    };

    // Categorize routes by location
    const locationCategories = Object.keys(locationKeywords).map(location => {
      const keywords = locationKeywords[location];
      const matchingRoutes = routes.filter(route => 
        keywords.some(keyword => 
          route.name.includes(keyword) || 
          (route.description && route.description.includes(keyword))
        )
      );
      
      return {
        name: location,
        count: matchingRoutes.length,
        routes: matchingRoutes
      };
    }).filter(category => category.count > 0);

    // Categorize routes by feature
    const featureCategories = Object.keys(featureKeywords).map(feature => {
      const keywords = featureKeywords[feature];
      const matchingRoutes = routes.filter(route => {
        // Check in description
        if (route.description && keywords.some(keyword => 
          route.description.toLowerCase().includes(keyword.toLowerCase()))) {
          return true;
        }
        
        // Check in amenities
        if (route.amenities && route.amenities.some(amenity => 
          keywords.some(keyword => 
            amenity.toLowerCase().includes(keyword.toLowerCase())
          )
        )) {
          return true;
        }
        
        return false;
      });
      
      return {
        name: feature,
        count: matchingRoutes.length,
        routes: matchingRoutes
      };
    }).filter(category => category.count > 0);

    // Categorize by surface type
    const surfaceCategories = surfaceTypes.map(type => {
      const matchingRoutes = routes.filter(route => route.surface_type === type);
      return {
        name: type,
        count: matchingRoutes.length,
        routes: matchingRoutes
      };
    });

    // Categorize by difficulty
    const difficultyCategories = difficulties.map(difficulty => {
      const matchingRoutes = routes.filter(route => route.difficulty === difficulty);
      return {
        name: difficulty,
        count: matchingRoutes.length,
        routes: matchingRoutes
      };
    });

    setCategories({
      locations: locationCategories,
      surfaceTypes: surfaceCategories,
      difficulties: difficultyCategories,
      features: featureCategories
    });
  }, [routes]);

  // Handle clicking on a category to filter routes
  const handleCategoryClick = (categoryRoutes) => {
    // If there's only one route in the category, select it directly
    if (categoryRoutes.length === 1) {
      onRouteSelect(categoryRoutes[0]);
    } else {
      // Show a modal or highlight these routes
      // For now, we'll just select the first one
      onRouteSelect(categoryRoutes[0]);
    }
  };

  return (
    <div className="route-categories">
      <h3>Austin Running Routes</h3>
      
      <div className="category-section">
        <h4>By Location</h4>
        <div className="category-tags">
          {categories.locations.map((category, index) => (
            <div 
              key={`location-${index}`} 
              className="category-tag"
              onClick={() => handleCategoryClick(category.routes)}
            >
              <span className="category-name">{category.name}</span>
              <span className="category-count">{category.count}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="category-section">
        <h4>By Difficulty</h4>
        <div className="category-tags">
          {categories.difficulties.map((category, index) => (
            <div 
              key={`difficulty-${index}`} 
              className={`category-tag difficulty-${category.name.toLowerCase()}`}
              onClick={() => handleCategoryClick(category.routes)}
            >
              <span className="category-name">{category.name}</span>
              <span className="category-count">{category.count}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="category-section">
        <h4>By Surface</h4>
        <div className="category-tags">
          {categories.surfaceTypes.map((category, index) => (
            <div 
              key={`surface-${index}`} 
              className="category-tag"
              onClick={() => handleCategoryClick(category.routes)}
            >
              <span className="category-name">{category.name}</span>
              <span className="category-count">{category.count}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="category-section">
        <h4>By Feature</h4>
        <div className="category-tags">
          {categories.features.map((category, index) => (
            <div 
              key={`feature-${index}`} 
              className="category-tag"
              onClick={() => handleCategoryClick(category.routes)}
            >
              <span className="category-name">{category.name}</span>
              <span className="category-count">{category.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteCategories;
