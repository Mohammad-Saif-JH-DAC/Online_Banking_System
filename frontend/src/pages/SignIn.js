import React, { useState } from "react";
import { Container, Paper, Typography, TextField, Button, Box, Alert, InputAdornment, IconButton } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Visibility, VisibilityOff, AccountBalance } from '@mui/icons-material';

function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      const user = await login(formData.email, formData.password);
      if (user) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #f0f4c3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 5, borderRadius: 4, boxShadow: 6 }}>
          <Box textAlign="center" mb={3}>
            <AccountBalance sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
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
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
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