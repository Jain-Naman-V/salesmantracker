import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Polyline, Marker } from '@react-google-maps/api';
import { FaPlay, FaStop, FaRoute, FaExclamationTriangle } from 'react-icons/fa';
import { Box, Button, Card, CardContent, Typography, CircularProgress, Alert, Paper } from '@mui/material';

// Removed unused containerStyle variable

const center = {
  lat: 20.5937, // Center of India
  lng: 78.9629
};

const RATE_PER_KM = 10; // ₹10 per km

// Haversine formula to calculate distance between two coordinates in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const TripTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [tripData, setTripData] = useState({
    distance: 0,
    cost: 0,
    coordinates: []
  });
  const [currentPosition, setCurrentPosition] = useState(null);
  const [mapsError, setMapsError] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const watchId = useRef(null);

  // Clean up geolocation watcher on unmount
  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  // Load saved trip data from localStorage on component mount
  useEffect(() => {
    try {
      const savedTrip = localStorage.getItem('salesmanTrip');
      if (savedTrip) {
        setTripData(JSON.parse(savedTrip));
      }
    } catch (error) {
      console.error('Error loading trip data:', error);
    }
    setIsLoading(false);
  }, []);

  // Save trip data to localStorage whenever it changes
  useEffect(() => {
    if (tripData.coordinates.length > 0) {
      try {
        localStorage.setItem('salesmanTrip', JSON.stringify(tripData));
      } catch (error) {
        console.error('Error saving trip data:', error);
      }
    }
  }, [tripData]);

  const updatePosition = useCallback((position) => {
    const { latitude, longitude } = position.coords;
    const newCoordinate = {
      lat: latitude,
      lng: longitude,
      timestamp: Date.now()
    };
    
    setCurrentPosition(newCoordinate);
    
    setTripData(prev => {
      const coordinates = [...prev.coordinates, newCoordinate];
      let distance = 0;
      
      // Calculate total distance
      for (let i = 1; i < coordinates.length; i++) {
        distance += calculateDistance(
          coordinates[i - 1].lat,
          coordinates[i - 1].lng,
          coordinates[i].lat,
          coordinates[i].lng
        );
      }
      
      return {
        coordinates,
        distance,
        cost: distance * RATE_PER_KM
      };
    });
  }, []);

  const stopTracking = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setIsTracking(false);
  }, []);

  const startTracking = useCallback(() => {
    setGeoError(null);
    
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }

    setIsTracking(true);
    
    // Get current position first
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updatePosition(position);
        
        // Start watching position
        watchId.current = navigator.geolocation.watchPosition(
          updatePosition,
          (error) => {
            console.error('Error getting location:', error);
            setGeoError('Error getting location. Please ensure location services are enabled.');
            stopTracking();
          },
          { 
            enableHighAccuracy: true, 
            maximumAge: 10000, 
            timeout: 5000 
          }
        );
      },
      (error) => {
        console.error('Error getting initial location:', error);
        setGeoError('Error getting initial location. Please ensure location services are enabled.');
        setIsTracking(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 5000,
        maximumAge: 0 
      }
    );
  }, [updatePosition, stopTracking]);

  const resetTrip = useCallback(() => {
    if (window.confirm('Are you sure you want to reset the current trip?')) {
      try {
        localStorage.removeItem('salesmanTrip');
      } catch (error) {
        console.error('Error resetting trip:', error);
      }
      setTripData({ distance: 0, cost: 0, coordinates: [] });
      setCurrentPosition(null);
    }
  }, []);

  const pathCoordinates = tripData.coordinates.map(coord => ({
    lat: coord.lat,
    lng: coord.lng
  }));

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Trip Tracker
      </Typography>
      
      {geoError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center">
            <FaExclamationTriangle style={{ marginRight: 8 }} />
            {geoError}
          </Box>
        </Alert>
      )}
      
      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <Button
          variant="contained"
          color="success"
          startIcon={<FaPlay />}
          onClick={startTracking}
          disabled={isTracking}
        >
          Start Trip
        </Button>
        
        <Button
          variant="contained"
          color="error"
          startIcon={<FaStop />}
          onClick={stopTracking}
          disabled={!isTracking}
        >
          Stop Trip
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<FaRoute />}
          onClick={() => setShowMap(prev => !prev)}
        >
          {showMap ? 'Hide Map' : 'Show Map'}
        </Button>
        
        {tripData.coordinates.length > 0 && (
          <Button
            variant="outlined"
            color="warning"
            onClick={resetTrip}
          >
            Reset Trip
          </Button>
        )}
      </Box>
      
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3} mb={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Trip Summary
            </Typography>
            <Box display="grid" gap={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography>Distance:</Typography>
                <Typography fontWeight="bold">{tripData.distance.toFixed(2)} km</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Cost:</Typography>
                <Typography fontWeight="bold">₹{tripData.cost.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Points Recorded:</Typography>
                <Typography fontWeight="bold">{tripData.coordinates.length}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1} pt={1} borderTop={1} borderColor="divider">
                <Typography>Rate:</Typography>
                <Typography>₹{RATE_PER_KM}/km</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        {showMap && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Route Map
              </Typography>
              <Box sx={{ height: 300, position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
                {!process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? (
                  <Alert severity="error">
                    Google Maps API key is missing. Please check your configuration.
                  </Alert>
                ) : mapsError ? (
                  <Alert severity="error">
                    {mapsError}
                  </Alert>
                ) : (
                  <LoadScript
                    googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                    onError={() => setMapsError('Failed to load Google Maps')}
                  >
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={currentPosition || center}
                      zoom={currentPosition ? 14 : 4}
                    >
                      {pathCoordinates.length > 0 && (
                        <Polyline
                          path={pathCoordinates}
                          options={{
                            strokeColor: '#3B82F6',
                            strokeOpacity: 1.0,
                            strokeWeight: 4
                          }}
                        />
                      )}
                      {currentPosition && (
                        <Marker
                          position={currentPosition}
                          icon={{
                            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                          }}
                        />
                      )}
                    </GoogleMap>
                  </LoadScript>
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          {isTracking ? (
            <>
              <CircularProgress size={16} color="primary" />
              <Typography variant="body2" color="text.secondary">
                Tracking in progress...
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Ready to start tracking
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default TripTracker;
