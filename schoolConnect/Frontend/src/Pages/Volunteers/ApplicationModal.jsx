import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, FormControl, InputLabel } from '@mui/material';
import Select from 'react-select';
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

                // Fetch additional volunteer details from the 'users' collection
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

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#1976D2' : '#ccc',
            boxShadow: state.isFocused ? '0 0 0 1px #1976D2' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#1976D2' : '#ccc',
            },
            width: '100%',
            minHeight: 'unset',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#1976D2' : 'white',
            color: state.isSelected ? 'white' : 'inherit',
            '&:hover': {
                backgroundColor: '#1976D2',
                color: 'white',
            },
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999, // Ensure the menu is above other elements
            marginTop: 0,
            boxShadow: '0 0 1px 1px rgba(0,0,0,0.1)',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#999', // Adjust placeholder color
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#1976D2',
            color: 'white',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: 'white',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: 'white',
            '&:hover': {
                backgroundColor: '#195a8b',
                color: 'white',
            },
        }),
    };

    const handleSubjectsChange = (selectedOptions) => {
        setSelectedSubjects(selectedOptions);
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
                    <InputLabel id="subject-select-label">Select Subjects</InputLabel>
                    <Select
                        isMulti
                        id="subjects"
                        placeholder=""
                        options={[
                            { label: 'Advance Mathematics', value: 'advance mathematics' },
                            { label: 'Basic Mathematics', value: 'basic mathematics' },
                            { label: 'English', value: 'english' },
                            { label: 'Physics', value: 'physics' },
                            { label: 'Chemistry', value: 'chemistry' },
                            { label: 'Biology', value: 'biology' },
                            { label: 'Economics', value: 'economics' },
                            { label: 'Geography', value: 'geography' },
                            { label: 'Kiswahil', value: 'kiswahili' },
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
                        styles={customStyles} // Apply custom styles
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
