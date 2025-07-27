import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton,
  Button,
  Grid
} from '@mui/material';
import { 
  PictureAsPdf as PdfIcon, 
  GridOn as CsvIcon,
  CheckCircle as CheckCircleIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from '@react-google-maps/api';

// Mock data - in a real app, this would come from an API
const mockTrips = [
  {
    id: 1,
    salesman: 'John Doe',
    from: 'Mumbai, Maharashtra',
    to: 'Pune, Maharashtra',
    distance: '150 km',
    cost: '₹1,200',
    status: 'completed',
    route: {
      origin: { lat: 19.0760, lng: 72.8777 },
      destination: { lat: 18.5204, lng: 73.8567 },
      waypoints: []
    }
  },
  {
    id: 2,
    salesman: 'Jane Smith',
    from: 'Delhi',
    to: 'Gurgaon',
    distance: '30 km',
    cost: '₹240',
    status: 'in-progress',
    route: {
      origin: { lat: 28.6139, lng: 77.2090 },
      destination: { lat: 28.4595, lng: 77.0266 },
      waypoints: []
    }
  }
];

// Map container style
const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px'
};

const AdminDashboard = () => {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [view, setView] = useState('list'); // 'list' or 'map'
  const [trips, setTrips] = useState(mockTrips);
  const [directions, setDirections] = useState(null);

  // Set first trip as selected by default
  useEffect(() => {
    if (trips.length > 0 && !selectedTrip) {
      setSelectedTrip(trips[0]);
      // In a real app, fetch directions from Google Maps API
      setDirections({
        routes: [{
          legs: [{
            start_address: trips[0].from,
            end_address: trips[0].to,
            distance: { text: trips[0].distance },
            duration: { text: '2 hours 30 mins' }
          }],
          overview_polyline: { points: 'mock_polyline_points' }
        }]
      });
    }
  }, [trips, selectedTrip]);

  const handleViewOnMap = (trip) => {
    setSelectedTrip(trip);
    setView('map');
    // In a real app, fetch directions from Google Maps API
    setDirections({
      routes: [{
        legs: [{
          start_address: trip.from,
          end_address: trip.to,
          distance: { text: trip.distance },
          duration: { text: '2 hours 30 mins' }
        }],
        overview_polyline: { points: 'mock_polyline_points' }
      }]
    });
  };

  const handleExportPdf = (trip) => {
    // In a real app, you would use a PDF generation library like jspdf or pdfmake
    // This is a simplified version that shows a preview of what would be exported
    const pdfContent = `
      Trip Details
      ============
      
      Salesman: ${trip.salesman}
      From: ${trip.from}
      To: ${trip.to}
      Distance: ${trip.distance}
      Cost: ${trip.cost}
      Status: ${trip.status}
      
      Generated on: ${new Date().toLocaleString()}
    `;
    
    // In a real implementation, you would generate and download a PDF here
    // For now, we'll show the content in an alert
    alert(`PDF Export for Trip ${trip.id}\n\n${pdfContent}`);
  };

  const handleExportCsv = (trip) => {
    try {
      // Create CSV content with proper formatting
      const csvContent = [
        ['Field', 'Value'],
        ['Trip ID', trip.id],
        ['Salesman', `"${trip.salesman}"`],
        ['From', `"${trip.from}"`],
        ['To', `"${trip.to}"`],
        ['Distance', `"${trip.distance}"`],
        ['Cost', `"${trip.cost}"`],
        ['Status', `"${trip.status}"`],
        ['Generated On', `"${new Date().toLocaleString()}"`]
      ]
      .map(row => row.join(','))
      .join('\n');
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `trip-${trip.id}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting trip data. Please try again.');
    }
  };

  const handleMarkCompleted = (tripId) => {
    setTrips(trips.map(trip => 
      trip.id === tripId ? { ...trip, status: 'completed' } : trip
    ));
    alert(`Trip ${tripId} marked as completed`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Sales Team Trips
      </Typography>
      
      <Grid container spacing={3}>
        {/* Trip List */}
        <Grid item xs={12} md={view === 'list' ? 12 : 5}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Salesman</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Distance</TableCell>
                  <TableCell>Cost</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow 
                    key={trip.id} 
                    hover 
                    selected={selectedTrip?.id === trip.id}
                    onClick={() => handleViewOnMap(trip)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <PersonIcon color="action" sx={{ mr: 1 }} />
                        {trip.salesman}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <div>From: {trip.from}</div>
                        <div>To: {trip.to}</div>
                      </Box>
                    </TableCell>
                    <TableCell>{trip.distance}</TableCell>
                    <TableCell>{trip.cost}</TableCell>
                    <TableCell>
                      <Box 
                        component="span" 
                        sx={{
                          p: '4px 8px',
                          borderRadius: 1,
                          bgcolor: trip.status === 'completed' ? '#e8f5e9' : '#fff8e1',
                          color: trip.status === 'completed' ? '#2e7d32' : '#f57f17',
                          display: 'inline-flex',
                          alignItems: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          textTransform: 'capitalize'
                        }}
                      >
                        {trip.status}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOnMap(trip);
                        }}
                        title="View on Map"
                      >
                        <LocationIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportPdf(trip);
                        }}
                        title="Export as PDF"
                      >
                        <PdfIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportCsv(trip);
                        }}
                        title="Export as CSV"
                      >
                        <CsvIcon />
                      </IconButton>
                      {trip.status === 'in-progress' && (
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkCompleted(trip.id);
                          }}
                          title="Mark as Completed"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Map View */}
        {view === 'map' && selectedTrip && (
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  {selectedTrip.salesman}'s Trip: {selectedTrip.from} → {selectedTrip.to}
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => setView('list')}
                  variant="outlined"
                >
                  Back to List
                </Button>
              </Box>
              
              <Box sx={{ height: '400px', borderRadius: 1, overflow: 'hidden', mb: 2 }}>
                <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={selectedTrip.route.origin}
                    zoom={12}
                    options={{
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false
                    }}
                  >
                    {directions && <DirectionsRenderer directions={directions} />}
                    <Marker position={selectedTrip.route.origin} />
                    <Marker position={selectedTrip.route.destination} />
                  </GoogleMap>
                </LoadScript>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PdfIcon />}
                  onClick={() => handleExportPdf(selectedTrip)}
                >
                  Export PDF
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<CsvIcon />}
                  onClick={() => handleExportCsv(selectedTrip)}
                >
                  Export CSV
                </Button>
                {selectedTrip.status === 'in-progress' && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleMarkCompleted(selectedTrip.id)}
                  >
                    Mark as Completed
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
