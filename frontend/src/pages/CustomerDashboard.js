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
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  AccountBalance,
  AccountBalance as AccountBalanceIcon,
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
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const navigate = useNavigate();
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
  const [transferDialog, setTransferDialog] = useState(false);
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDescription, setTransferDescription] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const MAX_TRANSFER_AMOUNT = 300000; // 3 lakhs in INR
  const [statementDialog, setStatementDialog] = useState(false);
  const [statementAccount, setStatementAccount] = useState(null);
  const [loginHistoryDialog, setLoginHistoryDialog] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);

  const securityMeasures = [
    {
      title: "Use Strong Passwords",
      description: "Create unique passwords with a mix of letters, numbers, and symbols. Avoid using the same password for multiple accounts.",
      icon: "🔑"
    },
    {
      title: "Enable Two-Factor Authentication",
      description: "Add an extra layer of security by enabling 2FA for your online banking account.",
      icon: "📱"
    },
    {
      title: "Beware of Phishing",
      description: "Never click on suspicious links or provide your credentials to untrusted sources.",
      icon: "⚠️"
    },
    {
      title: "Monitor Your Accounts",
      description: "Regularly check your account statements and transaction history for unauthorized activity.",
      icon: "👀"
    },
    {
      title: "Logout After Use",
      description: "Always log out from your online banking session, especially on shared or public devices.",
      icon: "🚪"
    }
  ];

  // Auto-advance carousel every 4 seconds unless paused
  useEffect(() => {
    if (carouselPaused) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % securityMeasures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselPaused, securityMeasures.length]);

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
        userId: user.id,
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  const handleOpenTransferDialog = () => {
    setFromAccountId(accounts.length > 0 ? accounts[0].id : '');
    setToAccountNumber('');
    setTransferAmount('');
    setTransferDescription('');
    setError('');
    setTransferDialog(true);
  };

  const handleTransfer = async () => {
    if (!fromAccountId || !toAccountNumber || !transferAmount) {
      setError('Please fill all required fields');
      return;
    }
    if (parseFloat(transferAmount) > MAX_TRANSFER_AMOUNT) {
      setError('Transactions above ₹3,00,000 are not allowed');
      toast.error('Transactions above ₹3,00,000 are not allowed');
      return;
    }
    setError('');
    try {
      setTransferLoading(true);
      await axios.post('/api/banking/transfer', {
        fromAccountId: fromAccountId,
        toAccountNumber: toAccountNumber,
        amount: parseFloat(transferAmount),
        description: transferDescription || 'Transfer',
      });
      setTransferDialog(false);
      setTransferAmount('');
      setTransferDescription('');
      setToAccountNumber('');
      toast.success('Transfer successful!');
      await loadAccounts();
      await loadTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
      toast.error(err.response?.data?.message || 'Transfer failed');
    } finally {
      setTransferLoading(false);
    }
  };

  const handleOpenStatementDialog = (account) => {
    setStatementAccount(account);
    setStatementDialog(true);
  };

  const handleDownloadStatement = () => {
    if (!statementAccount) return;
    const accountTransactions = transactions
      .filter(t => t.fromAccountNumber === statementAccount.accountNumber || t.toAccountNumber === statementAccount.accountNumber)
      .slice(0, 10);
    const doc = new jsPDF();
    // Title
    doc.setFontSize(18);
    doc.text('Online Banking Payment Statement', 105, 18, { align: 'center' });
    // Subtitle
    doc.setFontSize(12);
    doc.text(`Account Number: ${statementAccount.accountNumber}`, 14, 30);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 38);
    // Table
    autoTable(doc, {
      startY: 45,
      head: [['Date', 'Type', 'Description', 'Amount (INR)']],
      body: accountTransactions.map(t => [
        new Date(t.createdAt).toLocaleString(),
        t.type,
        t.description,
        formatCurrency(t.amount)
      ]),
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 14, right: 14 },
      tableLineColor: [44, 62, 80],
      tableLineWidth: 0.1,
    });
    // Footer
    doc.setFontSize(11);
    doc.text('Thank you for banking with us!', 105, doc.internal.pageSize.getHeight() - 15, { align: 'center' });
    doc.save('Transaction_History.pdf');
    setStatementDialog(false);
  };

  const handleOpenLoginHistoryDialog = () => setLoginHistoryDialog(true);
  const handleCloseLoginHistoryDialog = () => setLoginHistoryDialog(false);

  const handleNext = () => {
    setCarouselIndex((carouselIndex + 1) % securityMeasures.length);
    setCarouselPaused(true);
    setTimeout(() => setCarouselPaused(false), 8000); // Pause auto-advance for 8s after manual nav
  };
  const handlePrev = () => {
    setCarouselIndex((carouselIndex - 1 + securityMeasures.length) % securityMeasures.length);
    setCarouselPaused(true);
    setTimeout(() => setCarouselPaused(false), 8000);
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
                        <Button size="small" startIcon={<Send />} onClick={handleOpenTransferDialog}>
                          Transfer
                        </Button>
                        <Button size="small" startIcon={<Receipt />} onClick={() => handleOpenStatementDialog(account)}>
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
                      <TableCell>From Account</TableCell>
                      <TableCell>To Account</TableCell>
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
                        <TableCell>{transaction.fromAccountNumber ? `${transaction.fromAccountNumber}${accounts.some(a => a.accountNumber === transaction.fromAccountNumber) ? ' (You)' : ''}` : ''}</TableCell>
                        <TableCell>{transaction.toAccountNumber ? `${transaction.toAccountNumber}${accounts.some(a => a.accountNumber === transaction.toAccountNumber) ? ' (You)' : ''}` : ''}</TableCell>
                        <TableCell align="right">
                          <Typography
                            color={
                              transaction.type === 'Deposit' ||
                              (transaction.type === 'Transfer' && transaction.toAccountNumber === accounts[0]?.accountNumber)
                                ? 'success.main'
                                : 'error.main'
                            }
                            fontWeight="bold"
                          >
                            {(
                              transaction.type === 'Deposit' ||
                              (transaction.type === 'Transfer' && transaction.toAccountNumber === accounts[0]?.accountNumber)
                            ) ? '+' : '-'}{formatCurrency(transaction.amount)}
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
                  secondary={
                    user.lastLoginAt
                      ? `Last login: ${new Date(user.lastLoginAt).toLocaleString()}`
                      : 'No login history available'
                  }
                />
                <Button variant="outlined" onClick={handleOpenLoginHistoryDialog}>
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
          <Button onClick={handlePasswordChange} variant="contained" color="primary" sx={{ background: '#003366', color: '#FFFFFF', '&:hover': { background: '#66CCFF', color: '#003366' } }}>
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={transferDialog} onClose={() => setTransferDialog(false)}>
        <DialogTitle>Transfer Money</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="From Account"
            fullWidth
            margin="normal"
            value={fromAccountId}
            onChange={e => setFromAccountId(e.target.value)}
            disabled={accounts.length === 0}
          >
            {accounts.map(account => (
              <MenuItem key={account.id} value={account.id}>
                {account.accountNumber} (Balance: {formatCurrency(account.balance)})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="To Account Number"
            fullWidth
            margin="normal"
            value={toAccountNumber}
            onChange={e => setToAccountNumber(e.target.value)}
          />
          <TextField
            label="Amount (INR)"
            type="number"
            fullWidth
            margin="normal"
            value={transferAmount}
            onChange={e => setTransferAmount(e.target.value)}
            inputProps={{ min: 1, max: MAX_TRANSFER_AMOUNT }}
          />
          <TextField
            label="Description (Optional)"
            fullWidth
            margin="normal"
            value={transferDescription}
            onChange={e => setTransferDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferDialog(false)}>Cancel</Button>
          <Button onClick={handleTransfer} disabled={transferLoading || !fromAccountId || !toAccountNumber || !transferAmount} variant="contained" color="primary" sx={{ background: '#003366', color: '#FFFFFF', '&:hover': { background: '#66CCFF', color: '#003366' } }}>
            {transferLoading ? 'Processing...' : 'Transfer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Statement Dialog */}
      <Dialog open={statementDialog} onClose={() => setStatementDialog(false)}>
        <DialogTitle>Download Statement</DialogTitle>
        <DialogContent>
          <Typography>Do you want to download a PDF of the last 10 transactions for this account?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatementDialog(false)}>No</Button>
          <Button onClick={handleDownloadStatement} variant="contained" color="primary" sx={{ background: '#003366', color: '#FFFFFF', '&:hover': { background: '#66CCFF', color: '#003366' } }}>Yes</Button>
        </DialogActions>
      </Dialog>

      {/* Login History Dialog */}
      <Dialog open={loginHistoryDialog} onClose={handleCloseLoginHistoryDialog}>
        <DialogTitle>Login History</DialogTitle>
        <DialogContent>
          <Typography>
            {user.lastLoginAt
              ? `Your last login was on: ${new Date(user.lastLoginAt).toLocaleString()}`
              : 'No login history available.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLoginHistoryDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* About Us Section replaced with Security Measures Carousel */}
      <Box sx={{ mt: 6, mb: 0 }}>
        <Paper sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
            Online Banking Security Tips
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <Button onClick={handlePrev} aria-label="Previous security tip">&lt;</Button>
            <Box>
              <Typography variant="h2" mb={1}>{securityMeasures[carouselIndex].icon}</Typography>
              <Typography variant="h5" fontWeight={600} mb={1}>
                {securityMeasures[carouselIndex].title}
              </Typography>
              <Typography variant="body1" color="textSecondary" maxWidth={500} mx="auto">
                {securityMeasures[carouselIndex].description}
              </Typography>
            </Box>
            <Button onClick={handleNext} aria-label="Next security tip">&gt;</Button>
          </Box>
          <Box mt={2}>
            {securityMeasures.map((_, idx) => (
              <span key={idx} style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: idx === carouselIndex ? '#003366' : '#C0C0C0',
                margin: '0 4px'
              }} />
            ))}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CustomerDashboard; 
