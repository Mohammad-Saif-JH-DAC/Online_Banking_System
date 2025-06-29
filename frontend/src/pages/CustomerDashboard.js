import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  AccountBalance,
  History,
  Security,
  Visibility,
  VisibilityOff,
  Edit,
  Save,
  Cancel,
  Refresh,
  Add,
  Send,
  Receipt,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadAccounts();
    loadTransactions();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/banking/accounts');
      setAccounts(response.data);
    } catch (err) {
      setError('Failed to load accounts: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/banking/transactions');
      setTransactions(response.data);
    } catch (err) {
      setError('Failed to load transactions: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setError('');
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      toast.error('Password must be at least 6 characters long');
      return;
    }
    try {
      await axios.post('/api/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
      });
      setShowPasswordDialog(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      toast.success('Password changed successfully!');
      await loadAccounts();
      await loadTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  const openPasswordDialog = () => { setError(''); setShowPasswordDialog(true); };

  const handleTabChange = (event, newValue) => {
    setError('');
    setTabValue(newValue);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5">Please log in to view your dashboard</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Customer Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          Welcome back, {user.fullName}! Manage your accounts and transactions.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ width: '100%' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="customer features">
            <Tab label="My Accounts" icon={<AccountBalance />} />
            <Tab label="Transaction History" icon={<History />} />
            <Tab label="Security Settings" icon={<Security />} />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">My Accounts</Typography>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadAccounts}
                disabled={loading}
              >
                Refresh
              </Button>
            </Box>

            {accounts.length === 0 ? (
              <Alert severity="info">No accounts found. Please contact support.</Alert>
            ) : (
              <Grid container spacing={2}>
                {accounts.map((account) => (
                  <Grid item xs={12} md={6} key={account.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Account #{account.accountNumber}
                        </Typography>
                        <Typography variant="h4" color="primary" gutterBottom>
                          {formatCurrency(account.balance)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Chip
                            label={account.isActive ? 'Active' : 'Inactive'}
                            color={account.isActive ? 'success' : 'default'}
                            size="small"
                          />
                          <Chip
                            label="Savings"
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          Created: {formatDate(account.createdAt)}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" startIcon={<Send />}>
                          Transfer
                        </Button>
                        <Button size="small" startIcon={<Receipt />}>
                          Statement
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Transaction History</Typography>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadTransactions}
                disabled={loading}
              >
                Refresh
              </Button>
            </Box>

            {transactions.length === 0 ? (
              <Alert severity="info">No transactions found.</Alert>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.type}
                            color={transaction.type === 'Deposit' ? 'success' : transaction.type === 'Withdrawal' ? 'error' : 'primary'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell align="right">
                          <Typography
                            color={transaction.type === 'Deposit' ? 'success.main' : 'error.main'}
                            fontWeight="bold"
                          >
                            {transaction.type === 'Withdrawal' ? '-' : '+'}{formatCurrency(transaction.amount)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>

            <List>
              <ListItem>
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText
                  primary="Change Password"
                  secondary="Update your account password for enhanced security"
                />
                <Button
                  variant="outlined"
                  onClick={openPasswordDialog}
                >
                  Change
                </Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <AccountBalance />
                </ListItemIcon>
                <ListItemText
                  primary="Account Information"
                  secondary={`Email: ${user.email} | Role: ${user.role}`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <History />
                </ListItemIcon>
                <ListItemText
                  primary="Login History"
                  secondary="View your recent login activity"
                />
                <Button variant="outlined">
                  View
                </Button>
              </ListItem>
            </List>
          </TabPanel>
        </Paper>
      </Box>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CustomerDashboard; 
