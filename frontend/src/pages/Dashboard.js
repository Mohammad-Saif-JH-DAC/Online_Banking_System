import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  MenuItem,
  Avatar,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  AccountBalance,
  Payment,
  Receipt,
  PersonAdd,
  Delete,
  ArrowUpward,
  ArrowDownward,
  CompareArrows
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

// Dummy images for cards
const dashboardImage = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1911&auto=format&fit=crop';
const transactionImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop';
const beneficiaryImage = 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { token, user } = useAuth();
  
  // State management
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [depositDialog, setDepositDialog] = useState(false);
  const [withdrawDialog, setWithdrawDialog] = useState(false);
  const [transferDialog, setTransferDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [operationLoading, setOperationLoading] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('');
  const [beneficiaryError, setBeneficiaryError] = useState('');
  const [beneficiaryLoading, setBeneficiaryLoading] = useState(false);
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState('');

  // Fetch data
  const fetchAccounts = useCallback(async () => {
    try {
      const response = await axios.get('/api/banking/accounts');
      if (response.data.length > 0) {
        fetchAccountSummary(response.data[0].id);
      }
    } catch (error) {
      setError('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
    fetchBeneficiaries();
  }, [fetchAccounts]);

  const fetchAccountSummary = async (accountId) => {
    try {
      const response = await axios.get(`/api/banking/accounts/${accountId}/summary`);
      setSelectedAccount(response.data);
    } catch (error) {
      setError('Failed to fetch account summary');
    }
  };

  const fetchBeneficiaries = async () => {
    try {
      setBeneficiaryLoading(true);
      const response = await axios.get('/api/banking/beneficiaries');
      setBeneficiaries(response.data);
    } catch (err) {
      setBeneficiaryError('Failed to load beneficiaries');
    } finally {
      setBeneficiaryLoading(false);
    }
  };

  // Beneficiary handlers
  const handleAddBeneficiary = async () => {
    setBeneficiaryError('');
    if (!beneficiaryName || !beneficiaryAccount) {
      setBeneficiaryError('Please fill all fields');
      return;
    }
    try {
      await axios.post('/api/banking/beneficiaries', {
        name: beneficiaryName,
        accountNumber: beneficiaryAccount
      });
      setBeneficiaryName('');
      setBeneficiaryAccount('');
      await fetchBeneficiaries();
      toast.success('Beneficiary added successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add beneficiary';
      setBeneficiaryError(msg);
      toast.error(msg);
    }
  };

  const handleDeleteBeneficiary = async (id) => {
    try {
      await axios.delete(`/api/banking/beneficiaries/${id}`);
      fetchBeneficiaries();
    } catch (err) {
      setBeneficiaryError('Failed to delete beneficiary');
    }
  };

  const handleSelectBeneficiary = (id) => {
    setSelectedBeneficiaryId(id);
    const ben = beneficiaries.find(b => b.id === parseInt(id));
    if (ben) setToAccountNumber(ben.accountNumber);
  };

  // Transaction handlers
  const handleDeposit = async () => {
    if (!selectedAccount || !amount) return;
    setError('');
    try {
      setOperationLoading(true);
      await axios.post('/api/banking/deposit', {
        accountId: selectedAccount.id,
        amount: parseFloat(amount),
        description: description || 'Deposit'
      });
      setDepositDialog(false);
      setAmount('');
      setDescription('');
      setError('');
      await fetchAccountSummary(selectedAccount.id);
      await fetchAccounts();
      toast.success('Deposit successful!');
    } catch (error) {
      setError(error.response?.data?.message || 'Deposit failed');
      toast.error(error.response?.data?.message || 'Deposit failed');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedAccount || !amount) return;
    setError('');
    try {
      setOperationLoading(true);
      await axios.post('/api/banking/withdraw', {
        accountId: selectedAccount.id,
        amount: parseFloat(amount),
        description: description || 'Withdrawal'
      });
      setWithdrawDialog(false);
      setAmount('');
      setDescription('');
      setError('');
      await fetchAccountSummary(selectedAccount.id);
      await fetchAccounts();
      toast.success('Withdrawal successful!');
    } catch (error) {
      setError(error.response?.data?.message || 'Withdrawal failed');
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedAccount || !amount || !toAccountNumber) return;
    setError('');
    try {
      setOperationLoading(true);
      await axios.post('/api/banking/transfer', {
        fromAccountId: selectedAccount.id,
        toAccountNumber: toAccountNumber,
        amount: parseFloat(amount),
        description: description || 'Transfer'
      });
      setTransferDialog(false);
      setAmount('');
      setDescription('');
      setToAccountNumber('');
      setError('');
      await fetchAccountSummary(selectedAccount.id);
      await fetchAccounts();
      toast.success('Transfer successful!');
    } catch (error) {
      setError(error.response?.data?.message || 'Transfer failed');
      toast.error(error.response?.data?.message || 'Transfer failed');
    } finally {
      setOperationLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      {/* Blocked User Alert */}
      {user && user.isActive === false && (
        <Alert severity="error" sx={{ 
          mb: 3, 
          fontSize: 16, 
          fontWeight: 'bold', 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          borderRadius: 2,
          boxShadow: theme.shadows[2]
        }}>
          <span role="img" aria-label="blocked" style={{ fontSize: 24, marginRight: 12 }}>⛔</span>
          Your account is currently blocked and cannot perform any transactions.
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Banking Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back, {user?.fullName || 'Customer'}
          </Typography>
        </Box>
        {selectedAccount && (
          <Chip 
            label={`Account: ${selectedAccount.accountNumber}`} 
            color="primary" 
            variant="outlined"
            icon={<AccountBalance />}
            sx={{ fontSize: 14, fontWeight: 600 }}
          />
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Account Summary Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: theme.shadows[4],
            overflow: 'hidden',
            height: '100%'
          }}>
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
              <Box sx={{ 
                width: isMobile ? '100%' : '40%',
                height: isMobile ? 200 : 'auto',
                background: `linear-gradient(rgba(30, 64, 175, 0.8), rgba(30, 64, 175, 0.8)), url(${dashboardImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                color: 'white'
              }}>
                <AccountBalance sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>Account Balance</Typography>
                {selectedAccount && (
                  <Typography variant="h3" sx={{ fontWeight: 700, mt: 1 }}>
                    {formatCurrency(selectedAccount.balance)}
                  </Typography>
                )}
              </Box>
              <Box sx={{ 
                flex: 1, 
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <Box>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      startIcon={<ArrowDownward />}
                      onClick={() => { setError(''); setDepositDialog(true); }}
                      disabled={user && user.isActive === false}
                      sx={{
                        background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                        color: 'white',
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: theme.shadows[6]
                        }
                      }}
                    >
                      Deposit
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<ArrowUpward />}
                      onClick={() => { setError(''); setWithdrawDialog(true); }}
                      disabled={user && user.isActive === false}
                      sx={{
                        background: 'linear-gradient(135deg, #f44336 0%, #c62828 100%)',
                        color: 'white',
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: theme.shadows[6]
                        }
                      }}
                    >
                      Withdraw
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<CompareArrows />}
                      onClick={() => { setError(''); setTransferDialog(true); }}
                      disabled={user && user.isActive === false}
                      sx={{
                        background: 'linear-gradient(135deg, #2196f3 0%, #1565c0 100%)',
                        color: 'white',
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: theme.shadows[6]
                        }
                      }}
                    >
                      Transfer
                    </Button>
                  </Box>
                </Box>
                {selectedAccount?.lastTransaction && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Last Transaction
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mt: 1,
                      p: 2,
                      backgroundColor: theme.palette.grey[100],
                      borderRadius: 2
                    }}>
                      {selectedAccount.lastTransaction.type === 'Deposit' ? (
                        <ArrowDownward color="success" sx={{ mr: 1 }} />
                      ) : (
                        <ArrowUpward color="error" sx={{ mr: 1 }} />
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {formatCurrency(selectedAccount.lastTransaction.amount)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedAccount.lastTransaction.description}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(selectedAccount.lastTransaction.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Recent Transactions Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: theme.shadows[4],
            height: '100%',
            background: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${transactionImage})`,
            backgroundSize: 'cover'
          }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                p: 2,
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                borderRadius: 2
              }}>
                <Receipt sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Transactions</Typography>
              </Box>
              
              {selectedAccount?.recentTransactions.length > 0 ? (
                <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  {selectedAccount.recentTransactions.map((transaction) => (
                    <Box 
                      key={transaction.id} 
                      sx={{ 
                        mb: 2, 
                        p: 2, 
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: 2,
                        borderLeft: `4px solid ${
                          transaction.type === 'Deposit' ? theme.palette.success.main : theme.palette.error.main
                        }`
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {transaction.type}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ 
                          fontWeight: 600,
                          color: transaction.type === 'Deposit' ? 'success.main' : 'error.main'
                        }}>
                          {formatCurrency(transaction.amount)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {transaction.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        {new Date(transaction.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  p: 4,
                  textAlign: 'center'
                }}>
                  <Payment sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No recent transactions found
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Beneficiaries Card */}
        <Grid item xs={12}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: theme.shadows[4],
            background: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${beneficiaryImage})`,
            backgroundSize: 'cover'
          }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                p: 2,
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                borderRadius: 2
              }}>
                <PersonAdd sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Beneficiary Management</Typography>
              </Box>

              {beneficiaryError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {beneficiaryError}
                </Alert>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                      Add New Beneficiary
                    </Typography>
                    <TextField
                      fullWidth
                      label="Beneficiary Name"
                      value={beneficiaryName}
                      onChange={e => setBeneficiaryName(e.target.value)}
                      sx={{ mb: 2 }}
                      disabled={user && user.isActive === false}
                    />
                    <TextField
                      fullWidth
                      label="Account Number"
                      value={beneficiaryAccount}
                      onChange={e => setBeneficiaryAccount(e.target.value)}
                      sx={{ mb: 2 }}
                      disabled={user && user.isActive === false}
                    />
                    <Button 
                      variant="contained" 
                      onClick={handleAddBeneficiary} 
                      disabled={beneficiaryLoading || (user && user.isActive === false)}
                      startIcon={<PersonAdd />}
                      sx={{
                        background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
                        color: 'white'
                      }}
                    >
                      Add Beneficiary
                    </Button>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                      Your Beneficiaries
                    </Typography>
                    {beneficiaryLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                      </Box>
                    ) : beneficiaries.length > 0 ? (
                      <TableContainer sx={{ maxHeight: 300 }}>
                        <Table size="small" stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell>Account Number</TableCell>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {beneficiaries.map(b => (
                              <TableRow key={b.id} hover>
                                <TableCell>{b.name}</TableCell>
                                <TableCell>{b.accountNumber}</TableCell>
                                <TableCell align="right">
                                  <IconButton 
                                    onClick={() => handleDeleteBeneficiary(b.id)} 
                                    disabled={user && user.isActive === false}
                                    color="error"
                                  >
                                    <Delete />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        p: 4,
                        textAlign: 'center'
                      }}>
                        <PersonAdd sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="body1" color="text.secondary">
                          No beneficiaries added yet
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transaction Dialogs */}
      {/* Deposit Dialog */}
      <Dialog open={depositDialog} onClose={() => setDepositDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center'
        }}>
          <ArrowDownward sx={{ mr: 1 }} />
          Deposit Funds
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Amount (INR)"
              type="number"
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <Typography variant="body1" sx={{ mr: 1 }}>₹</Typography>
                )
              }}
            />
            <TextField
              fullWidth
              label="Description (Optional)"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setDepositDialog(false)} 
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeposit} 
            disabled={operationLoading || !amount} 
            variant="contained"
            color="success"
            startIcon={operationLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
              color: 'white'
            }}
          >
            {operationLoading ? 'Processing...' : 'Deposit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialog} onClose={() => setWithdrawDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          bgcolor: 'error.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center'
        }}>
          <ArrowUpward sx={{ mr: 1 }} />
          Withdraw Funds
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Amount (INR)"
              type="number"
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <Typography variant="body1" sx={{ mr: 1 }}>₹</Typography>
                )
              }}
            />
            <TextField
              fullWidth
              label="Description (Optional)"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setWithdrawDialog(false)} 
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleWithdraw} 
            disabled={operationLoading || !amount} 
            variant="contained"
            color="error"
            startIcon={operationLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              background: 'linear-gradient(135deg, #f44336 0%, #c62828 100%)',
              color: 'white'
            }}
          >
            {operationLoading ? 'Processing...' : 'Withdraw'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={transferDialog} onClose={() => setTransferDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          bgcolor: 'info.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center'
        }}>
          <CompareArrows sx={{ mr: 1 }} />
          Transfer Funds
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <TextField
              select
              fullWidth
              label="Select Beneficiary"
              variant="outlined"
              value={selectedBeneficiaryId}
              onChange={e => handleSelectBeneficiary(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="">-- Select or enter manually --</MenuItem>
              {beneficiaries.map(b => (
                <MenuItem key={b.id} value={b.id}>
                  {b.name} ({b.accountNumber})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="To Account Number"
              variant="outlined"
              value={toAccountNumber}
              onChange={(e) => setToAccountNumber(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Amount (INR)"
              type="number"
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <Typography variant="body1" sx={{ mr: 1 }}>₹</Typography>
                )
              }}
            />
            <TextField
              fullWidth
              label="Description (Optional)"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setTransferDialog(false)} 
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleTransfer} 
            disabled={operationLoading || !amount || !toAccountNumber} 
            variant="contained"
            color="info"
            startIcon={operationLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              background: 'linear-gradient(135deg, #2196f3 0%, #1565c0 100%)',
              color: 'white'
            }}
          >
            {operationLoading ? 'Processing...' : 'Transfer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;