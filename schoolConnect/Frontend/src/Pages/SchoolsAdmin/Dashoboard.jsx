import React, { useState } from 'react';
import { Box, Card, CardContent, Grid, IconButton, Typography, CardActions, Button } from '@mui/material';
import RedeemIcon from '@mui/icons-material/Redeem';
import AssistantIcon from '@mui/icons-material/Assistant';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ListingFormModal from './ListingFormModal'; // Import the ListingFormModal component

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal open/close

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <React.Fragment>
            <Box>
                <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <Grid item xs={3}>
                        <Card sx={{ bgcolor: '#0E424C', textAlign: 'center' }}>
                            <Typography sx={{ color: 'white' }}>Listings</Typography>
                            <CardContent>
                                <IconButton sx={{ color: 'white' }}>
                                    <AssistantIcon />
                                </IconButton>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center' }}>
                                <Button
                                    sx={{ color: 'white', width: '100%' }}
                                    onClick={handleOpenModal} // Open modal when button is clicked
                                >
                                    View
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    {/* Other grid items */}
                </Grid>
            </Box>
            {/* Render the ListingFormModal component */}
            <ListingFormModal open={isModalOpen} handleClose={handleCloseModal} />
        </React.Fragment>
    );
};

export default Dashboard;
