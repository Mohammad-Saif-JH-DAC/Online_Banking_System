import React from "react";
import { 
  Container, 
  Box, 
  Typography, 
  Grid, 
  Button, 
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import { 
  AccountBalance,
  Email,
  Phone,
  LocationOn,
  Schedule,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Security,
  Payment,
  AccountCircle,
  SupportAgent
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  const services = [
    { icon: <AccountCircle />, text: "Account Management" },
    { icon: <Payment />, text: "Fund Transfers" },
    { icon: <SupportAgent />, text: "24/7 Customer Support" },
    { icon: <Security />, text: "Secure Transactions" }
  ];

  const contactInfo = [
    { icon: <LocationOn />, text: "123 Bank Avenue, FinCity, 456789" },
    { icon: <Phone />, text: "1-800-BANK-HELP" },
    { icon: <Email />, text: "support@onlinebank.com" },
    { icon: <Schedule />, text: "Mon-Fri: 9AM-6PM" }
  ];

  const socialLinks = [
    { icon: <Facebook />, url: "https://facebook.com" },
    { icon: <Twitter />, url: "https://x.com/MeanderingNinja" },
    { icon: <LinkedIn />, url: "https://www.linkedin.com/in/mohammadsaif25" },
    { icon: <Instagram />, url: "https://www.instagram.com/precocious_warrior" }
  ];

  return (
    <Box 
      component="footer" 
      sx={{ 
        background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)', 
        color: 'white', 
        pt: 8, 
        pb: 4,
        borderTop: '1px solid rgba(255, 255, 255, 0.12)'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" mb={3}>
              <AccountBalance sx={{ 
                fontSize: 40, 
                mr: 2,
                color: 'white'
              }} />
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color: 'white'
                }}
              >
                Online Banking
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Secure, convenient, and modern banking for everyone. Manage your accounts, transfer funds, and more—all in one place.
            </Typography>
            <Box display="flex" gap={2}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Services Column */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                color: 'white'
              }}
            >
              Our Services
            </Typography>
            <List dense disablePadding>
              {services.map((service, index) => (
                <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: 'white' }}>
                    {service.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={service.text} 
                    primaryTypographyProps={{ 
                      variant: 'body1',
                      sx: { opacity: 0.9 }
                    }} 
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Contact Column */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                color: 'white'
              }}
            >
              Contact Us
            </Typography>
            <List dense disablePadding>
              {contactInfo.map((info, index) => (
                <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: 'white' }}>
                    {info.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={info.text} 
                    primaryTypographyProps={{ 
                      variant: 'body1',
                      sx: { opacity: 0.9 }
                    }} 
                  />
                </ListItem>
              ))}
            </List>
            <Button 
              component={RouterLink} 
              to="/contact" 
              variant="contained" 
              color="secondary"
              sx={{ 
                mt: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              Contact Form
            </Button>
          </Grid>
        </Grid>

        {/* Divider and Copyright */}
        <Divider sx={{ 
          borderColor: 'rgba(255, 255, 255, 0.12)', 
          my: 4 
        }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.8,
                color: 'white'
              }}
            >
              © {currentYear} Online Banking System. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="flex-end" gap={3}>
              <Link 
                component={RouterLink} 
                to="/privacy" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.8 }}
              >
                Privacy Policy
              </Link>
              <Link 
                component={RouterLink} 
                to="/terms" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.8 }}
              >
                Terms of Service
              </Link>
              <Link 
                component={RouterLink} 
                to="/security" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.8 }}
              >
                Security
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 2,
            textAlign: 'center',
            fontStyle: 'italic',
            opacity: 0.7,
            color: 'white'
          }}
        >
          Empowering your financial future
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;