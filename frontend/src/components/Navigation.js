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
  Divider,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccountBalance,
  Person,
  AdminPanelSettings,
  Logout,
  Settings,
  Notifications,
  Dashboard
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isAdmin = user?.role === 'Admin';

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenu = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotificationsAnchorEl(null);
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

  const handleSettings = () => {
    handleClose();
    navigate('/admin-settings');
  };

  const handleDashboard = () => {
    navigate(isAdmin ? '/admin-dashboard' : '/dashboard');
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)', 
        color: 'white',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        py: 1.5,
        px: 4,
        minHeight: '80px',
      }}
    >
      <Toolbar sx={{ minHeight: '80px', px: 2 }}>
        {/* Logo/Brand */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mr: 3,
            cursor: 'pointer',
            '&:hover': { opacity: 0.9 }
          }}
          onClick={handleDashboard}
        >
          <AccountBalance sx={{ 
            fontSize: 32, 
            mr: 1,
            color: 'white'
          }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              letterSpacing: 0.5,
              color: 'white',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Online Banking
          </Typography>
        </Box>

        {/* Navigation Links - Only shown when logged in */}
        {user && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1,
            ml: 3,
            gap: 1
          }}>
            <Button
              startIcon={<Dashboard />}
              onClick={handleDashboard}
              sx={{
                color: 'white',
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: location.pathname.includes('dashboard') ? 600 : 400,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)'
                }
              }}
            >
              Dashboard
            </Button>
          </Box>
        )}

        {/* Right-side actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              {/* Notifications */}
              <IconButton
                size="medium"
                aria-label="show notifications"
                color="inherit"
                onClick={handleNotificationsMenu}
                sx={{ 
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.12)'
                  }
                }}
              >
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={notificationsAnchorEl}
                open={Boolean(notificationsAnchorEl)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    minWidth: 300,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem dense sx={{ cursor: 'default' }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Notifications (3)
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                  <Avatar sx={{ bgcolor: '#4caf50' }}>P</Avatar>
                  Payment received from John Doe
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Avatar sx={{ bgcolor: '#2196f3' }}>A</Avatar>
                  New account statement available
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Avatar sx={{ bgcolor: '#ff9800' }}>S</Avatar>
                  Scheduled maintenance tonight
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose} sx={{ justifyContent: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    View all notifications
                  </Typography>
                </MenuItem>
              </Menu>

              {/* User Profile */}
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                {!isMobile && (
                  <Box sx={{ textAlign: 'right', mr: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                      {user.fullName}
                    </Typography>
                    <Chip
                      label={user.role}
                      size="small"
                      icon={isAdmin ? <AdminPanelSettings fontSize="small" /> : <Person fontSize="small" />}
                      sx={{ 
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        bgcolor: isAdmin ? 'error.light' : 'primary.light',
                        color: isAdmin ? 'error.contrastText' : 'primary.contrastText',
                        mt: 0.5
                      }}
                    />
                  </Box>
                )}
                <IconButton
                  size="medium"
                  aria-label="account of current user"
                  aria-controls="user-menu"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ 
                    p: 0,
                    '&:hover': {
                      opacity: 0.9
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      bgcolor: isAdmin ? 'error.main' : 'primary.main',
                      border: '2px solid white'
                    }}
                  >
                    {user.fullName.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    elevation: 4,
                    sx: {
                      width: 240,
                      overflow: 'visible',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem dense sx={{ cursor: 'default' }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {user.fullName}
                    </Typography>
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{ 
                        ml: 1,
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        bgcolor: isAdmin ? 'error.light' : 'primary.light',
                        color: isAdmin ? 'error.contrastText' : 'primary.contrastText'
                      }}
                    />
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleProfile}>
                    <Person sx={{ mr: 1.5, color: 'text.secondary' }} />
                    My Profile
                  </MenuItem>
                  <MenuItem onClick={handleSettings}>
                    <Settings sx={{ mr: 1 }} />
                    Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1.5, color: 'text.secondary' }} />
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/signin"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)'
                  }
                }}
              >
                Sign In
              </Button>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/register"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'white'
                  }
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;