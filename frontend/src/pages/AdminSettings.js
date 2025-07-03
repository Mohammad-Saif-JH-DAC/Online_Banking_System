import React, { useState } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const AdminSettings = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // TODO: Implement API call to update admin credentials
    setSuccess('Credentials updated successfully!');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>
        <Typography variant="h4" fontWeight={700} mb={3} color="#003366">
          Admin Settings
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <Box mt={3}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Save Changes
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AdminSettings; 