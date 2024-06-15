import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Button,
} from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const AppliedListings = ({ schoolUID, open, handleClose }) => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Query applications collection where schoolUID matches
        const q = query(collection(db, 'applications'), where('schoolUID', '==', schoolUID));
        const querySnapshot = await getDocs(q);
        const fetchedApplications = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApplications(fetchedApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, [schoolUID]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="applied-listings-modal"
      aria-describedby="applied-listings-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h5" gutterBottom>Applied Listings</Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="applied listings table">
            <TableHead>
              <TableRow>
                <TableCell>Volunteer Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Subjects Applied</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.volunteerName}</TableCell>
                  <TableCell>{application.volunteerEmail}</TableCell>
                  <TableCell>{application.subjects.join(', ')}</TableCell>
                  <TableCell>{application.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained" onClick={handleClose} sx={{ mt: 2 }}>Close</Button>
      </Box>
    </Modal>
  );
};

export default AppliedListings;
