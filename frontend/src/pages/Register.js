import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Link,
  Card,
  CardContent,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  AdminPanelSettings,
  Person,
  Visibility,
  VisibilityOff,
  AccountBalance,
  ArrowForward
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Register = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Customer');
  const [secretKey, setSecretKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      await registerUser(
        data.fullName, 
        data.email, 
        data.password, 
        data.confirmPassword, 
        selectedRole, 
        selectedRole === 'Admin' ? secretKey : undefined
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    {
      value: 'Customer',
      label: 'Customer Account',
      description: 'Personal banking with deposit, withdraw, and transfer features',
      icon: <Person sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'rgba(30, 64, 175, 0.1)'
    },
    {
      value: 'Admin',
      label: 'Admin Account',
      description: 'System administration with user management and oversight',
      icon: <AdminPanelSettings sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'rgba(30, 64, 175, 0.1)'
    },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
      background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.05) 0%, rgba(29, 78, 216, 0.05) 100%)'
    }}>
      <Container maxWidth="md">
        <Paper elevation={isMobile ? 0 : 6} sx={{ 
          p: isMobile ? 3 : 5,
          borderRadius: 4,
          border: isMobile ? 'none' : '1px solid rgba(30, 64, 175, 0.1)',
          boxShadow: isMobile ? 'none' : theme.shadows[10],
          background: 'white'
        }}>
          {/* Header Section */}
          <Box textAlign="center" mb={4}>
            <Box sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              mb: 2,
              borderRadius: '50%',
              backgroundColor: 'rgba(30, 64, 175, 0.1)'
            }}>
              <AccountBalance sx={{ 
                fontSize: 48, 
                color: theme.palette.primary.main 
              }} />
            </Box>
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Create Your Account
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Join our online banking platform today
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Account Type Selection */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              Select Account Type
            </Typography>
            <Grid container spacing={2}>
              {roleOptions.map((role) => (
                <Grid item xs={12} sm={6} key={role.value}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedRole === role.value ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                      backgroundColor: selectedRole === role.value ? role.color : 'white',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: role.color,
                      },
                    }}
                    onClick={() => setSelectedRole(role.value)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      {role.icon}
                      <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                        {role.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {role.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {/* Hidden role field */}
            <input
              type="hidden"
              {...register('role', { required: 'Role is required' })}
              value={selectedRole}
            />

            {/* Admin Secret Key */}
            {selectedRole === 'Admin' && (
              <TextField
                fullWidth
                margin="normal"
                required
                label="Admin Secret Key"
                type={showSecretKey ? 'text' : 'password'}
                value={secretKey}
                onChange={e => setSecretKey(e.target.value)}
                autoComplete="off"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowSecretKey(!showSecretKey)}
                        edge="end"
                      >
                        {showSecretKey ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />
            )}

            {/* Name Field */}
            <TextField
              fullWidth
              margin="normal"
              required
              label="Full Name"
              autoComplete="name"
              autoFocus
              {...register('fullName', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Full name must be at least 2 characters',
                },
              })}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
              sx={{ mb: 2 }}
            />

            {/* Email Field */}
            <TextField
              fullWidth
              margin="normal"
              required
              label="Email Address"
              autoComplete="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mb: 2 }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              margin="normal"
              required
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
            />

            {/* Confirm Password Field */}
            <TextField
              fullWidth
              margin="normal"
              required
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 3 }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <ArrowForward />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
                color: 'white',
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {isLoading ? 'Creating Account...' : `Create ${selectedRole} Account`}
            </Button>

            <Divider sx={{ my: 3 }}>or</Divider>

            {/* Sign In Link */}
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link 
                  component={RouterLink} 
                  to="/signin" 
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;