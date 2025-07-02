import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody, Divider, Alert, Switch, FormControlLabel } from '@mui/material';
import axios from 'axios';

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [blockLoading, setBlockLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUser = async () => {
    const usersRes = await axios.get('/api/admin/users');
    const foundUser = usersRes.data.users.find(u => u.id === parseInt(id));
    setUser(foundUser);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchUser();
        // Fetch accounts for this user
        const accountsRes = await axios.get(`/api/admin/accounts/${id}`);
        setAccounts(accountsRes.data);
        // Fetch latest 10 transactions for all user's accounts
        let txs = [];
        for (const acc of accountsRes.data) {
          const txRes = await axios.get(`/api/banking/accounts/${acc.id}/transactions`);
          txs = txs.concat(txRes.data);
        }
        // Sort and take latest 10
        txs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTransactions(txs.slice(0, 10));
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBlockToggle = async () => {
    setError('');
    setBlockLoading(true);
    try {
      const response = await axios.patch(`/api/admin/users/${user.id}/block`, { block: user.isActive });
      setUser(response.data);
    } catch (err) {
      setError('Failed to update user status');
    } finally {
      setBlockLoading(false);
    }
  };

  const handleDelete = async () => {
    setError('');
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/admin/users/${user.id}`);
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  }
  if (!user) {
    return <Box p={4}><Typography>User not found.</Typography></Box>;
  }

  return (
    <Box p={4}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back</Button>
      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Typography variant="h5" gutterBottom>User Details</Typography>
        <Typography><b>Name:</b> {user.fullName}</Typography>
        <Typography><b>Email:</b> {user.email}</Typography>
        <Typography><b>Status:</b> {user.isActive ? 'Active' : 'Blocked'}</Typography>
        <Typography><b>Role:</b> {user.role}</Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? 'Deleting...' : 'Delete User'}
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
      </Paper>
      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom>Accounts</Typography>
        {accounts.length === 0 ? <Typography>No accounts found.</Typography> : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Account Number</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map(acc => (
                <TableRow key={acc.id}>
                  <TableCell>{acc.accountNumber}</TableCell>
                  <TableCell>{acc.balance}</TableCell>
                  <TableCell>{acc.isActive ? 'Active' : 'Inactive'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom>Latest 10 Transactions</Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
          {transactions.length === 0 ? <Typography>No transactions found.</Typography> : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map(tx => (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.id}</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>{tx.amount}</TableCell>
                    <TableCell>{tx.status}</TableCell>
                    <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminUserDetails; 