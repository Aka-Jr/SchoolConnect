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
  Link,
} from '@mui/material';
import { collection, query, where, getDocs, updateDoc, doc, addDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';

const AppliedListings = ({ open, handleClose }) => {
  const [applications, setApplications] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [actionTaken, setActionTaken] = useState(null); // State to track the action taken (accept/reject)

  useEffect(() => {
    const fetchApplications = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('No user is currently logged in.');
        return;
      }

      try {
        console.log(`Fetching applications for schoolUID: ${currentUser.uid}`);
        const q = query(collection(db, 'applications'), where('schoolUID', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const fetchedApplications = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched applications:', fetchedApplications);
        setApplications(fetchedApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    const fetchVolunteers = async () => {
      try {
        const volunteersCollection = collection(db, 'users');
        const volunteersSnapshot = await getDocs(volunteersCollection);
        const volunteersData = volunteersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          subjects: Array.isArray(doc.data().subjects) ? doc.data().subjects : [],
          // Assuming certificates are stored as URLs in an array field called certificateURLs
          certificateURLs: Array.isArray(doc.data().certificateURLs) ? doc.data().certificateURLs : []
        }));
        setVolunteers(volunteersData);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      }
    };

    if (open) {
      fetchApplications();
      fetchVolunteers();
    }
  }, [open]);

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      const applicationRef = doc(db, 'applications', applicationId);
      const applicationSnapshot = await getDoc(applicationRef);
      const applicationData = applicationSnapshot.data();
      const volunteerId = applicationData.volunteerUID;
      const schoolId = applicationData.schoolUID;
      

      // Update application status
      await updateDoc(applicationRef, { status });

      // Notify volunteer
      const volunteer = volunteers.find(v => v.uid === volunteerId);
      const notificationMessage = status === 'accepted'
        ? `Congratulations ${volunteer.firstname}, your application for ${applicationData.schoolName} has been accepted.`
        : `Dear ${volunteer.firstname}, we regret to inform you that your application for ${applicationData.schoolName} has been rejected.`;

      const notificationData = {
        createdAt: new Date(),
        volunteerId,
        schoolId,
        message: notificationMessage,
      };

      // Store notification in Firestore
      await addDoc(collection(db, 'notifications'), notificationData);

      // Update local state
      setApplications(applications.map(app => app.id === applicationId ? { ...app, status } : app));
      toast.success(`Application ${status}`);
      setActionTaken(status); // Update action taken state
    } catch (error) {
      console.error(`Error updating application status to ${status}:`, error);
      toast.error(`Failed to update application status: ${error.message}`);
    }
  };

  const handleVolunteerClick = (application) => {
    // Find the volunteer details from the volunteers list based on application.volunteerUID
    const volunteer = volunteers.find(v => v.uid === application.volunteerUID);
    setSelectedVolunteer(volunteer);
  };

  const handleCloseVolunteerModal = () => {
    setSelectedVolunteer(null);
    setActionTaken(null); // Reset action taken state when modal is closed
  };

  const handleDownloadCertificate = (certificateURL) => {
    // Function to download certificates using the certificateURL
    window.open(certificateURL, '_blank');
  };

  return (
    <>
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
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5" gutterBottom>Applied Listings</Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 750, overflowX: 'auto' }} aria-label="applied listings table">
              <TableHead>
                <TableRow>
                  <TableCell>Volunteer Name</TableCell>
                  {/* <TableCell>Email</TableCell> */}
                  <TableCell>Subjects Applied</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <Button onClick={() => handleVolunteerClick(application)}>
                        {application.volunteerName}
                      </Button>
                    </TableCell>
                    {/* <TableCell>{application.volunteerEmail}</TableCell> */}
                    <TableCell>{application.subjects.join(', ')}</TableCell>
                    <TableCell sx={{ color: application.status === 'rejected' ? 'red' : application.status === 'accepted' ? 'green' : 'inherit' }}>
                      {application.status}
                    </TableCell>
                    <TableCell>
                      {application.status === 'pending' ? (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleUpdateStatus(application.id, 'accepted')}
                            disabled={actionTaken === 'rejected'}
                            sx={{ marginRight: 1, opacity: actionTaken === 'rejected' ? 0.6 : 1 }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleUpdateStatus(application.id, 'rejected')}
                            disabled={actionTaken === 'accepted'}
                            sx={{ opacity: actionTaken === 'accepted' ? 0.6 : 1 }}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="contained"
                          color={application.status === 'accepted' ? 'error' : 'success'}
                          onClick={() =>
                            handleUpdateStatus(application.id, application.status === 'accepted' ? 'rejected' : 'accepted')
                          }
                        >
                          {application.status === 'accepted' ? 'Reject' : 'Accept'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" onClick={handleClose} sx={{ mt: 2 }}>Close</Button>
          <ToastContainer />
        </Box>
      </Modal>

      <Modal
        open={!!selectedVolunteer}
        onClose={handleCloseVolunteerModal}
        aria-labelledby="volunteer-details-modal"
        aria-describedby="volunteer-details-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxHeight: '80vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedVolunteer && (
            <>
              <Typography variant="h5" gutterBottom>
                Volunteer Details: {selectedVolunteer.firstname} {selectedVolunteer.surname}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Email:</strong> {selectedVolunteer.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Age:</strong> {selectedVolunteer.age}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Marital Status:</strong> {selectedVolunteer.maritalStatus}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Employment:</strong> {selectedVolunteer.employmentStatus}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Subjects Capable of Teaching:</strong> {selectedVolunteer.subjects.join(', ')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Certificate:</strong> 
                <Box sx={{ mt: 1 }}>
                  <Link href="#" onClick={() => handleDownloadCertificate(selectedVolunteer.certificateURL)}>
                    View Certificate
                  </Link>
                </Box>
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Phone Number:</strong> {selectedVolunteer.phoneNumber}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Region:</strong> {selectedVolunteer.region}
              </Typography>
              <Button variant="contained" onClick={handleCloseVolunteerModal} sx={{ mt: 2 }}>Close</Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default AppliedListings;
