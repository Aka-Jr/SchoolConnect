import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
} from '@mui/material';
import { Alert } from '@mui/material';

const RequestedVolunteers = ({ open, handleClose, schoolId }) => {
  const [requests, setRequests] = useState([]);
  const [volunteers, setVolunteers] = useState({});
  const [expandedCertificate, setExpandedCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'requests'), where('schoolId', '==', schoolId));
        const querySnapshot = await getDocs(q);
        const requestsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const volunteersData = {};
        for (const request of requestsData) {
          if (!volunteersData[request.volunteerId]) {
            const volunteerDoc = await getDoc(doc(db, 'users', request.volunteerId));
            volunteersData[request.volunteerId] = volunteerDoc.exists() ? volunteerDoc.data() : null;
          }
        }

        setRequests(requestsData);
        setVolunteers(volunteersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setError('Failed to fetch requests.');
        setLoading(false);
      }
    };

    if (open && schoolId) {
      fetchRequests();
    }
  }, [open, schoolId]);

  const toggleCertificateView = (volunteerId) => {
    setExpandedCertificate(expandedCertificate === volunteerId ? null : volunteerId);
  };

  const downloadCertificate = (certificateURL) => {
    try {
      setLoading(true);
      const a = document.createElement('a');
      a.href = certificateURL;
      a.download = 'certificate.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setLoading(false);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      setError('Failed to download certificate.');
      setLoading(false);
      setSnackbarMessage('Failed to download certificate.');
      setSnackbarOpen(true);
    }
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return '#4CAF50'; // green
      case 'rejected':
        return '#F44336'; // red
      case 'pending':
        return '#FFC107'; // yellow
      default:
        return '#000000'; // default black
    }
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const filteredRequests = requests.filter((request) =>
    statusFilter === 'all' ? true : request.status === statusFilter
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box sx={{ width: 1000, maxHeight: '90vh', overflowY: 'auto', bgcolor: 'background.paper', borderRadius: 2, p: 4 }}>
        <Typography variant="h6" component="h2" id="modal-modal-title">
          Requested Volunteers
        </Typography>
        <FormControl sx={{ mb: 2, left: '90%', white: 'auto' }}>
          <InputLabel id="status-filter-label">Filter by Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Filter by Status"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </FormControl>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Volunteer</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Subjects</TableCell>
                <TableCell>Region</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Profile</TableCell>
                <TableCell>Certificate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.map((request, index) => (
                <TableRow key={request.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{`${volunteers[request.volunteerId]?.firstname} ${volunteers[request.volunteerId]?.surname}`}</TableCell>
                  <TableCell>{volunteers[request.volunteerId]?.gender}</TableCell>
                  <TableCell>{volunteers[request.volunteerId]?.email}</TableCell>
                  <TableCell>{volunteers[request.volunteerId]?.phoneNumber}</TableCell>
                  <TableCell>{request.subjects.join(', ')}</TableCell>
                  <TableCell>{volunteers[request.volunteerId]?.region}</TableCell>
                  <TableCell>
                    <div style={{ color: getStatusColor(request.status) }}>{request.status}</div>
                  </TableCell>
                  <TableCell>
                    {volunteers[request.volunteerId]?.photoURL && (
                      <img
                        src={volunteers[request.volunteerId]?.photoURL}
                        alt="Volunteer Profile"
                        style={{ maxWidth: 100, maxHeight: 100 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {volunteers[request.volunteerId]?.certificateURL && (
                      <Button
                        variant="outlined"
                        onClick={() => downloadCertificate(volunteers[request.volunteerId]?.certificateURL)}
                        disabled={loading}
                      >
                        {loading ? 'Downloading...' : 'Download Certificate'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
          <Alert severity="error" onClose={closeSnackbar}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default RequestedVolunteers;
