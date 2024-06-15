import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, CardMedia, Button, Typography, IconButton } from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import LocationOnIcon from '@mui/icons-material/LocationOn';
// import ModalComponent from './ModalComponent'; // Import the ModalComponent for login/sign up
import { deepPurple } from '@mui/material/colors';
import { auth } from '../../firebaseConfig';

const VolunteerCardsModal = ({ volunteers }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // State for login modal
    const [selectedVolunteerId, setSelectedVolunteerId] = useState(null); // State for selected volunteer ID

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setIsAuthenticated(true); // Set isAuthenticated to true if a user is logged in
            } else {
                setIsAuthenticated(false); // Set isAuthenticated to false if no user is logged in
            }
        });

        return unsubscribe;
    }, []);

    const handleApplyButtonClick = (volunteerId) => {
        if (isAuthenticated) {
            setIsApplicationModalOpen(true); // Open the application modal if the user is authenticated
            setSelectedVolunteerId(volunteerId); // Set the selected volunteer ID
        } else {
            setIsLoginModalOpen(true); // Open the login/sign up modal if the user is not authenticated
        }
    };

    const handleCloseApplicationModal = () => {
        setIsApplicationModalOpen(false); // Close the application modal
        setSelectedVolunteerId(null); // Reset the selected volunteer ID
    };

    const handleCloseLoginModal = () => {
        setIsLoginModalOpen(false); // Close the login/sign up modal
    };

    const handleNextClick = () => {
        setCurrentIndex(currentIndex + 1);
    };

    const handlePreviousClick = () => {
        setCurrentIndex(currentIndex - 1);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', width: '100%' }}>
                {volunteers.slice(currentIndex, currentIndex + 3).map((volunteer) => (
                    <Card key={volunteer.id} sx={{ maxWidth: 300, bgcolor: '#0E424C', height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '3%' }}>
                            <CardMedia
                                component='img'
                                alt='volunteer image'
                                height='140'
                                image={volunteer.image || 'https://via.placeholder.com/150'} // Default image placeholder
                                sx={{ height: '100px', width: '100px', borderRadius: '50%', bgcolor: deepPurple[500] }}
                            />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant='h5' sx={{ color: 'white', textAlign: 'center' }}>
                                    {volunteer.name} {/* Display name of the volunteer */}
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'white', height: '50px', textAlign: 'center', marginBottom: '5%', marginTop: '5%' }}>
                                    {volunteer.bio} {/* Display bio or description of the volunteer */}
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'white', marginBottom: '2%', marginTop: '2%', right: 'auto' }}>
                                    Subject: <span style={{ color: '#A0826A', fontWeight: 'bold' }}>{volunteer.subject}</span> {/* Display subject */}
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'white', marginTop: '2%', right: 'auto' }}>
                                    Education: <span style={{ color: '#A0826A', fontWeight: 'bold' }}>{volunteer.education}</span> {/* Display education details */}
                                </Typography>
                            </Box>
                        </CardContent>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'white', fontSize: 'small' }}>
                                <IconButton sx={{ color: 'white' }}><LocationOnIcon /></IconButton>
                                <Typography variant='subtitle'>{volunteer.location}</Typography> {/* Display location */}
                            </Box>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'center' }}>
                            <Button variant='contained' sx={{ textAlign: 'center', width: '100%', bgcolor: '#A0826A' }} onClick={() => handleApplyButtonClick(volunteer.id)}>Apply</Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', width: '100%' }}>
                <Button variant='contained' onClick={handlePreviousClick} disabled={currentIndex === 0}>Previous</Button>
                <Button variant='contained' onClick={handleNextClick} disabled={currentIndex + 3 >= volunteers.length}>Next</Button>
            </Box>
            <ModalComponent open={isLoginModalOpen} handleClose={handleCloseLoginModal} formType='login' /> {/* Render the login/sign up modal */}
        </Box>
    );
}

export default VolunteerCardsModal;
