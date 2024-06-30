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
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [selectedAction, setSelectedAction] = useState('');
  const [unavailableOpen, setUnavailableOpen] = useState(false);
  const [unavailableMessage, setUnavailableMessage] = useState('');

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
      setConfirmationOpen(false); // Close confirmation dialog
      setSelectedApplicationId(null);
      setSelectedAction('');
  
      const applicationRef = doc(db, 'applications', applicationId);
      const applicationSnapshot = await getDoc(applicationRef);
      const applicationData = applicationSnapshot.data();
      const volunteerId = applicationData.volunteerUID;
      const schoolId = applicationData.schoolUID;
  
      const volunteerRef = doc(db, 'users', volunteerId);
      const volunteerSnapshot = await getDoc(volunteerRef);
      const volunteerData = volunteerSnapshot.data();
  
      // Check if the volunteer can be accepted
      if (status.toLowerCase() === 'accepted' && volunteerData.availabilityStatus !== 'available') {
        // Notify the volunteer about their current status
        const notificationMessage = `Dear ${volunteerData.firstname}, we regret to inform you that we cannot proceed with your application at this time, as you have already been accepted for a volunteering opportunity at another school. We encourage you to complete your current commitment and hope you will consider applying for future opportunities with us.`;
        const schoolNotificationMessage = `Volunteer ${volunteerData.firstname} ${volunteerData.surname} cannot be accepted as they are already committed to another volunteering opportunity.`;
        const notificationData = {
          createdAt: new Date(),
          type: 'application',
          volunteerId,
          schoolId,
          message: notificationMessage,
        };
  
        await addDoc(collection(db, 'notifications'), notificationData);
  
        // Display modal or notification to the user
        setUnavailableMessage(schoolNotificationMessage);
        setUnavailableOpen(true);
  
        return;
      }
  
      // Update application status
      await updateDoc(applicationRef, { status });
  
      // Update volunteer availability if accepted
      if (status.toLowerCase() === 'accepted') {
        await updateDoc(volunteerRef, { availabilityStatus: 'unavailable' });
      }
  
      // Create notification for volunteer based on status
      const notificationMessage = status.toLowerCase() === 'accepted'
        ? `Congratulations ${volunteerData.firstname}, your application for ${applicationData.schoolName} has been accepted.`
        : `Dear ${volunteerData.firstname}, we regret to inform you that your application for ${applicationData.schoolName} has been rejected.`;
  
      const notificationData = {
        createdAt: new Date(),
        type: 'application',
        volunteerId,
        schoolId,
        message: notificationMessage,
      };
  
      await addDoc(collection(db, 'notifications'), notificationData);
  
      // Update state to reflect application status change
      setApplications(applications.map(app => app.id === applicationId ? { ...app, status } : app));
      toast.success(`Application ${status}`);
    } catch (error) {
      console.error(`Error updating application status to ${status}:`, error);
      toast.error(`Failed to update application status: ${error.message}`);
    }
  };
  

  const handleVolunteerClick = (application) => {
    const volunteer = volunteers.find(v => v.uid === application.volunteerUID);
    setSelectedVolunteer(volunteer);
  };

  const handleCloseVolunteerModal = () => {
    setSelectedVolunteer(null);
  };

  const handleDownloadCertificate = (certificateURL) => {
    window.open(certificateURL, '_blank');
  };

  const openConfirmationDialog = (applicationId, action) => {
    setSelectedApplicationId(applicationId);
    setSelectedAction(action);
    setConfirmationOpen(true);
  };

  const handleConfirm = () => {
    if (selectedApplicationId && selectedAction) {
      handleUpdateStatus(selectedApplicationId, selectedAction);
    }
  };

  const getVolunteerName = (volunteerUID) => {
    const volunteer = volunteers.find(v => v.uid === volunteerUID);
    return volunteer ? `${volunteer.firstname} ${volunteer.surname}` : 'Unknown Volunteer';
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
                        {getVolunteerName(application.volunteerUID)}
                      </Button>
                    </TableCell>
                    <TableCell>{application.subjects.join(', ')}</TableCell>
                    <TableCell sx={{ color: application.status === 'rejected' ? 'red' : application.status === 'accepted' ? 'green' : 'inherit' }}>
                      {application.status}
                    </TableCell>
                    <TableCell>
                      {application.status.toLowerCase() === 'pending' && (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => openConfirmationDialog(application.id, 'accepted')}
                            sx={{ marginRight: 1 }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => openConfirmationDialog(application.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
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
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        aria-labelledby="confirmation-modal"
        aria-describedby="confirmation-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Are you sure you want to {selectedAction.toLowerCase()} this application?
          </Typography>
          <Button variant="contained" onClick={handleConfirm} sx={{ mr: 2 }}>Yes</Button>
          <Button variant="contained" onClick={() => setConfirmationOpen(false)}>No</Button>
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
                <strong>Additional Notes:</strong> {selectedVolunteer.notes}
              </Typography>
            </>
          )}
          <Button variant="contained" onClick={handleCloseVolunteerModal} sx={{ mt: 2 }}>Close</Button>
        </Box>
      </Modal>

      <Modal
        open={unavailableOpen}
        onClose={() => setUnavailableOpen(false)}
        aria-labelledby="unavailable-modal"
        aria-describedby="unavailable-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {unavailableMessage}
          </Typography>
          <Button variant="contained" onClick={() => setUnavailableOpen(false)} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default AppliedListings;
