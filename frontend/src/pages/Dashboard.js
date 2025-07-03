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
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  SwapHoriz,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};

const Dashboard = () => {
  const { token, user } = useAuth();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dialog states
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
      console.log('Fetched beneficiaries:', response.data);
    } catch (err) {
      setBeneficiaryError('Failed to load beneficiaries');
    } finally {
      setBeneficiaryLoading(false);
    }
  };

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

  const handleDeposit = async () => {
    if (!selectedAccount || !amount) return;
    setError('');
    try {
      setOperationLoading(true);
      const response = await axios.post('/api/banking/deposit', {
        accountId: selectedAccount.id,
        amount: parseFloat(amount),
        description: description || 'Deposit'
      });
      console.log('Deposit response:', response);
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
      const response = await axios.post('/api/banking/withdraw', {
        accountId: selectedAccount.id,
        amount: parseFloat(amount),
        description: description || 'Withdrawal'
      });
      console.log('Withdraw response:', response);
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

  // Clear error when opening dialogs
  const openDepositDialog = () => { setError(''); setDepositDialog(true); };
  const openWithdrawDialog = () => { setError(''); setWithdrawDialog(true); };
  const openTransferDialog = () => { setError(''); setTransferDialog(true); };

  useEffect(() => {
    if (!beneficiaryName && !beneficiaryAccount) {
      setBeneficiaryError('');
    }
  }, [beneficiaryName, beneficiaryAccount]);

  console.log('Selected account:', selectedAccount);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  console.log('Deposit dialog open:', depositDialog, 'Withdraw dialog open:', withdrawDialog);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {user && user.isActive === false && (
        <Alert severity="error" sx={{ mb: 3, fontSize: 20, fontWeight: 'bold', p: 3, display: 'flex', alignItems: 'center' }} icon={false}>
          <span role="img" aria-label="blocked" style={{ fontSize: 32, marginRight: 16 }}>⛔</span>
          You are blocked by the admin and cannot perform any transactions or account changes.
        </Alert>
      )}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">Dashboard</Typography>
        <Typography variant="subtitle1" color="textSecondary">Welcome! Manage your accounts, beneficiaries, and transactions.</Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f3e5f5 0%, #ba68c8 100%)', color: '#4a148c' }} elevation={3}>
            <Typography variant="h6" gutterBottom color="primary">Account Summary</Typography>
            {selectedAccount && (
              <Box>
                <Typography variant="h4" gutterBottom>
                  {formatCurrency(selectedAccount.balance)}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Account: {selectedAccount.accountNumber}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<TrendingUp />}
                    onClick={openDepositDialog}
                    sx={{ mr: 1, background: 'linear-gradient(135deg, #8e24aa 0%, #ba68c8 100%)', color: 'white' }}
                    disabled={user && user.isActive === false}
                  >
                    Deposit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<TrendingDown />}
                    onClick={openWithdrawDialog}
                    sx={{ mr: 1, background: 'linear-gradient(135deg, #8e24aa 0%, #ba68c8 100%)', color: 'white' }}
                    disabled={user && user.isActive === false}
                  >
                    Withdraw
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<SwapHoriz />}
                    onClick={openTransferDialog}
                    disabled={user && user.isActive === false}
                  >
                    Transfer
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
          <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
            <Typography variant="h6" gutterBottom color="primary">Recent Transactions</Typography>
            {selectedAccount?.recentTransactions.map((transaction) => (
              <Box key={transaction.id} sx={{ mb: 2, p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  {transaction.type}
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(transaction.amount)}
                </Typography>
                {transaction.type === 'Transfer' && transaction.fromAccountNumber && (
                  <Typography variant="body2" color="textSecondary">
                    From Account: {transaction.fromAccountNumber}
                  </Typography>
                )}
                <Typography variant="caption" color="textSecondary">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
            <Typography variant="h6" gutterBottom color="primary">Beneficiaries</Typography>
            {beneficiaryError && <Alert severity="error">{beneficiaryError}</Alert>}
            {beneficiaryLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    label="Name"
                    value={beneficiaryName}
                    onChange={e => setBeneficiaryName(e.target.value)}
                    size="small"
                    disabled={user && user.isActive === false}
                  />
                  <TextField
                    label="Account Number"
                    value={beneficiaryAccount}
                    onChange={e => setBeneficiaryAccount(e.target.value)}
                    size="small"
                    disabled={user && user.isActive === false}
                  />
                  <Button variant="contained" onClick={handleAddBeneficiary} disabled={beneficiaryLoading || (user && user.isActive === false)}>
                    Add
                  </Button>
                </Box>
                {console.log('Rendering beneficiaries:', beneficiaries)}
                <TableContainer component={Paper} sx={{ maxHeight: 250 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Account Number</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {beneficiaries.map(b => (
                        <TableRow key={b.id}>
                          <TableCell>{b.name}</TableCell>
                          <TableCell>{b.accountNumber}</TableCell>
                          <TableCell>
                            <Button color="error" size="small" onClick={() => handleDeleteBeneficiary(b.id)} disabled={user && user.isActive === false}>
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
      {/* Deposit Dialog */}
      <Dialog open={depositDialog} onClose={() => setDepositDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Deposit Money</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              margin="dense"
              label="Amount (INR)"
              type="number"
              fullWidth
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description (Optional)"
              fullWidth
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDepositDialog(false)}>Cancel</Button>
          <Button onClick={handleDeposit} disabled={operationLoading || !amount} variant="contained">
            {operationLoading ? 'Processing...' : 'Deposit'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialog} onClose={() => setWithdrawDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'secondary.main', color: 'white' }}>Withdraw Money</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              margin="dense"
              label="Amount (INR)"
              type="number"
              fullWidth
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description (Optional)"
              fullWidth
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawDialog(false)}>Cancel</Button>
          <Button onClick={handleWithdraw} disabled={operationLoading || !amount} variant="contained" color="secondary">
            {operationLoading ? 'Processing...' : 'Withdraw'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Transfer Dialog */}
      <Dialog open={transferDialog} onClose={() => setTransferDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Transfer Money</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              select
              label="Select Beneficiary (optional)"
              fullWidth
              margin="normal"
              value={selectedBeneficiaryId}
              onChange={e => handleSelectBeneficiary(e.target.value)}
            >
              <MenuItem value="">-- None --</MenuItem>
              {beneficiaries.map(b => (
                <MenuItem key={b.id} value={b.id}>{b.name} ({b.accountNumber})</MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="To Account Number"
              fullWidth
              variant="outlined"
              value={toAccountNumber}
              onChange={(e) => setToAccountNumber(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Amount (INR)"
              type="number"
              fullWidth
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description (Optional)"
              fullWidth
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferDialog(false)}>Cancel</Button>
          <Button onClick={handleTransfer} disabled={operationLoading || !amount || !toAccountNumber} variant="contained">
            {operationLoading ? 'Processing...' : 'Transfer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 
