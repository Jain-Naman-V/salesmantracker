import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Save as SaveIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  Map as MapIcon
} from '@mui/icons-material';

const Settings = () => {
  const [settings, setSettings] = useState({
    companyName: 'Sales Tracker Inc.',
    costPerKm: 8,
    enableNotifications: true,
    enableLocationTracking: true,
    enableAutoBackup: false,
    googleMapsApiKey: 'your_api_key_here',
    maxTripDistance: 100,
    workingHours: {
      start: '09:00',
      end: '18:00'
    }
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // In a real app, you would save to backend here
    console.log('Saving settings:', settings);
    setSnackbar({
      open: true,
      message: 'Settings saved successfully!',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Company Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <BusinessIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Company Settings</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <TextField
                fullWidth
                label="Company Name"
                value={settings.companyName}
                onChange={(e) => handleSettingChange('companyName', e.target.value)}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Cost per Kilometer (₹)"
                type="number"
                value={settings.costPerKm}
                onChange={(e) => handleSettingChange('costPerKm', parseFloat(e.target.value))}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Maximum Trip Distance (km)"
                type="number"
                value={settings.maxTripDistance}
                onChange={(e) => handleSettingChange('maxTripDistance', parseInt(e.target.value))}
                margin="normal"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Working Hours */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <BusinessIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Working Hours</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Start Time"
                    type="time"
                    value={settings.workingHours.start}
                    onChange={(e) => handleSettingChange('workingHours', {
                      ...settings.workingHours,
                      start: e.target.value
                    })}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="End Time"
                    type="time"
                    value={settings.workingHours.end}
                    onChange={(e) => handleSettingChange('workingHours', {
                      ...settings.workingHours,
                      end: e.target.value
                    })}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <NotificationsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Notifications</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableNotifications}
                    onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
                  />
                }
                label="Enable Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableAutoBackup}
                    onChange={(e) => handleSettingChange('enableAutoBackup', e.target.checked)}
                  />
                }
                label="Enable Auto Backup"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Location & Security */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Location & Security</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableLocationTracking}
                    onChange={(e) => handleSettingChange('enableLocationTracking', e.target.checked)}
                  />
                }
                label="Enable Location Tracking"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Google Maps Configuration */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <MapIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Google Maps Configuration</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Alert severity="info" sx={{ mb: 2 }}>
                Configure your Google Maps API key to enable map functionality and location services.
              </Alert>
              
              <TextField
                fullWidth
                label="Google Maps API Key"
                value={settings.googleMapsApiKey}
                onChange={(e) => handleSettingChange('googleMapsApiKey', e.target.value)}
                margin="normal"
                type="password"
                helperText="This key is used for map display and location services"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings; 