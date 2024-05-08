import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import ListingsCard from './ListingsCard';

const Cards = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingsCollection = collection(db, 'listings');
                const listingsSnapshot = await getDocs(listingsCollection);
                const listingsData = listingsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setListings(listingsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching listings:', error);
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
    }

    return <ListingsCard listings={listings} />;
}

export default Cards;
