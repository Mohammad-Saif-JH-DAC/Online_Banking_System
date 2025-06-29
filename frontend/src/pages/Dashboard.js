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
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  SwapHoriz,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { token } = useAuth();
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
  }, [fetchAccounts]);

  const fetchAccountSummary = async (accountId) => {
    try {
      const response = await axios.get(`/api/banking/accounts/${accountId}/summary`);
      setSelectedAccount(response.data);
    } catch (error) {
      setError('Failed to fetch account summary');
    }
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Account Summary */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Account Summary
            </Typography>
            {selectedAccount && (
              <Box>
                <Typography variant="h4" gutterBottom>
                  ${selectedAccount.balance.toFixed(2)}
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
                    sx={{ mr: 1 }}
                  >
                    Deposit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<TrendingDown />}
                    onClick={openWithdrawDialog}
                    sx={{ mr: 1 }}
                  >
                    Withdraw
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<SwapHoriz />}
                    onClick={openTransferDialog}
                  >
                    Transfer
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Recent Transactions
            </Typography>
            {selectedAccount?.recentTransactions.map((transaction) => (
              <Box key={transaction.id} sx={{ mb: 2, p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  {transaction.type}
                </Typography>
                <Typography variant="h6">
                  ${transaction.amount.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Deposit Dialog */}
      <Dialog open={depositDialog} onClose={() => setDepositDialog(false)}>
        <DialogTitle>Deposit Money</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description (Optional)"
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDepositDialog(false)}>Cancel</Button>
          <Button onClick={handleDeposit} disabled={operationLoading || !amount}>
            {operationLoading ? 'Processing...' : 'Deposit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialog} onClose={() => setWithdrawDialog(false)}>
        <DialogTitle>Withdraw Money</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description (Optional)"
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawDialog(false)}>Cancel</Button>
          <Button onClick={handleWithdraw} disabled={operationLoading || !amount}>
            {operationLoading ? 'Processing...' : 'Withdraw'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={transferDialog} onClose={() => setTransferDialog(false)}>
        <DialogTitle>Transfer Money</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="To Account Number"
            fullWidth
            variant="outlined"
            value={toAccountNumber}
            onChange={(e) => setToAccountNumber(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description (Optional)"
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferDialog(false)}>Cancel</Button>
          <Button onClick={handleTransfer} disabled={operationLoading || !amount || !toAccountNumber}>
            {operationLoading ? 'Processing...' : 'Transfer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 
