import React, { useState, useEffect } from 'react';
import { Box, Card, CardActions, CardContent, CardMedia, Button, Typography, IconButton, Modal, TextField, Autocomplete } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
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
    const [schoolLogos, setSchoolLogos] = useState({});
    const [showAlreadyAppliedPopup, setShowAlreadyAppliedPopup] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedListingDetails, setSelectedListingDetails] = useState(null);
    const [searchRegion, setSearchRegion] = useState('');
    const [searchSchoolName, setsearchSchoolName] = useState();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        const fetchSchoolLogos = async () => {
            const logos = {};
            for (const listing of listings) {
                if (listing.uid) {
                    const schoolDocRef = doc(db, 'schools', listing.uid);
                    const schoolDocSnap = await getDoc(schoolDocRef);
                    if (schoolDocSnap.exists()) {
                        logos[listing.uid] = schoolDocSnap.data().profileImageUrl;
                    }
                }
            }
            setSchoolLogos(logos);
        };

        fetchSchoolLogos();
    }, [listings]);

    const handleApplyButtonClick = async (listingId) => {
        if (isAuthenticated) {
            try {
                const applicationsRef = collection(db, 'applications');
                const existingApplicationQuery = query(applicationsRef,
                    where('listingUID', '==', listingId),
                    where('volunteerUID', '==', auth.currentUser.uid)
                );

                const existingApplicationSnapshot = await getDocs(existingApplicationQuery);
                if (!existingApplicationSnapshot.empty) {
                    setShowAlreadyAppliedPopup(true);
                    return;
                }

                setIsApplicationModalOpen(true);
                setSelectedListingId(listingId);
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
        (!searchRegion || listing.location.toLowerCase().includes(searchRegion.toLowerCase())) &&
        (!searchSchoolName || listing.schoolName.toLowerCase().includes(searchSchoolName.toLowerCase()))
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
                                image={schoolLogos[listing.uid] || ''}
                                sx={{ height: '100px', width: '100px', borderRadius: '50%', bgcolor: deepPurple[500] }}
                            />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
                                <Typography gutterBottom variant='h5' sx={{ color: 'white' }}>
                                    {listing.schoolName}
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'white', height: '50px', marginBottom: '5%', marginTop: '5%' }}>
                                    {listing.description}
                                </Typography>
                            </Box>
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'white', fontSize: 'small' }}>
                                    <LocationOnIcon sx={{ marginRight: 1 }} />
                                    <Typography variant='subtitle' sx={{ textAlign: 'center' }}>{listing.location}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'white', fontSize: 'small', marginTop: 1 }}>
                                    <AccessTimeIcon sx={{ marginRight: 1 }} />
                                    <Typography variant='subtitle' sx={{ textAlign: 'center' }}>
                                        {listing.numberOfWeeks === 1 ? `${listing.numberOfWeeks} Week` : `${listing.numberOfWeeks} Weeks`}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', color: 'white', fontSize: 'small', alignItems: 'center', marginTop: 1 }}>
                                    <EventIcon sx={{ marginRight: 1 }} />
                                    {listing.deadline && (
                                        <Typography variant='subtitle' sx={{ textAlign: 'center' }}>
                                            Deadline: {format(listing.deadline.toDate(), 'MMMM d, yyyy h:mm a')}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </CardContent>
                        <CardActions sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                            <Button variant='outlined' sx={{ textAlign: 'center', width: '100%', color: 'white', borderColor: 'white' }} onClick={() => handleViewDetailsClick(listing.id)}>View School Details</Button>
                            <Button variant='contained' sx={{ textAlign: 'center', width: '100%', bgcolor: '#A0826A', marginTop: 1 }} onClick={() => handleApplyButtonClick(listing.id)}>Apply</Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', width: '100%' }}>
                <Button variant='contained' onClick={handlePreviousClick} disabled={currentIndex === 0}>Previous</Button>
                <Button variant='contained' onClick={handleNextClick} disabled={currentIndex + 3 >= filteredListings.length}>Next</Button>
            </Box>
            <ApplicationModal
                open={isApplicationModalOpen}
                handleClose={handleCloseApplicationModal}
                schoolUID={filteredListings.find(listing => listing.id === selectedListingId)?.uid}
                schoolName={filteredListings.find(listing => listing.id === selectedListingId)?.schoolName}
                volunteerUID={auth.currentUser?.uid}
                listingUID={selectedListingId}
            />
            <ModalComponent open={isLoginModalOpen} handleClose={handleCloseLoginModal} formType='login' />
            <NotificationPopup open={showAlreadyAppliedPopup} handleClose={handleCloseAlreadyAppliedPopup} />

            <Modal open={isDetailsModalOpen} onClose={handleCloseDetailsModal}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxWidth: 600, width: '100%' }}>
                    {selectedListingDetails && (
                        <>
                            <Typography variant='h5' gutterBottom>{selectedListingDetails.schoolName}</Typography>
                            <Typography variant='body2' gutterBottom>Description: {selectedListingDetails.description}</Typography>
                            <Typography variant='body2' gutterBottom>Gender Composition: {selectedListingDetails.genderComposition}</Typography>
                            <Typography variant='body2' gutterBottom>Number of Students: {selectedListingDetails.numberOfStudents}</Typography>
                            <Typography variant='body2' gutterBottom>Boarding Status: {selectedListingDetails.isBoarding === 'No' ? 'Not boarding' : 'Boarding'}</Typography>
                            <Typography variant='body2' gutterBottom>Religious Status: {selectedListingDetails.isReligious !== 'Yes' ? 'Not religious' : 'Religious'}</Typography>
                            <Typography variant='body2' gutterBottom>Accommodation: {selectedListingDetails.willProvideAccommodation ? 'Will provide accommodation' : 'Will not provide accommodation'}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: 'small', marginTop: 2 }}>
                                <LocationOnIcon sx={{ marginRight: 1 }} />
                                <Typography variant='subtitle'>{selectedListingDetails.location}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: 'small', marginTop: 1 }}>
                                <AccessTimeIcon sx={{ marginRight: 1 }} />
                                <Typography variant='subtitle'>{selectedListingDetails.numberOfWeeks === 1 ? `${selectedListingDetails.numberOfWeeks} Week` : `${selectedListingDetails.numberOfWeeks} Weeks`}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: 'small', marginTop: 1, left: 'auto' }}>
                                <EventIcon sx={{ marginRight: 1 }} />
                                {selectedListingDetails.deadline && (
                                    <Typography variant='subtitle'>Deadline: {format(selectedListingDetails.deadline.toDate(), 'MMMM d, yyyy h:mm a')}</Typography>
                                )}
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
}

export default ListingsCard;
