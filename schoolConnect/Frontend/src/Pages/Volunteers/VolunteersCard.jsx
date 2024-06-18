// VolunteersCard.jsx

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import VolunteerCardsModal from './VolunteerCardsModal';

const VolunteersCard = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const volunteersCollection = collection(db, 'users');
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
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
<Box sx={{mt: 5}}>
<Typography variant='h6' sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2%'}}>
    Volunteers
</Typography>
<VolunteerCardsModal volunteers={volunteers} />;
</Box>
    )
    
}

export default VolunteersCard;
