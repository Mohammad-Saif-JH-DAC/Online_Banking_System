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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  AdminPanelSettings,
  Person,
  Security,
  AccountBalance,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Customer');
  const [secretKey, setSecretKey] = useState('');

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
      console.log('Submitting registration with role:', selectedRole); // Debug log
      await registerUser(data.fullName, data.email, data.password, data.confirmPassword, selectedRole, selectedRole === 'Admin' ? secretKey : undefined);
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
      icon: <Person sx={{ fontSize: 40, color: '#003366' }} />,
      color: '#66CCFF',
    },
    {
      value: 'Admin',
      label: 'Admin Account',
      description: 'System administration with user management and oversight',
      icon: <AdminPanelSettings sx={{ fontSize: 40, color: '#003366' }} />,
      color: '#66CCFF',
    },
  ];

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            background: '#FFFFFF',
            color: '#333333',
            border: '1px solid #C0C0C0',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Create Account
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          </Box>
          
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3, textAlign: 'center' }}>
            Choose your account type and start your banking journey
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
            {/* Role Selection */}
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              Select Account Type
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {roleOptions.map((role) => (
                <Grid item xs={6} key={role.value}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedRole === role.value ? '2px solid #003366' : '1px solid #e0e0e0',
                      backgroundColor: selectedRole === role.value ? role.color : 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#003366',
                        backgroundColor: role.color,
                      },
                    }}
                    onClick={() => setSelectedRole(role.value)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      {role.icon}
                      <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                        {role.label}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {role.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Hidden role field for form submission */}
            <input
              type="hidden"
              {...register('role', { required: 'Role is required' })}
              value={selectedRole}
            />

            {/* Secret Key for Admins */}
            {selectedRole === 'Admin' && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Admin Secret Key"
                type="password"
                value={secretKey}
                onChange={e => setSecretKey(e.target.value)}
                autoComplete="off"
                sx={{ mb: 2 }}
              />
            )}
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
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
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
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
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
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
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, mb: 2, py: 1.5, background: 'linear-gradient(135deg, #8e24aa 0%, #ba68c8 100%)', color: 'white' }}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : `Create ${selectedRole} Account`}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                {"Already have an account? Sign In"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;