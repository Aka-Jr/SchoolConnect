import React, { useState } from 'react';
import { Box, Card, CardContent, Grid, IconButton, Typography, CardActions, Button } from '@mui/material';
import RedeemIcon from '@mui/icons-material/Redeem';
import AssistantIcon from '@mui/icons-material/Assistant';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ApplicationDetailsModal from './ApplicationDetailsModal'; // Import the modal component
import VolunteerProfile from './VolunteerProfile';
import VolunteerProfileModal from './VolunteerProfileModal';

const DashboardCards = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to track whether the modal is open
    const [isOpen, setIsOpen] = useState(false);

    // Function to handle opening the modal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Function to handle closing the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpen = () => {
        setIsOpen(true);
    };

    // Function to handle closing the modal
    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <React.Fragment>
            <Box>
                <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  
                    <Grid item xs={3}>
                        <Card sx={{ bgcolor: '#0E424C', textAlign: 'center' }}>
                            <Typography sx={{ color: 'white' }}>Submitted Applications</Typography>
                            {/* Content for Submitted Applications */}
                            <CardContent>
                                <IconButton sx={{ color: 'white' }}>
                                    <ArrowUpwardIcon />
                                </IconButton>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center' }}>
                                <Button sx={{ color: 'white', width: '100%' }} onClick={handleOpenModal}>View</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card sx={{ bgcolor: '#0E424C', textAlign: 'center' }}>
                            <Typography sx={{ color: 'white' }}>My Education Details</Typography>
                            <CardContent>
                                <IconButton sx={{ color: 'white' }}>
                                    <ArrowUpwardIcon />
                                </IconButton>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center' }}>
                                <Button sx={{ color: 'white', width: '100%' }} onClick={handleOpen}>View</Button>
                            </CardActions>

                        </Card>
                    </Grid>
                </Grid>
            </Box>
            <ApplicationDetailsModal
                open={isModalOpen}
                handleClose={handleCloseModal}
            />
            <VolunteerProfileModal

                open={isOpen}
                handleClose={handleClose}
            />
        </React.Fragment>
    );
};

export default DashboardCards;
