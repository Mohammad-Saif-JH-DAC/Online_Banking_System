import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import UserDetails from '../components/UserDetails';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeUsers, setActiveUsers] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const navigate = useNavigate();

  console.log('Rendering AdminDashboard');
  console.log('AdminDashboard user:', user);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoints
        const usersRes = await axios.get('/api/admin/users');
        setUsers(usersRes.data.users);
        setActiveUsers(usersRes.data.activeCustomers);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Fetch contact messages for admin
    const fetchContacts = async () => {
      setContactsLoading(true);
      try {
        const res = await axios.get('/api/contact');
        setContacts(res.data);
      } catch (err) {
        // handle error
      } finally {
        setContactsLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleViewDetails = (user) => {
    navigate(`/admin/users/${user.id}`);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedUser(null);
  };

  if (!user || user.role !== 'Admin') {
    return <div>Access denied. You are not an admin.</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">Admin Dashboard</Typography>
      </Box>
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f3e5f5 0%, #ba68c8 100%)', color: '#4a148c' }} elevation={3}>
        <Typography variant="h6" color="primary">Active Customers</Typography>
        <Typography variant="h2">{loading ? <CircularProgress size={32} /> : activeUsers}</Typography>
      </Paper>
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f3e5f5 0%, #ba68c8 100%)', color: 'primary.main' }} elevation={3}>
        <Typography variant="h6" color="primary">Users</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Account Number</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.filter(user => user.role !== 'Admin').map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.accountNumber}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" sx={{ background: 'linear-gradient(135deg, #8e24aa 0%, #ba68c8 100%)', color: 'white' }} onClick={() => handleViewDetails(user)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* Contact Us Information Section */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e1bee7 0%, #ce93d8 100%)', color: 'primary.main' }} elevation={3}>
        <Typography variant="h6" color="primary">Contact Us Submissions</Typography>
        {contactsLoading ? (
          <CircularProgress size={32} />
        ) : contacts.length === 0 ? (
          <Typography>No contact submissions found.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{contact.subject}</TableCell>
                    <TableCell>{contact.message}</TableCell>
                    <TableCell>{contact.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default AdminDashboard; 