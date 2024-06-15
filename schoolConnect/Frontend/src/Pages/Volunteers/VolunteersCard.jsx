import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import VolunteerCardsModal from './VolunteerCardsModal'; // Import the VolunteerCardsModal component

const VolunteersCard = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const volunteersCollection = collection(db, 'users'); // Reference to your 'users' collection in Firestore
                const volunteersSnapshot = await getDocs(volunteersCollection);
                const volunteersData = volunteersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setVolunteers(volunteersData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching volunteers:', error);
                setLoading(false);
            }
        };
        fetchVolunteers();
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
    }

    return <VolunteerCardsModal volunteers={volunteers} />;
}

export default VolunteersCard;
