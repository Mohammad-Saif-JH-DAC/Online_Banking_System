import React, { useState, useEffect } from "react";
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Alert, 
  InputAdornment, 
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Visibility, 
  VisibilityOff, 
  AccountBalance,
  Login,
  Home,
  PersonAdd
} from '@mui/icons-material';

function SignIn() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'Admin' ? '/admin-dashboard' : '/dashboard');
    }
  }, [user, navigate]);

  const validate = () => {
    let valid = true;
    const tempErrors = { email: '', password: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      tempErrors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Enter a valid email address';
      valid = false;
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    
    setLoading(true);
    try {
      const userData = await login(formData.email, formData.password);
      if (userData) {
        navigate(userData.role === 'Admin' ? '/admin-dashboard' : '/dashboard');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
      background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.05) 0%, rgba(29, 78, 216, 0.05) 100%)'
    }}>
      <Container maxWidth="sm">
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
              Online Banking
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Sign in to access your financial dashboard
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              margin="normal"
              name="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              error={!!errors.email}
              helperText={errors.email}
              autoComplete="email"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              error={!!errors.password}
              helperText={errors.password}
              autoComplete="current-password"
              InputProps={{
                sx: { borderRadius: 2 },
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
            />

            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Login />}
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
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }}>or</Divider>

          {/* Secondary Actions */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<Home />}
              onClick={() => navigate("/")}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 500
              }}
            >
              Home
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<PersonAdd />}
              onClick={() => navigate("/register")}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 500
              }}
            >
              Register
            </Button>
          </Box>

          {/* Footer Links */}
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              <Link 
                to="/forgot-password" 
                style={{ 
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Forgot password?
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SignIn;