import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, TextField, Button, Box, Alert, InputAdornment, IconButton } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Visibility, VisibilityOff, AccountBalance } from '@mui/icons-material';

function SignIn() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    console.log("User after login:", user);
    if (user) {
      if (user.role === 'Admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const validate = () => {
    let valid = true;
    let tempErrors = { email: '', password: '' };
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
      if (userData && userData.role === 'Admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 5, borderRadius: 4, boxShadow: 6, background: '#FFFFFF', color: '#333333', border: '1px solid #C0C0C0' }}>
          <Box textAlign="center" mb={3}>
            <AccountBalance sx={{ fontSize: 48, color: '#003366', mb: 1 }} />
            <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Sign in to your Online Banking account
            </Typography>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              required
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
              autoComplete="email"
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              fullWidth
              required
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, mb: 2, py: 1.5, background: '#003366', color: '#FFFFFF', '&:hover': { background: '#66CCFF', color: '#003366' } }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => navigate("/")}
            >
              Go to Home
            </Button>
            <Box textAlign="center" mt={2}>
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                  Create Account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SignIn; 