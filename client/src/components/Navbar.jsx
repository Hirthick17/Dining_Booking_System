import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: 'white',
        color: '#1a1a1a',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Box 
            sx={{ 
              bgcolor: '#F97316', 
              borderRadius: 1, 
              p: 0.5, 
              display: 'flex',
              alignItems: 'center',
              mr: 1
            }}
          >
            <RestaurantIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              cursor: 'pointer',
              fontWeight: 700,
              color: '#1a1a1a'
            }}
            onClick={() => navigate('/')}
          >
            DineAI
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 3, ml: 4 }}>
          <Button 
            color="inherit" 
            onClick={() => navigate('/')}
            sx={{ 
              fontWeight: 500,
              color: '#1a1a1a',
              '&:hover': { color: '#F97316' }
            }}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/about')}
            sx={{ 
              fontWeight: 500,
              color: '#1a1a1a',
              '&:hover': { color: '#F97316' }
            }}
          >
            Explore
          </Button>
        </Box>
        
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/dashboard')}
              sx={{ 
                fontWeight: 500,
                color: '#1a1a1a'
              }}
            >
              My Bookings
            </Button>
            <Button 
              variant="contained"
              onClick={handleLogout}
              sx={{ 
                fontWeight: 600,
                bgcolor: '#F97316',
                color: 'white',
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  bgcolor: '#E86D0F'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/login')}
              sx={{ 
                fontWeight: 500,
                color: '#1a1a1a'
              }}
            >
              Login
            </Button>
            <Button 
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{ 
                fontWeight: 600,
                bgcolor: '#F97316',
                color: 'white',
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  bgcolor: '#E86D0F'
                }
              }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
