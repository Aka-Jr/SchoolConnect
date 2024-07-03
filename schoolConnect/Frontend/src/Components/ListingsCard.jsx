import React, { useState, useEffect } from 'react';
import { Box, Card, CardActions, CardContent, CardMedia, Button, Typography, Modal, TextField } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import { deepPurple } from '@mui/material/colors';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { format } from 'date-fns';
import ApplicationModal from '../Pages/Volunteers/ApplicationModal';
import ModalComponent from './ModalComponent';
import NotificationPopup from './NotificationPopup';

const ListingsCard = ({ listings }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [selectedListingId, setSelectedListingId] = useState(null);
    const [selectedListing, setSelectedListing] = useState(null);
    const [schoolDetails, setSchoolDetails] = useState({});
    const [showAlreadyAppliedPopup, setShowAlreadyAppliedPopup] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedListingDetails, setSelectedListingDetails] = useState(null);
    const [searchRegion, setSearchRegion] = useState('');
    const [searchSchoolName, setsearchSchoolName] = useState('');
    const [formType, setFormType] = useState('login');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        const fetchSchoolDetails = async () => {
            const details = {};
            for (const listing of listings) {
                if (listing.uid) {
                    const schoolDocRef = doc(db, 'schools', listing.uid);
                    const schoolDocSnap = await getDoc(schoolDocRef);
                    if (schoolDocSnap.exists()) {
                        details[listing.uid] = schoolDocSnap.data();
                    }
                }
            }
            setSchoolDetails(details);
        };

        fetchSchoolDetails();
    }, [listings]);

    const handleApplyButtonClick = async (listing) => {
        if (isAuthenticated) {
            try {
                const applicationsRef = collection(db, 'applications');
                const existingApplicationQuery = query(applicationsRef,
                    where('listingUID', '==', listing.id),
                    where('volunteerUID', '==', auth.currentUser.uid)
                );

                const existingApplicationSnapshot = await getDocs(existingApplicationQuery);
                if (!existingApplicationSnapshot.empty) {
                    setShowAlreadyAppliedPopup(true);
                    return;
                }

                setIsApplicationModalOpen(true);
                setSelectedListingId(listing.id);
                setSelectedListing(listing);
            } catch (error) {
                console.error('Error checking existing application:', error);
            }
        } else {
            setIsLoginModalOpen(true);
        }
    };

    const handleCloseApplicationModal = () => {
        setIsApplicationModalOpen(false);
        setSelectedListingId(null);
        setSelectedListing(null);
    };

    const handleCloseAlreadyAppliedPopup = () => {
        setShowAlreadyAppliedPopup(false);
    };

    const handleCloseLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    const handleNextClick = () => {
        setCurrentIndex(currentIndex + 1);
    };

    const handlePreviousClick = () => {
        setCurrentIndex(currentIndex - 1);
    };

    const handleSwitchForm = () => {
        setFormType((prevFormType) => (prevFormType === 'login' ? 'signup' : 'login'));
    };

    const handleViewDetailsClick = (listingId) => {
        const listingDetails = listings.find(listing => listing.id === listingId);
        setSelectedListingDetails(listingDetails);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedListingDetails(null);
    };

    const filteredListings = listings.filter(listing =>
        listing.status === 'ongoing' &&
        (!searchRegion || (listing.location && listing.location.toLowerCase().includes(searchRegion.toLowerCase()))) &&
        (!searchSchoolName || (listing.schoolName && listing.schoolName.toLowerCase().includes(searchSchoolName.toLowerCase())))
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem', width: '100%', marginBottom: '1rem' }}>
                <TextField
                    label='Search by Region'
                    value={searchRegion}
                    onChange={(e) => setSearchRegion(e.target.value)}
                    sx={{ width: '40%' }}
                />
                <TextField
                    label='Search by School Name'
                    value={searchSchoolName}
                    onChange={(e) => setsearchSchoolName(e.target.value)}
                    sx={{ width: '40%' }}
                />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', width: '100%' }}>
                {filteredListings.slice(currentIndex, currentIndex + 3).map((listing) => (
                    <Card key={listing.id} sx={{ maxWidth: 300, bgcolor: '#0E424C', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '3%' }}>
                            <CardMedia
                                component='img'
                                alt='school logo'
                                height='140'
                                image={schoolDetails[listing.uid]?.profileImageUrl || ''}
                                sx={{ height: '100px', width: '100px', borderRadius: '50%', bgcolor: deepPurple[500] }}
                            />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
                                <Typography gutterBottom variant='h5' sx={{ color: 'white', letterSpacing: '2px'  }}>
                                    {listing.schoolName}
                                </Typography>
                                <Typography gutterBottom variant='h5' sx={{ color: '#A0826A' }}>
                                    Description:
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'white', height: '50px', marginBottom: '5%', marginTop: '5%' }}>
                                    {listing.description}
                                </Typography>
                            </Box>
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'white', fontSize: 'small', marginTop: 1 }}>
                                    <AccessTimeIcon sx={{ marginRight: 1 }} />
                                    <Typography variant='subtitle' sx={{ textAlign: 'center' }}>
                                    <span style={{color: '#A0826A', fontSize: 'medium', fontWeight: 'bold' }}>Duration:</span> {listing.numberOfWeeks === 1 ? `${listing.numberOfWeeks} Week` : `${listing.numberOfWeeks} Weeks`}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', color: 'white', fontSize: 'small', alignItems: 'center', marginTop: 1 }}>
                                    <EventIcon sx={{ marginRight: 1 }} />
                                    {listing.deadline && (
                                        <Typography variant='subtitle' sx={{ textAlign: 'center' }}>
                                        <span style={{color: '#A0826A', fontSize: 'medium', fontWeight: 'bold' }}>Deadline:</span> {format(listing.deadline.toDate(), 'MMMM d, yyyy h:mm a')}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </CardContent>
                        <CardActions sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                            <Button variant='outlined' sx={{ textAlign: 'center', width: '100%', color: 'white', borderColor: 'white' }} onClick={() => handleViewDetailsClick(listing.id)}>View School Details</Button>
                            <Button variant='contained' sx={{ textAlign: 'center', width: '100%', bgcolor: '#A0826A', marginTop: 1 }} onClick={() => handleApplyButtonClick(listing)}>Apply</Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '2rem' }}>
                <Button variant='contained' onClick={handlePreviousClick} disabled={currentIndex === 0}>Previous</Button>
                <Button variant='contained' onClick={handleNextClick} disabled={currentIndex + 3 >= filteredListings.length}>Next</Button>
            </Box>
            {selectedListing && (
                <ApplicationModal
                    open={isApplicationModalOpen}
                    handleClose={handleCloseApplicationModal}
                    schoolUID={selectedListing.uid}
                    listingUID={selectedListingId}
                    schoolName={selectedListing.schoolName}
                />
            )}
            <ModalComponent
                open={isLoginModalOpen}
                handleClose={handleCloseLoginModal}
                formType={formType}
                handleSwitchForm={handleSwitchForm} />
            <NotificationPopup
                open={showAlreadyAppliedPopup}
                handleClose={handleCloseAlreadyAppliedPopup}
                message='You have already applied for this listing.'
            />
            <Modal open={isDetailsModalOpen} onClose={handleCloseDetailsModal}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '500px',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography variant='h6' component='h2' sx={{fontWeight: 'bold', textAlign: 'center'}}>
                        School Details
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        {selectedListingDetails && schoolDetails[selectedListingDetails.uid] && (
                            <>
                                <strong>School Name:</strong> {schoolDetails[selectedListingDetails.uid]?.schoolName}<br />
                                <strong>Street:</strong> {schoolDetails[selectedListingDetails.uid]?.street}<br />
                                <strong>Ward:</strong> {schoolDetails[selectedListingDetails.uid]?.ward}<br />
                                <strong>District:</strong> {schoolDetails[selectedListingDetails.uid]?.district}<br />
                                <strong>Region:</strong> {schoolDetails[selectedListingDetails.uid]?.region}<br />
                                <p style={{textAlign: 'center', fontWeight: 'bold'}}>For More Information</p> 
                                <strong>Phone Number:</strong> {schoolDetails[selectedListingDetails.uid]?.phoneNumber}<br />
                                <strong>Email:</strong> {schoolDetails[selectedListingDetails.uid]?.email}<br />
                                {/* <strong>Description:</strong> {selectedListingDetails.description} */}
                            </>
                        )}
                    </Typography>
                </Box>
            </Modal>
        </Box>
    );
};

export default ListingsCard;
