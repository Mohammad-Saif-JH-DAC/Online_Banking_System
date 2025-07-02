import React, { useState } from 'react';
import { Box, Typography, Divider, Button, Alert, Switch, FormControlLabel } from '@mui/material';
import axios from 'axios';

const UserDetails = ({ user, onUserUpdated, onUserDeleted }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);

  const handleDelete = async () => {
    setError('');
    setLoading(true);
    try {
      await axios.delete(`/api/admin/users/${user.id}`);
      if (onUserDeleted) onUserDeleted(user.id);
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async () => {
    setError('');
    setBlockLoading(true);
    try {
      const response = await axios.patch(`/api/admin/users/${user.id}/block`, { block: user.isActive });
      if (onUserUpdated) onUserUpdated({ ...user, isActive: response.data.isActive });
    } catch (err) {
      setError('Failed to update user status');
    } finally {
      setBlockLoading(false);
    }
  };

  if (!user) return null;
  return (
    <Box>
      <Typography variant="h6">{user.name}</Typography>
      <Divider sx={{ my: 1 }} />
      <Typography><b>Account Number:</b> {user.accountNumber}</Typography>
      <Typography><b>Email:</b> {user.email}</Typography>
      <Typography><b>Status:</b> {user.isActive ? 'Active' : 'Blocked'}</Typography>
      <Typography><b>Role:</b> {user.role}</Typography>
      {/* Add more fields as needed */}
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete User'}
        </Button>
        <FormControlLabel
          control={
            <Switch
              checked={!user.isActive}
              onChange={handleBlockToggle}
              disabled={blockLoading}
              color="warning"
            />
          }
          label={user.isActive ? 'Block User' : 'Unblock User'}
        />
      </Box>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default UserDetails; 