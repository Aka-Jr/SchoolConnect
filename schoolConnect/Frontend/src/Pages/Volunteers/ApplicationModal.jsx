import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, FormControl } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { collection, addDoc, Timestamp, doc as firestoreDoc, getDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db, auth } from '../../firebaseConfig';

const ApplicationModal = ({ open, handleClose, schoolUID, listingUID, schoolName }) => {
    const [selectedSubjects, setSelectedSubjects] = useState([]);
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

        if (open) {
            fetchVolunteerDetails();
        }
    }, [open]);

    const handleSubjectsChange = (event, newValue) => {
        setSelectedSubjects(newValue);
    };

    const handleSubmit = async () => {
        try {
            if (selectedSubjects.length === 0) {
                toast.error('Please select at least one subject');
                return;
            }

            const selectedSubjectsValues = selectedSubjects;

            const applicationData = {
                schoolUID,
                volunteerUID: auth.currentUser.uid,
                listingUID,
                volunteerName: `${volunteerDetails.firstname} ${volunteerDetails.surname}`,
                schoolName,
                status: 'Pending',
                subjects: selectedSubjectsValues,
                timestamp: Timestamp.now()
            };

            const docRef = await addDoc(collection(db, 'applications'), applicationData);

            console.log('Application submitted with ID: ', docRef.id);

            toast.success('Application submitted successfully');
            handleClose();
        } catch (error) {
            console.error('Error submitting application: ', error);
            toast.error('Failed to submit application. Please try again later.' + error.message);
        }
    };

    return (
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
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <Autocomplete
                        multiple
                        options={[
                            'Advance Mathematics',
                            'Basic Mathematics',
                            'English',
                            'Physics',
                            'Chemistry',
                            'Biology',
                            'Economics',
                            'Geography',
                            'Civics',
                            'General Studies',
                            'History',
                            'Islamic Knowledge',
                            'Bible Knowledge',
                            'Divinity',
                            // Add more subjects as needed
                        ]}
                        value={selectedSubjects}
                        onChange={handleSubjectsChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Select Subjects"
                                placeholder="Subjects"
                            />
                        )}
                        sx={{ mb: 2 }}
                    />
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" onClick={handleSubmit}>Submit Application</Button>
                </Box>
                <ToastContainer />
            </Box>
        </Modal>
    );
};

export default ApplicationModal;
