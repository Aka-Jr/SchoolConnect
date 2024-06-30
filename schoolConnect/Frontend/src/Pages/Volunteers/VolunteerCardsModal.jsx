import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Button,
    Typography,
    IconButton,
    CardActions,
    Snackbar,
    Alert,
    Modal,
    TextField,
    Checkbox,
    FormControlLabel,
    FormControl,
    FormLabel,
    FormGroup
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { deepPurple } from '@mui/material/colors';
import { auth, db } from '../../firebaseConfig';
import Autocomplete from '@mui/material/Autocomplete';

const VolunteerCardsModal = ({ volunteers, schoolDetails }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [requestSubjects, setRequestSubjects] = useState([]);
    const [accommodationAvailable, setAccommodationAvailable] = useState(false);
    const [financialAssistance, setFinancialAssistance] = useState(false);
    const [numberOfWeeks, setNumberOfWeeks] = useState(1);
    const [filterText, setFilterText] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
        });

        return unsubscribe;
    }, []);

    const handleApplyButtonClick = (volunteer) => {
        if (isAuthenticated) {
            if (volunteer.availabilityStatus === 'available') {
                setSelectedVolunteer(volunteer);
                setIsApplicationModalOpen(true);
            } else {
                setSnackbarMessage('The volunteer is currently assisting another school. Please choose another volunteer.');
                setSnackbarOpen(true);
            }
        } else {
            setIsLoginModalOpen(true);
        }
    };

    const handleRequestSubmit = async () => {
        const selectedSubjectsText = requestSubjects.join(', ');

        try {
            // Check if there's already a request from the same school for the selected volunteer
            const requestsRef = collection(db, 'requests');
            const q = query(requestsRef, where('schoolId', '==', schoolDetails?.uid), where('volunteerId', '==', selectedVolunteer.id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setSnackbarMessage('You have already sent a request to this volunteer.');
                setSnackbarOpen(true);
                return;
            }

            // Create a notification object with minimal fields
            const notificationData = {
                createdAt: new Date(),
                type: 'request',
                volunteerId: selectedVolunteer.id,
                schoolId: schoolDetails?.uid || '',
                message: `Hello ${selectedVolunteer.firstname}, ${schoolDetails?.schoolName} is requesting your assistance for subjects: ${selectedSubjectsText}.`
            };

            // Create a request object with the remaining data
            const requestData = {
                volunteerId: selectedVolunteer.id,
                volunteerName: `${selectedVolunteer.firstname} ${selectedVolunteer.surname}`,
                schoolId: schoolDetails?.uid || '',
                subjects: requestSubjects,
                accommodationAvailable,
                financialAssistance,
                status: 'pending',
                location: `${schoolDetails?.street}, ${schoolDetails?.ward}, ${schoolDetails?.district}, ${schoolDetails?.region}` || '', // Add location details
                numberOfWeeks // Add number of weeks
            };

            // Store notification in Firestore
            const notificationDocRef = await addDoc(collection(db, 'notifications'), notificationData);
            console.log('Notification added with ID: ', notificationDocRef.id);

            // Store request in Firestore
            const requestDocRef = await addDoc(collection(db, 'requests'), requestData);
            console.log('Request added with ID: ', requestDocRef.id);

            setSnackbarMessage(`Request sent to ${selectedVolunteer.firstname} ${selectedVolunteer.surname} for subjects: ${selectedSubjectsText}.`);
            setSnackbarOpen(true);
            handleCloseApplicationModal();
        } catch (error) {
            console.error('Error storing notification or request:', error);
            setSnackbarMessage('Failed to send request. Please try again later.');
            setSnackbarOpen(true);
        }
    };

    const handleCloseApplicationModal = () => {
        setIsApplicationModalOpen(false);
        setSelectedVolunteer(null);
        setRequestSubjects([]);
        setAccommodationAvailable(false);
        setFinancialAssistance(false);
        setNumberOfWeeks(1);
    };

    const handleCloseLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
    };

    const handlePreviousClick = () => {
        setCurrentIndex((prevIndex) => prevIndex - 1);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const filterVolunteers = (volunteers, filterText, subjectFilter, locationFilter, genderFilter) => {
        return volunteers.filter((volunteer) =>
            (volunteer.subjects.some((subject) =>
                subject.toLowerCase().includes(filterText.toLowerCase())
            ) || volunteer.location.toLowerCase().includes(filterText.toLowerCase())) &&
            (subjectFilter === '' || volunteer.subjects.includes(subjectFilter)) &&
            (locationFilter === '' || volunteer.region.toLowerCase().includes(locationFilter.toLowerCase())) &&
            (genderFilter === '' || volunteer.gender.toLowerCase() === genderFilter.toLowerCase())
        );
    };

    const filteredVolunteers = filterVolunteers(volunteers, filterText, subjectFilter, locationFilter, genderFilter);

    if (!Array.isArray(filteredVolunteers) || filteredVolunteers.length === 0) {
        return <Typography variant="h6" color="textSecondary">No volunteers available.</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', width: '100%' }}>
                {filteredVolunteers.slice(currentIndex, currentIndex + 3).map((volunteer) => (
                    <Card key={volunteer.id} sx={{ width: 300, bgcolor: '#0E424C', height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CardMedia
                                component='img'
                                alt='volunteer image'
                                height='140'
                                image={volunteer.photoURL || 'https://via.placeholder.com/150'}
                                sx={{ height: '100px', width: '100px', borderRadius: '50%', bgcolor: deepPurple[500], mt: '1rem' }}
                            />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant='h5' sx={{ color: 'white', textAlign: 'center' }}>
                                    {volunteer.firstname} {volunteer.surname}
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'white', marginBottom: '2%', marginTop: '2%', right: 'auto', height: '35px' }}>
                                    Subjects: <span style={{ color: '#A0826A', fontWeight: 'bold' }}>
                                        {volunteer.subjects.join(', ')}
                                    </span>
                                </Typography>
                            </Box>
                        </CardContent>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'white', fontSize: 'small' }}>
                                <IconButton sx={{ color: 'white' }}><LocationOnIcon /></IconButton>
                                <Typography variant='subtitle'>{volunteer.region}</Typography>
                            </Box>
                        </CardContent>
                        <CardActions sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 0.5 }}>
                            <Button variant='outlined' sx={{ textAlign: 'center', width: '100%', borderColor: '#A0826A', color: '#A0826A' }} onClick={() => setSelectedVolunteer(volunteer)}>View Volunteer Details</Button>
                            <Button variant='contained' sx={{ textAlign: 'center', width: '100%', bgcolor: '#A0826A' }} onClick={() => handleApplyButtonClick(volunteer)}>Request Volunteer</Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', width: '100%' }}>
                <Button variant='contained' onClick={handlePreviousClick} disabled={currentIndex === 0}>Previous</Button>
                <Button variant='contained' onClick={handleNextClick} disabled={currentIndex + 3 >= volunteers.length}>Next</Button>
            </Box>
            {selectedVolunteer && (
                <Modal open={Boolean(selectedVolunteer)} onClose={() => setSelectedVolunteer(null)}>
                    <Box sx={{ 
                        position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    borderRadius: '10px',
                    boxShadow: 24,
                    p: 4,
                    width: 400,
                    maxHeight: '80%',
                    margin:'auto',
                    overflow: 'hidden',
                    overflowY: 'auto', 
                        }}>
                        <Typography variant="h6" gutterBottom>
                            Volunteer Details
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: '1%' }}>
                            Gender: {selectedVolunteer.gender}
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: '1%' }}>
                            Marital Status: {selectedVolunteer.maritalStatus}
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: '1%' }}>
                            Age: {selectedVolunteer.age}
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: '1%' }}>
                            Education Level: {selectedVolunteer.educationLevel}
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: '1%' }}>
                            Employment Status: {selectedVolunteer.employmentStatus}
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: '1%' }}>
                            Email: {selectedVolunteer.email}
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: '1%' }}>
                            Phone Number: {selectedVolunteer.phoneNumber}
                        </Typography>
                        <Button variant="contained" onClick={() => setSelectedVolunteer(null)} sx={{ mt: 2 }}>Close</Button>
                    </Box>
                </Modal>
            )}
            <Modal open={isApplicationModalOpen} onClose={handleCloseApplicationModal}>
                <Box sx={{ 
                    p: 4,
                     bgcolor: 'background.paper',
                      margin: 'auto', 
                      width: 400, 
                      borderRadius: 2
                      }}>
                    <Typography variant="h6" gutterBottom>
                        Request Volunteer
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        You are requesting <span style={{ color: '#A0826A', fontWeight: 'bold' }}>{selectedVolunteer?.firstname} {selectedVolunteer?.surname}</span> to assist at your school.
                    </Typography>
                    <Autocomplete
                        multiple
                        options={selectedVolunteer ? selectedVolunteer.subjects : []}
                        value={requestSubjects}
                        onChange={(event, newValue) => setRequestSubjects(newValue)}
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
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <FormLabel component="legend">Accommodation</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={accommodationAvailable}
                                        onChange={(e) => setAccommodationAvailable(e.target.checked)}
                                        name="accommodation"
                                    />
                                }
                                label="Accommodation Available"
                            />
                        </FormGroup>
                    </FormControl>
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <FormLabel component="legend">Financial Assistance</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={financialAssistance}
                                        onChange={(e) => setFinancialAssistance(e.target.checked)}
                                        name="financialAssistance"
                                    />
                                }
                                label="Financial Assistance Provided"
                            />
                        </FormGroup>
                    </FormControl>
                    <TextField
                        label="Number of Weeks"
                        type="number"
                        value={numberOfWeeks}
                        onChange={(e) => setNumberOfWeeks(e.target.value)}
                        InputProps={{ inputProps: { min: 1 } }}
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" onClick={handleRequestSubmit} sx={{ mt: 2 }}>Submit Request</Button>
                    <Button variant="outlined" onClick={handleCloseApplicationModal} sx={{ mt: 2, ml: 2 }}>Cancel</Button>
                </Box>
            </Modal>
            <Modal open={isLoginModalOpen} onClose={handleCloseLoginModal}>
                <Box sx={{ 
                    p: 4, bgcolor: 'background.paper', margin: 'auto', width: 400, borderRadius: 2 
                    }}>
                    <Typography variant="h6" gutterBottom>
                        Please Log In
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        You need to log in to request a volunteer.
                    </Typography>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => { /* handle login logic here */ }}>Log In</Button>
                </Box>
            </Modal>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default VolunteerCardsModal;
