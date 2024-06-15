// Dashboard.jsx
import React, { useState } from 'react';
import { Box, Card, CardContent, Grid, IconButton, Typography, CardActions, Button } from '@mui/material';
import RedeemIcon from '@mui/icons-material/Redeem';
import AssistantIcon from '@mui/icons-material/Assistant';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ListingFormModal from './ListingFormModal'; // Import the ListingFormModal component
import ViewListIcon from '@mui/icons-material/ViewList';
import ListingsManager from './ListingsManager';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import VolunteersCard from '../Volunteers/VolunteersCard';
import AppliedListings from './AppliedListings';

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal open/close
    const [isAppliedListModalOpen, setIsAppliedListModalOpen] = useState(false);
    const [isViewListModalOpen, setIsViewListModalOpen] = useState(false); // State to control view list modal open/close
    const [listings, setListings] = useState([]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenAppliedListModal = () => {
        setIsAppliedListModalOpen(true);
    };

    const handleCloseAppliedListModal = () => {
        setIsAppliedListModalOpen(false);
    };

    const handleOpenViewListModal = () => {
        setIsViewListModalOpen(true);
    };

    const handleCloseViewListModal = () => {
        setIsViewListModalOpen(false);
    };

    const fetchListings = async () => {
        try {
            const listingsCollection = collection(db, 'listings');
            const snapshot = await getDocs(listingsCollection);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setListings(data);
        } catch (error) {
            console.error('Error fetching listings:', error);
        }
    };

    return (
        <React.Fragment>
            <Box>
                <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    {/* Card for adding listings */}
                    <Grid item xs={2}>
                        <Card sx={{ bgcolor: '#0E424C', textAlign: 'center' }}>
                            <Typography sx={{ color: 'white' }}>Add Listing</Typography>
                            <CardContent>
                                <IconButton sx={{ color: 'white' }}>
                                    <RedeemIcon />
                                </IconButton>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center' }}>
                                <Button
                                    sx={{ color: 'white', width: '100%' }}
                                    onClick={handleOpenModal} // Open modal when button is clicked
                                >
                                    Add
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    {/* Card for viewing listings */}
                    <Grid item xs={2}>
                        <Card sx={{ bgcolor: '#0E424C', textAlign: 'center' }}>
                            <Typography sx={{ color: 'white' }}>View Listings</Typography>
                            <CardContent>
                                <IconButton sx={{ color: 'white' }}>
                                    <ViewListIcon />
                                </IconButton>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center' }}>
                                <Button
                                    sx={{ color: 'white', width: '100%' }}
                                    onClick={() => {
                                        fetchListings();
                                        handleOpenViewListModal();
                                    }} // Open view list modal when button is clicked and fetch listings
                                >
                                    View
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>

                    <Grid item xs={2}>
                        <Card sx={{ bgcolor: '#0E424C', textAlign: 'center' }}>
                            <Typography sx={{ color: 'white' }}>Requested Volunteers</Typography>
                            <CardContent>
                                <IconButton sx={{ color: 'white' }}>
                                    <ViewListIcon />
                                </IconButton>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center' }}>
                                <Button
                                    sx={{ color: 'white', width: '100%' }}
                                    onClick={() => {
                                        fetchListings();
                                        handleOpenViewListModal();
                                    }} // Open view list modal when button is clicked and fetch listings
                                >
                                    View
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>

                    <Grid item xs={2}>
                        <Card sx={{ bgcolor: '#0E424C', textAlign: 'center' }}>
                            <Typography sx={{ color: 'white' }}>Applied Listings</Typography>
                            <CardContent>
                                <IconButton sx={{ color: 'white' }}>
                                    <ViewListIcon />
                                </IconButton>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center' }}>
                                <Button
                                    sx={{ color: 'white', width: '100%' }}
                                    onClick={() => setIsAppliedListModalOpen(true)} // Open view list modal when button is clicked and fetch listings
                                >
                                    View
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                   
                </Grid>
                
            </Box>
            {/* Render the ListingFormModal component */}
            <ListingFormModal open={isModalOpen} handleClose={handleCloseModal} />
            {/* Render the ListingsModal component */}
            <ListingsManager open={isViewListModalOpen} handleClose={handleCloseViewListModal} listings={listings} />
            <AppliedListings open={isAppliedListModalOpen} handleClose={() => setIsAppliedListModalOpen(false)} />

        </React.Fragment>
    );
};

export default Dashboard;
