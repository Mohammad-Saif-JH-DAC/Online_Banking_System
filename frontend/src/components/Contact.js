import React, { useState } from "react";
import { Container, Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "name") {
      const nameRegex = /^[A-Za-z\s\-']+$/;
      if (!nameRegex.test(value) && value !== "") {
        setNameError("Name can only contain letters, spaces, hyphens, and apostrophes");
      } else {
        setNameError("");
      }
    }
    
    if (name === "phone") {
      const phoneRegex = /^[789]\d{9}$/;
      if (!phoneRegex.test(value)) {
        setPhoneError("Please enter a valid 10-digit number starting with 7, 8 or 9.");
      } else {
        setPhoneError("");
      }
    }
    if (name === "message") {
      if (value.length < 20) {
        setMessageError("Message must be at least 20 characters long.");
      } else if (value.length > 500) {
        setMessageError("Message must not exceed 500 characters.");
      } else {
        setMessageError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneError || messageError || nameError) return;
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const response = await axios.post("/api/contact", formData);
      if (response.status === 200) {
        setSuccessMessage("Thank you for contacting us! Our support team will reach out soon.");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      }
    } catch (error) {
      setErrorMessage("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Contact Online Banking Support</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>How can we help you? Please fill out the form below and our team will get back to you.</Typography>
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField 
            label="Full Name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            fullWidth 
            required 
            margin="normal" 
            error={!!nameError}
            helperText={nameError}
          />
          <TextField label="Email Address" name="email" value={formData.email} onChange={handleChange} fullWidth required margin="normal" type="email" />
          <TextField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} fullWidth required margin="normal" error={!!phoneError} helperText={phoneError} />
          <TextField label="Subject" name="subject" value={formData.subject} onChange={handleChange} fullWidth required margin="normal" />
          <TextField label="Message" name="message" value={formData.message} onChange={handleChange} fullWidth required margin="normal" multiline rows={4} error={!!messageError} helperText={messageError} />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </Box>
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Our Location</Typography>
          <Box sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
            <iframe
              title="Bank Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.8597825275283!2d73.05167127469294!3d19.025899382168355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c24cce39457b%3A0x8bd69eab297890b0!2sCentre%20for%20Development%20of%20Advanced%20Computing%20(CDAC)!5e0!3m2!1sen!2sin!4v1749019666175!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Contact;