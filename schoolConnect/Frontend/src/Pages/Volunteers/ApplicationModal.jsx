import React, { useState, useEffect } from 'react';
import { Modal, Container, Grid, Box, Typography, Button } from '@mui/material';
import { collection, addDoc, Timestamp, doc as firestoreDoc, getDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db, auth } from '../../firebaseConfig';

const ApplicationModal = ({ open, handleClose, schoolUID, listingUID, schoolName }) => {
    const [listingDescription, setListingDescription] = useState('');
    const [listingSubjects, setListingSubjects] = useState([]);
    const [listingQualifications, setListingQualifications] = useState([]);
    const [volunteerDetails, setVolunteerDetails] = useState(null);

    useEffect(() => {
        const fetchVolunteerDetails = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const volunteerUID = currentUser.uid;

                try {
                    const volunteerDocRef = firestoreDoc(db, 'users', volunteerUID);
                    const volunteerDocSnap = await getDoc(volunteerDocRef);

                    if (volunteerDocSnap.exists()) {
                        const volunteerData = volunteerDocSnap.data();
                        setVolunteerDetails(volunteerData);
                    } else {
                        console.error('Volunteer data not found');
                    }
                } catch (error) {
                    console.error('Error fetching volunteer details:', error);
                }
            }
        };

        const fetchListingDetails = async () => {
            try {
                const listingDocRef = firestoreDoc(db, 'listings', listingUID);
                const listingDocSnap = await getDoc(listingDocRef);

                if (listingDocSnap.exists()) {
                    const listingData = listingDocSnap.data();
                    setListingDescription(listingData.description || '');
                    setListingSubjects(listingData.subjects || []);
                    setListingQualifications(listingData.qualifications || []);
                } else {
                    console.error('Listing data not found');
                }
            } catch (error) {
                console.error('Error fetching listing details:', error);
            }
        };

        if (open) {
            fetchVolunteerDetails();
            fetchListingDetails();
        }
    }, [open, listingUID]);

    const handleSubmit = async () => {
        try {
            // Check if volunteer's subjects match any of the listing subjects
            const subjectsMatch = volunteerDetails.subjects.some(subject =>
                listingSubjects.includes(subject)
            );

            // Check if volunteer's education level matches any of the listing qualifications
            const qualificationsMatch = listingQualifications.includes(volunteerDetails.educationLevel);

            if (!subjectsMatch || !qualificationsMatch) {
                toast.warn('Your subjects or qualifications do not match the requirements for this listing.');
                return;
            }

            const applicationData = {
                schoolUID,
                volunteerUID: auth.currentUser.uid,
                listingUID,
                volunteerName: `${volunteerDetails.firstname} ${volunteerDetails.surname}`,
                schoolName,
                status: 'pending',
                subjects: volunteerDetails.subjects,
                timestamp: Timestamp.now()
            };

            const docRef = await addDoc(collection(db, 'applications'), applicationData);

            console.log('Application submitted with ID: ', docRef.id);

            toast.success('Application submitted successfully');
            handleClose();
        } catch (error) {
            console.error('Error submitting application: ', error);
            toast.error('Failed to submit application. Please try again later.');
        }
    };

    return (
        <React.Fragment> 
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                borderRadius: '10px',
                boxShadow: 24,
                p: 4,
                width: '50%',
                maxHeight: '80%',
                overflow: 'hidden',
                overflowY: 'auto',
            }}>
                <Typography variant="h5" gutterBottom>Apply to Volunteer</Typography>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>Please carefully read the description below and ensure your subjects and qualifications match those mentioned.</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Listing Description:</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', marginBottom: 2 }}>{listingDescription || 'No description available'}</Typography>
                <Container>
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={12} md={6}>
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Listing Subjects:</Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', marginBottom: 2 }}>{listingSubjects.join(', ') || 'No subjects specified'}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Listing Qualifications:</Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', marginBottom: 2 }}>{listingQualifications.join(', ') || 'No qualifications specified'}</Typography>
                    </Box>
                </Grid>
            </Grid>
            {volunteerDetails && (
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Your Subjects:</Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', marginBottom: 2 }}>{volunteerDetails.subjects.join(', ') || 'No subjects specified'}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Your Qualification:</Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', marginBottom: 2 }}>{volunteerDetails.educationLevel || 'No qualification specified'}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            )}
        </Container>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" onClick={handleSubmit}>Submit Application</Button>
                </Box>
               
            </Box>
        </Modal>
        <ToastContainer /></React.Fragment>
    );
};

export default ApplicationModal;
