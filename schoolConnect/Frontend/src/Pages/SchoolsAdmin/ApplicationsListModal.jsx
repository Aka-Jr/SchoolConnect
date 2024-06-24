import React, { useState, useEffect } from 'react';
import { Modal, Box, List, ListItem, ListItemText, Button } from '@mui/material';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';

const ApplicationsListModal = ({ open, handleClose }) => {
  const [applications, setApplications] = useState([]);

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
        const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched applications:', apps);
        setApplications(apps);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    if (open) {
      fetchApplications();
    }
  }, [open]);

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      const applicationRef = doc(db, 'applications', applicationId);
      await updateDoc(applicationRef, { status });
      setApplications(applications.map(app => app.id === applicationId ? { ...app, status } : app));
      toast.success(`Application ${status}`);
    } catch (error) {
      console.error(`Error updating application status to ${status}:`, error);
      toast.error(`Failed to update application status: ${error.message}`);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
        }}
      >
        <List>
          {applications.length === 0 ? (
            <ListItem>
              <ListItemText primary="No applications found" />
            </ListItem>
          ) : (
            applications.map(application => (
              <ListItem key={application.id}>
                <ListItemText
                  primary={`Volunteer: ${application.volunteerUID}`}
                  secondary={`Status: ${application.status}`}
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleUpdateStatus(application.id, 'accepted')}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleUpdateStatus(application.id, 'rejected')}
                >
                  Reject
                </Button>
              </ListItem>
            ))
          )}
        </List>
        <ToastContainer />
      </Box>
    </Modal>
  );
};

export default ApplicationsListModal;
