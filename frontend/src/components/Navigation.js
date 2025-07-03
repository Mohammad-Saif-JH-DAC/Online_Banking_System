import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
} from '@mui/material';
import {
  AccountBalance,
  Person,
  AdminPanelSettings,
  Logout,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/signin');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)', color: 'white' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => {
            if (user?.role === 'Admin') {
              navigate('/admin-dashboard');
            } else {
              navigate('/dashboard');
            }
          }}
        >
          <AccountBalance />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }}>
          Online Banking System
        </Typography>

        {user && (location.pathname === '/dashboard' || location.pathname === '/customer-dashboard' || location.pathname === '/admin-dashboard') && (
          <>
            <Button
              color="inherit"
              component={RouterLink}
              to={user.role === 'Admin' ? '/admin-dashboard' : '/dashboard'}
              variant="text"
              sx={{ ml: 1, color: 'white' }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/about"
              variant="text"
              sx={{ ml: 1, color: 'white' }}
            >
              About
            </Button>
          </>
        )}
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white', mr: 1 }}>
              {user.fullName}
            </Typography>
            <Chip
              label={user.role}
              color={isAdmin ? 'error' : 'primary'}
              icon={isAdmin ? <AdminPanelSettings /> : <Person />}
              variant="outlined"
              size="small"
              sx={{ fontWeight: 'bold', fontSize: 16, bgcolor: 'white', color: isAdmin ? '#d32f2f' : '#1976d2' }}
            />
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: isAdmin ? '#d32f2f' : '#1976d2' }}>
                {isAdmin ? <AdminPanelSettings /> : <Person />}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>
                <Person sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box>
            <Button
              color="inherit"
              component={RouterLink}
              to="/signin"
              sx={{ mr: 1 }}
            >
              Sign In
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/register"
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 
