import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Badge,
  CircularProgress
} from '@mui/material';
import {
  Person,
  AdminPanelSettings,
  Email,
  CalendarToday,
  Security,
  Edit,
  Save,
  Cancel,
  AccountBalance,
  History,
  Settings,
  VerifiedUser,
  Block,
  Logout,
  ArrowForward,
  Lock,
  Receipt,
  People,
  AccountTree
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// Dummy images for cards
const profileBgImage = 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=2070&auto=format&fit=crop';
const adminImage = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop';
const customerImage = 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=2070&auto=format&fit=crop';

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
    },
  });

  useEffect(() => {
    reset({
      fullName: user?.fullName || '',
      email: user?.email || '',
    });
  }, [user, reset]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  const handleSave = async (data) => {
    try {
      setLoading(true);
      // TODO: Implement profile update API call
      console.log('Updating profile:', data);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
    navigate('/signin');
  };

  const handleFeatureClick = (feature) => {
    if (user?.role === 'Customer') {
      switch (feature) {
        case 'My Accounts':
          navigate('/customer-dashboard');
          break;
        case 'Transaction History':
          navigate('/dashboard');
          break;
        case 'Security Settings':
          navigate('/profile');
          break;
        default:
          break;
      }
    } else {
      switch (feature) {
        case 'User Management':
          navigate('/admin/users');
          break;
        case 'Account Oversight':
          navigate('/admin/accounts');
          break;
        case 'Transaction History':
          navigate('/admin/transactions');
          break;
        case 'System Settings':
          navigate('/admin/settings');
          break;
        default:
          break;
      }
    }
  };

  const isAdmin = user?.role === 'Admin';

  const adminFeatures = [
    { icon: <People />, title: 'User Management', description: 'Manage all system users' },
    { icon: <AccountBalance />, title: 'Account Oversight', description: 'Monitor all bank accounts' },
    { icon: <Receipt />, title: 'Transaction History', description: 'View all system transactions' },
    { icon: <Settings />, title: 'System Settings', description: 'Configure banking system' },
  ];

  const customerFeatures = [
    { icon: <AccountBalance />, title: 'My Accounts', description: 'View and manage your accounts' },
    { icon: <History />, title: 'Transaction History', description: 'View your transaction history' },
    { icon: <Lock />, title: 'Security Settings', description: 'Manage your account security' },
  ];

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5">Please log in to view your profile</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header with Background */}
      <Box sx={{ 
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        mb: 4,
        height: 200,
        background: `linear-gradient(rgba(30, 64, 175, 0.7), rgba(30, 64, 175, 0.7)), url(${isAdmin ? adminImage : customerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end'
      }}>
        <Box sx={{ 
          width: '100%',
          p: 4,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box sx={{
                  backgroundColor: user.isActive ? theme.palette.success.main : theme.palette.error.main,
                  color: 'white',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid white'
                }}>
                  {user.isActive ? <VerifiedUser sx={{ fontSize: 14 }} /> : <Block sx={{ fontSize: 14 }} />}
                </Box>
              }
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: isAdmin ? 'error.main' : 'primary.main',
                  fontSize: '2.5rem',
                  border: '3px solid white'
                }}
              >
                {user.fullName.charAt(0).toUpperCase()}
              </Avatar>
            </Badge>
            
            <Box sx={{ ml: 3, color: 'white' }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                {user.fullName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Chip
                  label={user.role}
                  color={isAdmin ? 'error' : 'primary'}
                  icon={isAdmin ? <AdminPanelSettings /> : <Person />}
                  variant="filled"
                  sx={{ 
                    color: 'white',
                    fontWeight: 600,
                    mr: 1
                  }}
                />
                <Typography variant="body2">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Button
            variant="contained"
            color="error"
            startIcon={<Logout />}
            onClick={() => setShowLogoutDialog(true)}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(5px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3 
              }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                  Profile Information
                </Typography>
                {!isEditing ? (
                  <IconButton
                    onClick={handleEdit}
                    color="primary"
                    sx={{
                      backgroundColor: 'rgba(30, 64, 175, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(30, 64, 175, 0.2)'
                      }
                    }}
                  >
                    <Edit />
                  </IconButton>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={handleSubmit(handleSave)}
                      color="primary"
                      disabled={loading}
                      sx={{
                        backgroundColor: 'rgba(30, 64, 175, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(30, 64, 175, 0.2)'
                        }
                      }}
                    >
                      {loading ? <CircularProgress size={24} /> : <Save />}
                    </IconButton>
                    <IconButton
                      onClick={handleCancel}
                      color="secondary"
                      sx={{
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(244, 67, 54, 0.2)'
                        }
                      }}
                    >
                      <Cancel />
                    </IconButton>
                  </Box>
                )}
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {isEditing ? (
                <Box component="form" onSubmit={handleSubmit(handleSave)}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    margin="normal"
                    {...register('fullName', { 
                      required: 'Full name is required',
                      pattern: {
                        value: /^[A-Za-z\s\-']+$/,
                        message: 'Full name can only contain letters, spaces, hyphens, and apostrophes',
                      },
                    })}
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ mb: 3 }}
                  />
                </Box>
              ) : (
                <List disablePadding>
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary="Full Name"
                      primaryTypographyProps={{ fontWeight: 500 }}
                      secondary={user.fullName}
                      secondaryTypographyProps={{ color: 'text.primary' }}
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      primaryTypographyProps={{ fontWeight: 500 }}
                      secondary={user.email}
                      secondaryTypographyProps={{ color: 'text.primary' }}
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText
                      primary="Member Since"
                      primaryTypographyProps={{ fontWeight: 500 }}
                      secondary={new Date(user.createdAt).toLocaleDateString()}
                      secondaryTypographyProps={{ color: 'text.primary' }}
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                      {isAdmin ? <AdminPanelSettings /> : <Person />}
                    </ListItemIcon>
                    <ListItemText
                      primary="Account Type"
                      primaryTypographyProps={{ fontWeight: 500 }}
                      secondary={user.role}
                      secondaryTypographyProps={{ color: 'text.primary' }}
                    />
                  </ListItem>
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Account Features */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
                {isAdmin ? 'Administration Dashboard' : 'Account Features'}
              </Typography>
              
              <Grid container spacing={2}>
                {(isAdmin ? adminFeatures : customerFeatures).map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: theme.shadows[4],
                          transform: 'translateY(-4px)'
                        },
                      }}
                      onClick={() => handleFeatureClick(feature.title)}
                    >
                      <CardContent sx={{ 
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                      }}>
                        <Box sx={{ 
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(30, 64, 175, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          color: 'primary.main'
                        }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {feature.description}
                        </Typography>
                        <Button
                          variant="text"
                          size="small"
                          endIcon={<ArrowForward />}
                          sx={{ color: 'primary.main' }}
                        >
                          Explore
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Logout Dialog */}
      <Dialog 
        open={showLogoutDialog} 
        onClose={() => setShowLogoutDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: '100%',
            maxWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: 'error.main',
          color: 'white',
          fontWeight: 600
        }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            p: 2
          }}>
            <Logout sx={{ 
              fontSize: 60, 
              color: 'error.main',
              mb: 2
            }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Are you sure you want to logout?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You'll need to sign in again to access your account.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setShowLogoutDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleLogout}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;