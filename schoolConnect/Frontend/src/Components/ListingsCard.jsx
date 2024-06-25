import React, { useState, useEffect } from 'react';
import { Box, Card, CardActions, CardContent, CardMedia, Button, Typography, IconButton } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ApplicationModal from '../Pages/Volunteers/ApplicationModal';
import ModalComponent from './ModalComponent';
import { deepPurple } from '@mui/material/colors';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { format } from 'date-fns';
import NotificationPopup from './NotificationPopup';

const ListingsCard = ({ listings }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [selectedListingId, setSelectedListingId] = useState(null);
    const [schoolLogos, setSchoolLogos] = useState({});
    const [showAlreadyAppliedPopup, setShowAlreadyAppliedPopup] = useState(false);

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
            // Check if the volunteer has already applied to this school listing
            try {
                const applicationsRef = collection(db, 'applications');
                
                // Check if there is an existing application for this listing by this volunteer
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
        setShowAlreadyAppliedPopup(false); // Close notification popup
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

    const filteredListings = listings.filter(listing => listing.status === 'ongoing');

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', width: '100%' }}>
                {filteredListings.slice(currentIndex, currentIndex + 3).map((listing) => (
                    <Card key={listing.id} sx={{ maxWidth: 300, bgcolor: '#0E424C', height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '3%' }}>
                            <CardMedia
                                component='img'
                                alt='school logo'
                                height='140'
                                image={schoolLogos[listing.uid] || ''}
                                sx={{ height: '100px', width: '100px', borderRadius: '50%', bgcolor: deepPurple[500] }}
                            />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant='h5' sx={{ color: 'white', textAlign: 'center' }}>
                                    {listing.schoolName}
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'white', height: '50px', textAlign: 'center', marginBottom: '5%', marginTop: '5%' }}>
                                    {listing.description}
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'white', marginBottom: '2%', marginTop: '2%', right: 'auto' }}>
                                    Gender Composition: <span style={{ color: '#A0826A', fontWeight: 'bold' }}>{listing.genderComposition}</span>
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'white', marginBottom: '2%', marginTop: '2%', right: 'auto' }}>
                                    Number of Students: <span style={{ color: '#A0826A', fontWeight: 'bold' }}>{listing.numberOfStudents}</span>
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'white', marginTop: '2%', right: 'auto' }}>
                                    Boarding Status: <span style={{ color: '#A0826A', fontWeight: 'bold' }}>{listing.isBoarding === 'No' ? 'Not boarding' : 'Boarding'}</span>
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'white', marginTop: '2%', right: 'auto' }}>
                                    Religious Status: <span style={{ color: '#A0826A', fontWeight: 'bold' }}>{listing.isReligious !== 'yes' ? 'Not religious' : 'Religious'}</span>
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'white', marginTop: '2%', right: 'auto' }}>
                                    Accommodation: <span style={{ color: '#A0826A', fontWeight: 'bold' }}>{listing.willProvideAccommodation ? 'Will provide accommodation' : 'Will not provide accommodation'}</span>
                                </Typography>
                            </Box>
                        </CardContent>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'white', fontSize: 'small' }}>
                                <IconButton sx={{ color: 'white' }}><LocationOnIcon /></IconButton>
                                <Typography variant='subtitle'>{listing.location}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'white', fontSize: 'small' }}>
                                <IconButton sx={{ color: 'white' }}><AccessTimeIcon /></IconButton>
                                <Typography variant='subtitle'>
                                    {listing.numberOfWeeks === 1 ? `${listing.numberOfWeeks} Week` : `${listing.numberOfWeeks} Weeks`}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'white', fontSize: 'small' }}>
                                <IconButton sx={{ color: 'white' }}><EventIcon /></IconButton>
                                {listing.deadline && (
                                    <Typography variant='subtitle'>
                                        Deadline: {format(listing.deadline.toDate(), 'MMMM d, yyyy h:mm a')}
                                    </Typography>
                                )}
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

        </Box>
    );
}

export default ListingsCard;
