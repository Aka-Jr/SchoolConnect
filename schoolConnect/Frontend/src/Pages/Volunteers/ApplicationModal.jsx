import React, { useState } from 'react';
import { Modal, Box, Typography, Button, FormControl, InputLabel } from '@mui/material';
import Select from 'react-select';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../../firebaseConfig';

const ApplicationModal = ({ open, handleClose, schoolUID, volunteerUID, listingUID, schoolName }) => {
    const [selectedSubjects, setSelectedSubjects] = useState([]); // State for selected subjects

    const handleSubjectsChange = (selectedOptions) => {
        setSelectedSubjects(selectedOptions); // Update selected subjects
    };

    const handleSubmit = async () => {
        try {
            if (selectedSubjects.length === 0) {
                toast.error('Please select at least one subject');
                return;
            }

            const selectedSubjectsValues = selectedSubjects.map(option => option.value);

            const applicationData = {
                schoolUID,
                volunteerUID,
                listingUID,
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
                <Typography variant="h5" gutterBottom>Apply to Listing</Typography>
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel id="subject-select-label">Select Subjects</InputLabel>
                    <Select
                        isMulti
                        id="subjects"
                        placeholder="Select Subjects"
                        options={[
                            { label: 'Advance Mathematics', value: 'advance mathematics' },
                            { label: 'Basic Mathematics', value: 'basic mathematics' },
                            { label: 'English', value: 'english' },
                            { label: 'Physics', value: 'physics' },
                            { label: 'Chemistry', value: 'chemistry' },
                            { label: 'Biology', value: 'biology' },
                            { label: 'Economics', value: 'economics' },
                            { label: 'Geography', value: 'geography' },
                            { label: 'Civics', value: 'civics' },
                            { label: 'General Studies', value: 'general studies' },
                            { label: 'History', value: 'history' },
                            { label: 'Islamic Knowledge', value: 'islamic knowledge' },
                            { label: 'Bible Knowledge', value: 'bible knowledge' },
                            { label: 'Divinity', value: 'divinity' },
                            // Add more subjects as needed
                        ]}
                        value={selectedSubjects}
                        onChange={handleSubjectsChange}
                        sx={{ width: '100%', mt: 2 }}
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
