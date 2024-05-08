import React, { useState } from 'react';
import { Box, Card, CardContent, Grid, IconButton, Typography, CardActions, Button } from '@mui/material';
import RedeemIcon from '@mui/icons-material/Redeem';
import AssistantIcon from '@mui/icons-material/Assistant';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ApplicationDetailsModal from './ApplicationDetailsModal'; // Import the modal component

const DashboardCards = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to track whether the modal is open

    // Function to handle opening the modal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Function to handle closing the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <React.Fragment>
            <Box>
                <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <Grid item xs={3}>
                        <Card sx={{ bgcolor: '#0E424C', textAlign: 'center' }}>
                            <Typography sx={{ color: 'white' }}>Schools Volunteered</Typography>
                            {/* Content for Schools Volunteered */}
                        </Card>
                    </Grid>
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
                            <Typography sx={{ color: 'white' }}>Awarded Certificates</Typography>
                            {/* Content for Awarded Certificates */}
                        </Card>
                    </Grid>
                </Grid>
            </Box>
            <ApplicationDetailsModal
                open={isModalOpen}
                handleClose={handleCloseModal}
            />
        </React.Fragment>
    );
};

export default DashboardCards;
