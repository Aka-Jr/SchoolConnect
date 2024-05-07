import React, { useState } from 'react';
import { Box, Card, CardActions, CardContent, CardMedia, Button, Typography, IconButton, Avatar } from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ModalComponent from './ModalComponent';
import { deepOrange, deepPurple } from '@mui/material/colors';

const ListingsCard = ({ listings}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    
    const handleApplyButtonClick = () => {
        setIsModalOpen(true); // Open the modal when the apply button is clicked
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
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
                            <Button variant='contained' sx={{ textAlign: 'center', width: '100%', bgcolor: '#A0826A' }} onClick={handleApplyButtonClick}>Apply</Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', width: '100%' }}>
                <Button variant='contained' onClick={handlePreviousClick} disabled={currentIndex === 0}>Previous</Button>
                <Button variant='contained' onClick={handleNextClick} disabled={currentIndex + 3 >= listings.length}>Next</Button>
            </Box>
            <ModalComponent open={isModalOpen} handleClose={handleCloseModal} formType='login' />
        </Box>
    );
}

export default ListingsCard;
