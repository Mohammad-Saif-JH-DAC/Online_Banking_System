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
  MenuItem,
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
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [error, setError] = useState('');
  const [transferDialog, setTransferDialog] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDescription, setTransferDescription] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState('');
  const MAX_TRANSFER_AMOUNT = 300000;

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
    // Fetch accounts for the user (reuse logic from dashboard)
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/banking/accounts');
        const data = await response.json();
        setAccounts(data);
      } catch (err) {
        setTransferError('Failed to load accounts');
      }
    };
    fetchAccounts();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      fullName: user?.fullName || '',
      email: user?.email || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  const handleSave = async (data) => {
    try {
      // TODO: Implement profile update API call
      console.log('Updating profile:', data);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  const handleFeatureClick = (feature) => {
    if (user?.role === 'Customer') {
      switch (feature) {
        case 'My Accounts':
        case 'Transaction History':
        case 'Security Settings':
          navigate('/customer-dashboard');
          break;
        default:
          break;
      }
    }
  };

  const isAdmin = user?.role === 'Admin';

  const adminFeatures = [
    { icon: <AdminPanelSettings />, title: 'User Management', description: 'Manage all system users' },
    { icon: <AccountBalance />, title: 'Account Oversight', description: 'Monitor all bank accounts' },
    { icon: <History />, title: 'Transaction History', description: 'View all system transactions' },
    { icon: <Settings />, title: 'System Settings', description: 'Configure banking system' },
  ];

  const customerFeatures = [
    { icon: <AccountBalance />, title: 'My Accounts', description: 'View and manage your accounts' },
    { icon: <History />, title: 'Transaction History', description: 'View your transaction history' },
    { icon: <Security />, title: 'Security Settings', description: 'Manage your account security' },
  ];

  const handleOpenTransferDialog = () => {
    setFromAccountId(accounts.length > 0 ? accounts[0].id : '');
    setToAccountNumber('');
    setTransferAmount('');
    setTransferDescription('');
    setTransferError('');
    setTransferDialog(true);
  };

  const handleTransfer = async () => {
    if (!fromAccountId || !toAccountNumber || !transferAmount) {
      setTransferError('Please fill all required fields');
      return;
    }
    if (parseFloat(transferAmount) > MAX_TRANSFER_AMOUNT) {
      setTransferError('Transactions above ₹3,00,000 are not allowed');
      return;
    }
    setTransferError('');
    try {
      setTransferLoading(true);
      await fetch('/api/banking/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAccountId,
          toAccountNumber,
          amount: parseFloat(transferAmount),
          description: transferDescription || 'Transfer',
        })
      });
      setTransferDialog(false);
      setTransferAmount('');
      setTransferDescription('');
      setToAccountNumber('');
      setTransferError('');
    } catch (err) {
      setTransferError('Transfer failed');
    } finally {
      setTransferLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

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
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: isAdmin ? '#d32f2f' : '#1976d2',
                  fontSize: '2rem',
                }}
              >
                {isAdmin ? <AdminPanelSettings /> : <Person />}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                {user.fullName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip
                  label={user.role}
                  color={isAdmin ? 'error' : 'primary'}
                  icon={isAdmin ? <AdminPanelSettings /> : <Person />}
                  variant="outlined"
                />
                <Chip
                  label={user.isActive ? 'Active' : 'Inactive'}
                  color={user.isActive ? 'success' : 'default'}
                  icon={user.isActive ? <VerifiedUser /> : <Block />}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="textSecondary">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setShowLogoutDialog(true)}
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          {/* Profile Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Profile Information</Typography>
                <Tooltip title={isEditing ? 'Save changes' : 'Edit profile'}>
                  <IconButton
                    onClick={isEditing ? handleSubmit(handleSave) : handleEdit}
                    color="primary"
                  >
                    {isEditing ? <Save /> : <Edit />}
                  </IconButton>
                </Tooltip>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {isEditing ? (
                <Box component="form" onSubmit={handleSubmit(handleSave)}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    margin="normal"
                    {...register('fullName', { required: 'Full name is required' })}
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
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
                  />
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button type="submit" variant="contained" size="small">
                      Save
                    </Button>
                    <Button variant="outlined" size="small" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary="Full Name"
                      secondary={user.fullName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={user.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText
                      primary="Member Since"
                      secondary={new Date(user.createdAt).toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {isAdmin ? <AdminPanelSettings /> : <Person />}
                    </ListItemIcon>
                    <ListItemText
                      primary="Role"
                      secondary={user.role}
                    />
                  </ListItem>
                </List>
              )}
            </Paper>
          </Grid>

          {/* Account Features */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {isAdmin ? 'Admin Features' : 'Account Features'}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                {(isAdmin ? adminFeatures : customerFeatures).map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        height: '100%',
                        cursor: !isAdmin ? 'pointer' : 'default',
                        transition: 'all 0.3s ease',
                        '&:hover': !isAdmin ? {
                          boxShadow: 2,
                          transform: 'translateY(-2px)',
                        } : {},
                      }}
                      onClick={() => !isAdmin && handleFeatureClick(feature.title)}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Box sx={{ color: 'primary.main', mb: 1 }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="subtitle2" gutterBottom>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {feature.description}
                        </Typography>
                        {!isAdmin && (
                          <Button
                            variant="text"
                            size="small"
                            sx={{ mt: 1 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFeatureClick(feature.title);
                            }}
                          >
                            Open
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Logout Dialog */}
      <Dialog open={showLogoutDialog} onClose={() => setShowLogoutDialog(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to logout from your account?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLogoutDialog(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 
