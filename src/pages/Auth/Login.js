import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Alert, 
  Grid,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const Login = () => {
  const [userType, setUserType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  // const location = useLocation(); // Removed unused variable

  const handleUserTypeSelect = (event, newUserType) => {
    if (newUserType !== null) {
      setUserType(newUserType);
      // Pre-fill email based on user type for demo purposes
      setEmail(newUserType === 'admin' ? 'admin@example.com' : 'sales@example.com');
      setPassword('');
      setError('');
    }
  };

  const handleBack = () => {
    setUserType('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation for demo purposes
    if (!userType) {
      setError('Please select a user type');
      return;
    }
    
    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Validate password
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      // Redirect based on user type
      const targetPath = userType === 'admin' ? '/admin/dashboard' : '/sales/dashboard';
      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // User type selection view
  if (!userType) {
    return (
      <Container component="main" maxWidth="sm">
        <StyledPaper elevation={3}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Welcome to Medagg Carecustodian
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Please select your role to continue
          </Typography>
          
          {error && <Alert severity="error" sx={{ width: '100%', mb: 3 }}>{error}</Alert>}
          
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={5}>
              <Card 
                variant="outlined"
                sx={{ 
                  cursor: 'pointer',
                  borderColor: 'primary.main',
                  '&:hover': { boxShadow: 3 },
                  backgroundColor: userType === 'admin' ? 'action.hover' : 'background.paper'
                }}
                onClick={() => handleUserTypeSelect(null, 'admin')}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <AdminPanelSettingsIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Admin</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Access admin dashboard and manage sales team
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={5}>
              <Card 
                variant="outlined"
                sx={{ 
                  cursor: 'pointer',
                  borderColor: 'secondary.main',
                  '&:hover': { boxShadow: 3 },
                  backgroundColor: userType === 'sales' ? 'action.hover' : 'background.paper'
                }}
                onClick={() => handleUserTypeSelect(null, 'sales')}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <PersonIcon color="secondary" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Sales Person</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track your trips and update your progress
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Select your role to continue to the login page
            </Typography>
          </Box>
        </StyledPaper>
      </Container>
    );
  }

  // Login form view
  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography component="h1" variant="h5">
            {userType === 'admin' ? 'Admin' : 'Sales'} Login
          </Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Demo {userType} account:
          </Typography>
          <Typography variant="body2">
            Email: {userType}@example.com
          </Typography>
          <Typography variant="body2">
            Password: {userType}123
          </Typography>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Login;
