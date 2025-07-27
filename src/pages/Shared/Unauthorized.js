import React from 'react';
import { Typography, Button, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../../contexts/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          p: 3,
        }}
      >
        <LockOutlinedIcon sx={{ fontSize: 100, color: 'warning.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          You don't have permission to access this page.
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          {user
            ? `Your account (${user.email}) doesn't have the required permissions to view this page.`
            : 'Please sign in to access this page.'}
        </Typography>
        <Box sx={{ mt: 3, '& > *:not(:last-child)': { mr: 2 } }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          {!user ? (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/')}
            >
              Go to Dashboard
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Unauthorized;
