// VolunteerCardsModal.jsx

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, CardMedia, Button, Typography, IconButton, CircularProgress, CardActions } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { deepPurple } from '@mui/material/colors';
import { auth } from '../../firebaseConfig';
import ModalComponent from '../../Components/ModalComponent';

const VolunteerCardsModal = ({ volunteers }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [selectedVolunteerId, setSelectedVolunteerId] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
        });

        return unsubscribe;
    }, []);

    const handleApplyButtonClick = (volunteerId) => {
        if (isAuthenticated) {
            setIsApplicationModalOpen(true);
            setSelectedVolunteerId(volunteerId);
        } else {
            setIsLoginModalOpen(true);
        }
    };

    const handleCloseApplicationModal = () => {
        setIsApplicationModalOpen(false);
        setSelectedVolunteerId(null);
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

    if (!Array.isArray(volunteers) || volunteers.length === 0) {
        return <Typography variant="h6" color="textSecondary">No volunteers available.</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', width: '100%' }}>
                {volunteers.slice(currentIndex, currentIndex + 3).map((volunteer) => (
                    <Card key={volunteer.id} sx={{ maxWidth: 300, bgcolor: '#0E424C', height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CardMedia
                                component='img'
                                alt='volunteer image'
                                height='140'
                                image={volunteer.photoURL || 'https://via.placeholder.com/150'}
                                sx={{ height: '100px', width: '100px', borderRadius: '50%', bgcolor: deepPurple[500] }}
                            />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant='h5' sx={{ color: 'white', textAlign: 'center' }}>
                                    {volunteer.firstname} {volunteer.surname}
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'white', height: '50px', textAlign: 'center', marginBottom: '5%', marginTop: '5%' }}>
                                    {volunteer.bio}
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'white', marginBottom: '2%', marginTop: '2%', right: 'auto' }}>
                                    Subject: <span style={{ color: '#A0826A', fontWeight: 'bold' }}>
                                        {volunteer.subjects}
                                    </span>
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'white', marginTop: '2%', right: 'auto' }}>
                                    Education: <span style={{ color: '#A0826A', fontWeight: 'bold' }}>{volunteer.educationLevel}</span>
                                </Typography>
                            </Box>
                        </CardContent>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'white', fontSize: 'small' }}>
                                <IconButton sx={{ color: 'white' }}><LocationOnIcon /></IconButton>
                                <Typography variant='subtitle'>{volunteer.region}</Typography>
                            </Box>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'center' }}>
                            <Button variant='contained' sx={{ textAlign: 'center', width: '100%', bgcolor: '#A0826A' }} onClick={() => handleApplyButtonClick(volunteer.id)}>Request Volunteer</Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', width: '100%' }}>
                <Button variant='contained' onClick={handlePreviousClick} disabled={currentIndex === 0}>Previous</Button>
                <Button variant='contained' onClick={handleNextClick} disabled={currentIndex + 3 >= volunteers.length}>Next</Button>
            </Box>
            <ModalComponent open={isLoginModalOpen} handleClose={handleCloseLoginModal} formType='login' />
        </Box>
    );
}

export default VolunteerCardsModal;
