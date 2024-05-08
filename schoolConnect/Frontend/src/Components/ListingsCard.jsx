import React, { useState, useEffect } from 'react';
import { Box, Card, CardActions, CardContent, CardMedia, Button, Typography, IconButton } from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ApplicationModal from '../Pages/Volunteers/ApplicationModal';
import ModalComponent from './ModalComponent'; // Import the ModalComponent for login/sign up
import { deepPurple } from '@mui/material/colors';
import { auth } from '../firebaseConfig';

const ListingsCard = ({ listings }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // State for login modal
    const [selectedListingId, setSelectedListingId] = useState(null); // State for selected listing ID

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setIsAuthenticated(true); // Set isAuthenticated to true if a user is logged in
            } else {
                setIsAuthenticated(false); // Set isAuthenticated to false if no user is logged in
            }
        });

        // Clean up the listener when the component unmounts
        return unsubscribe;
    }, []);

    const handleApplyButtonClick = (listingId) => {
        if (isAuthenticated) {
            setIsApplicationModalOpen(true); // Open the application modal if the user is authenticated
            setSelectedListingId(listingId); // Set the selected listing ID
        } else {
            setIsLoginModalOpen(true); // Open the login/sign up modal if the user is not authenticated
        }
    };

    const handleCloseApplicationModal = () => {
        setIsApplicationModalOpen(false); // Close the application modal
        setSelectedListingId(null); // Reset the selected listing ID
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
                {listings.slice(currentIndex, currentIndex + 3).map((listing, index) => (
                    <Card key={index} sx={{ maxWidth: 300, bgcolor: '#0E424C', height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '3%' }}>
                            <CardMedia
                                component='img'
                                alt='school logo'
                                height='140'
                                image={listing.logo}
                                sx={{ height: '100px', width: '100px', borderRadius: '50%', bgcolor: deepPurple[500] }}
                            />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, height: '200px', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant='h5' sx={{ color: 'white', textAlign: 'center' }}>
                                    {listing.schoolName}
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'white', textAlign: 'center', marginBottom: '5%', marginTop: '5%' }}>
                                    {listing.description}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'white', fontSize: 'small' }}>
                                <IconButton sx={{ color: 'white' }}><LocationOnIcon /></IconButton>
                                <Typography variant='subtitle'>{listing.location}</Typography>
                                <IconButton sx={{ color: 'white', marginLeft: 'auto' }}><AccessAlarmIcon /></IconButton>
                                <Typography variant='subtitle'>{listing.numberOfWeeks == 1 ? `${listing.numberOfWeeks} Week` : `${listing.numberOfWeeks} Weeks`}</Typography>
                            </Box>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'center' }}>
                            <Button variant='contained' sx={{ textAlign: 'center', width: '100%', bgcolor: '#A0826A' }} onClick={() => handleApplyButtonClick(listing.id)}>Apply</Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', width: '100%' }}>
                <Button variant='contained' onClick={handlePreviousClick} disabled={currentIndex === 0}>Previous</Button>
                <Button variant='contained' onClick={handleNextClick} disabled={currentIndex + 3 >= listings.length}>Next</Button>
            </Box>
            <ApplicationModal
                open={isApplicationModalOpen}
                handleClose={handleCloseApplicationModal}
                schoolUID={listings[currentIndex]?.uid} 
                schoolName={listings[currentIndex]?.schoolName}// Pass the school UID of the selected listing
                volunteerUID={auth.currentUser?.uid}
                listingUID={selectedListingId} // Pass the selected listing ID
            /> {/* Render the ApplicationModal */}
            <ModalComponent open={isLoginModalOpen} handleClose={handleCloseLoginModal} formType='login' /> {/* Render the login/sign up modal */}
        </Box>
    );
}

export default ListingsCard;
