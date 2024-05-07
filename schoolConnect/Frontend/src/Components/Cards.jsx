import * as React from 'react';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import ListingsCard from './ListingsCard'; // Import the new component for rendering cards

const Cards = () => {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingsCollection = collection(db, 'listings');
                const listingsSnapshot = await getDocs(listingsCollection);
                const listingsData = listingsSnapshot.docs.map(doc => doc.data());
                setListings(listingsData);
                
            } catch (error) {
                console.error('Error fetching listings:', error);

            }
        };
        fetchListings();
    }, []);

    return (
        <ListingsCard listings={listings} />
    );
}

export default Cards;
