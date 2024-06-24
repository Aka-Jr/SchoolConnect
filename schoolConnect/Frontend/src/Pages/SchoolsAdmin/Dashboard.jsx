import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, IconButton, Typography, CardActions, Button } from '@mui/material';
import RedeemIcon from '@mui/icons-material/Redeem';
import ViewListIcon from '@mui/icons-material/ViewList';
import ListingFormModal from './ListingFormModal';
import ListingsManager from './ListingsManager';
import AppliedListings from './AppliedListings';
import ApplicationsListModal from './ApplicationsListModal';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAppliedListModalOpen, setIsAppliedListModalOpen] = useState(false);
    const [isViewListModalOpen, setIsViewListModalOpen] = useState(false);
    const [isApplicationsListModalOpen, setIsApplicationsListModalOpen] = useState(false);
    const [listings, setListings] = useState([]);
    const [selectedListingId, setSelectedListingId] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            setUser(currentUser);
        };

        fetchUserData();
    }, []);

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

    const handleOpenApplicationsListModal = (listingId) => {
        setSelectedListingId(listingId);
        setIsApplicationsListModalOpen(true);
    };

    const handleCloseApplicationsListModal = () => {
        setIsApplicationsListModalOpen(false);
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
                                    onClick={handleOpenModal}
                                >
                                    Add
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
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
                                    }}
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
                                    }}
                                >
                                    View
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={2}>
                        <Card sx={{ bgcolor: '#0E424C', textAlign: 'center' }}>
                            <Typography sx={{ color: 'white' }}>Applied Opportunities</Typography>
                            <CardContent>
                                <IconButton sx={{ color: 'white' }}>
                                    <ViewListIcon />
                                </IconButton>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center' }}>
                                <Button
                                    sx={{ color: 'white', width: '100%' }}
                                    onClick={() => setIsAppliedListModalOpen(true)}
                                >
                                    View
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    {/* <Grid item xs={2}>
                        <Card sx={{ bgcolor: '#0E424C', textAlign: 'center' }}>
                            <Typography sx={{ color: 'white' }}>Volunteer Applications</Typography>
                            <CardContent>
                                <IconButton sx={{ color: 'white' }}>
                                    <ViewListIcon />
                                </IconButton>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center' }}>
                                <Button
                                    sx={{ color: 'white', width: '100%' }}
                                    onClick={() => handleOpenApplicationsListModal('your-listing-id')} // Replace 'your-listing-id' with the actual listing ID
                                >
                                    View
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid> */}
                </Grid>
            </Box>
            <ListingFormModal open={isModalOpen} handleClose={handleCloseModal} />
            <ListingsManager open={isViewListModalOpen} handleClose={handleCloseViewListModal} listings={listings} />
            <AppliedListings open={isAppliedListModalOpen} handleClose={handleCloseAppliedListModal} />
            <ApplicationsListModal
                open={isApplicationsListModalOpen}
                handleClose={handleCloseApplicationsListModal}
                listingId={selectedListingId}
            />
        </React.Fragment>
    );
};

export default Dashboard;
