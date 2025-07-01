import React from "react";
import { Container, Box, Typography, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <Box component="footer" sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white', pt: 6, pb: 3, mt: 8 }}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box mb={2} display="flex" alignItems="center">
              <AccountBalanceIcon sx={{ fontSize: 32, mr: 1 }} />
              <Typography variant="h6" component="div">Online Banking System</Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Secure, convenient, and modern banking for everyone. Manage your accounts, transfer funds, and more—all in one place.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>Our Services</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Account Management</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Fund Transfers</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>24/7 Customer Support</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Secure Transactions</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>Contact Us</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>123 Bank Avenue, FinCity, 456789</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>1-800-BANK-HELP</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>support@onlinebank.com</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Mon-Fri: 9AM-6PM</Typography>
            <Button component={Link} to="/contact" variant="contained" color="secondary" sx={{ mt: 2 }}>
              Contact Us
            </Button>
          </Grid>
        </Grid>
        <Box mt={4} borderTop="1px solid rgba(255,255,255,0.2)" pt={2} display="flex" justifyContent="space-between" flexWrap="wrap">
          <Typography variant="body2" sx={{ opacity: 0.7 }}>© {currentYear} Online Banking System. All rights reserved.</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>Empowering your financial future</Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer; 