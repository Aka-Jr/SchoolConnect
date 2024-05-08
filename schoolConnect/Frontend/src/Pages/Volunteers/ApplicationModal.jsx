import React, { useState } from 'react';
import { Modal, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { collection, addDoc, Timestamp } from 'firebase/firestore'; // Import Firestore functions
import { ToastContainer, toast } from 'react-toastify'; // Import toast notifications
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../../firebaseConfig';

const ApplicationModal = ({ open, handleClose, schoolUID, volunteerUID, listingUID, schoolName }) => {
    const [selectedSubjects, setSelectedSubjects] = useState([]); // State for selected subjects

    const handleSubjectChange = (event) => {
        setSelectedSubjects(event.target.value); // Update selected subjects
    };

    const handleSubmit = async () => {
        try {
            if (selectedSubjects.length === 0) {
                toast.error('Please select at least one subject'); // Notify user to select at least one subject
                return;
            }

            // Create a new application object with the provided data
            const applicationData = {
                schoolUID,
                volunteerUID,
                listingUID,
                schoolName,
                status: 'Pending', // Set status to pending
                subjects: selectedSubjects, // Store the selected subjects
                timestamp: Timestamp.now() // Add a timestamp for when the application was submitted
            };

            // Add the application to the 'applications' collection in Firestore
            const docRef = await addDoc(collection(db, 'applications'), applicationData);

            console.log('Application submitted with ID: ', docRef.id);

            // Notify user of successful submission
            toast.success('Application submitted successfully');
            handleClose(); // Close the modal after submission
        } catch (error) {
            console.error('Error submitting application: ', error);
            // Notify user of error
            toast.error('Failed to submit application. Please try again later.' + error.message);
            console.log(schoolUID);
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
                boxShadow: 24,
                p: 4,
            }}>
                <Typography variant="h5" gutterBottom>Apply to Listing</Typography>
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel id="subject-select-label">Select Subjects</InputLabel>
                    <Select
                        labelId="subject-select-label"
                        id="subject-select"
                        multiple // Enable multiple selection
                        value={selectedSubjects}
                        onChange={handleSubjectChange}
                        renderValue={(selected) => selected.join(', ')} // Render selected subjects as comma-separated string
                    >
                        <MenuItem value="Math">Math</MenuItem>
                        <MenuItem value="Science">Science</MenuItem>
                        <MenuItem value="English">English</MenuItem>
                        {/* Add more subjects as needed */}
                    </Select>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" onClick={handleSubmit}>Submit Application</Button>
                </Box>
                <ToastContainer /> {/* Render the toast container */}
            </Box>
        </Modal>
    );
};

export default ApplicationModal;
