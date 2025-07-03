import React from "react";
import { Container, Box, Typography, Grid, Card, Avatar, Chip, Button } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const teamMembers = [
  {
    name: "Khushi Nikhare",
    role: "Backend Developer",
    bio: "Specializes in secure banking APIs, database design, and robust backend systems for financial applications.",
    skills: [".NET Core", "C#", "MySQL", "REST APIs", "Security", "Git"],
    image: "/Khushi Nikhare.jpg",
  },
  {
    name: "Mohammad Saif",
    role: "Full Stack Developer",
    bio: "Builds scalable banking platforms with modern UI/UX and secure integrations. Focused on seamless customer experience.",
    skills: ["React", ".NET", "RESTful APIs", "MySQL", "JavaScript", "UI/UX"],
    image: "/Mohammad Saif.jpg",
  },
  {
    name: "Chaitanya Shyamkuwar",
    role: "Frontend Developer",
    bio: "Designs intuitive, accessible interfaces for online banking customers, ensuring clarity and trust in every interaction.",
    skills: ["React", "JavaScript", "Material-UI", "Responsive Design", "API Integration"],
    image: "/images/Sumayya.jpg",
  },
];

function About() {
  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container>
        {/* Header Section */}
        <Box textAlign="center" mb={6}>
          <AccountBalanceIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
            About Online Banking System
          </Typography>
          <Typography variant="h6" color="textSecondary" maxWidth={700} mx="auto">
            Our mission is to empower customers with secure, convenient, and modern digital banking solutions. We believe in transparency, innovation, and customer-first service.
          </Typography>
        </Box>

        {/* Team Section */}
        <Box mb={8}>
          <Typography variant="h4" fontWeight={600} textAlign="center" mb={4}>
            Meet the Team
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3, textAlign: 'center', height: '100%' }}>
                  <Avatar src={member.image} alt={member.name} sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }} />
                  <Typography variant="h6" fontWeight={700}>{member.name}</Typography>
                  <Typography variant="subtitle1" color="primary" fontWeight={600} mb={1}>{member.role}</Typography>
                  <Typography variant="body2" color="textSecondary" mb={2}>{member.bio}</Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
                    {member.skills.map((skill, i) => (
                      <Chip key={i} label={skill} color="primary" variant="outlined" size="small" />
                    ))}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Values Section */}
        <Box mb={8}>
          <Card sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(135deg, #f3e5f5 0%, #ba68c8 100%)', color: '#4a148c', boxShadow: 6 }}>
            <Typography variant="h4" fontWeight={700} textAlign="center" mb={4}>
              Our Values
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4} textAlign="center">
                <Typography variant="h2" mb={1}>🔒</Typography>
                <Typography variant="h6" fontWeight={600} mb={1}>Security First</Typography>
                <Typography variant="body2">We prioritize the safety and privacy of our customers' financial data above all else.</Typography>
              </Grid>
              <Grid item xs={12} md={4} textAlign="center">
                <Typography variant="h2" mb={1}>🤝</Typography>
                <Typography variant="h6" fontWeight={600} mb={1}>Customer Focus</Typography>
                <Typography variant="body2">Our platform is designed to make banking easy, accessible, and reliable for everyone.</Typography>
              </Grid>
              <Grid item xs={12} md={4} textAlign="center">
                <Typography variant="h2" mb={1}>💡</Typography>
                <Typography variant="h6" fontWeight={600} mb={1}>Innovation</Typography>
                <Typography variant="body2">We embrace new technologies to deliver the best digital banking experience possible.</Typography>
              </Grid>
            </Grid>
          </Card>
        </Box>

        {/* Call to Action */}
        <Box textAlign="center" mt={6}>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Have questions about Online Banking System?
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={3}>
            Our team is here to help you with any queries or support you need.
          </Typography>
          <Button variant="contained" color="primary" size="large" href="/contact" sx={{ background: 'linear-gradient(135deg, #8e24aa 0%, #ba68c8 100%)', color: 'white' }}>
            Contact Us
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default About; 