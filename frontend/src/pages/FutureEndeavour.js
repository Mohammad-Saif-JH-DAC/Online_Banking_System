import React from 'react';
import { 
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  AccountBalance,
  MobileFriendly,
  Fingerprint,
  Language,
  Savings,
  CreditScore,
  TrendingUp
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const FutureEndeavour = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      title: "Mobile Banking App",
      description: "Launching our dedicated mobile banking app with biometric login and personalized financial insights.",
      icon: <MobileFriendly sx={{ fontSize: 50 }} color="primary" />,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Enhanced Security",
      description: "Implementing advanced AI-based fraud detection and blockchain security protocols for all transactions.",
      icon: <Fingerprint sx={{ fontSize: 50 }} color="primary" />,
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Global Banking",
      description: "Expanding our services to support multi-currency accounts and international money transfers.",
      icon: <Language sx={{ fontSize: 50 }} color="primary" />,
      image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?q=80&w=2073&auto=format&fit=crop"
    },
    {
      title: "Wealth Management",
      description: "Introducing automated investment portfolios and personalized wealth management services.",
      icon: <Savings sx={{ fontSize: 50 }} color="primary" />,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1911&auto=format&fit=crop"
    },
    {
      title: "Credit Solutions",
      description: "Developing instant credit approval system with dynamic credit scoring algorithms.",
      icon: <CreditScore sx={{ fontSize: 50 }} color="primary" />,
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop"
    },
    {
      title: "Financial Analytics",
      description: "Building comprehensive financial dashboards with predictive analytics and spending patterns.",
      icon: <TrendingUp sx={{ fontSize: 50 }} color="primary" />,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
    }
  ];

  return (
    <Box 
      sx={{ 
        py: 10,
        background: theme.palette.background.default,
        position: 'relative',
        overflow: 'hidden'
      }}
      id="future-endeavours"
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Our Future Roadmap
          </Typography>
          <Typography 
            variant="h6" 
            component="p" 
            sx={{ 
              maxWidth: 700,
              mx: 'auto',
              color: theme.palette.text.secondary
            }}
          >
            We're constantly innovating to bring you the best banking experience. Here's what we're working on next.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: theme.shadows[4],
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={feature.image}
                  alt={feature.title}
                  sx={{
                    objectFit: 'cover',
                    filter: 'brightness(0.9)',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="h3"
                    sx={{ 
                      fontWeight: 600,
                      textAlign: 'center',
                      mb: 2
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ 
                      textAlign: 'center',
                      mb: 2
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" mt={6}>
          <Button
            component={RouterLink}
            to="/about"
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
              color: 'white',
              px: 5,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              fontSize: '1.1rem',
              boxShadow: theme.shadows[4],
              '&:hover': {
                boxShadow: theme.shadows[8],
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Learn More About Our Plans
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FutureEndeavour;