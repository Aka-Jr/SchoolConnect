import React, { useState, useEffect } from 'react';
import { Modal, Box, Table, TableHead, TableBody, TableCell, TableRow, IconButton, Typography, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListingsManager = ({ open, handleClose }) => {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const user = auth.currentUser;
                const listingsCollection = collection(db, 'listings');
                const q = query(listingsCollection, where('uid', '==', user.uid));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setListings(data);
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
        };

        if (open) {
            fetchListings();
        }
    }, [open]);

    const handleDeleteListing = async (id) => {
        try {
            const confirmed = window.confirm('Are you sure you want to delete this listing?');
            if (confirmed) {
                await deleteDoc(doc(db, 'listings', id));
                // Remove the deleted listing from state
                setListings(prevListings => prevListings.filter(listing => listing.id !== id));
                toast.success('Listing deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting listing:', error);
            toast.error('Failed to delete listing');
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const listingRef = doc(db, 'listings', id);
            await updateDoc(listingRef, { status: newStatus });
            // Update the state to reflect the change
            setListings(prevListings => prevListings.map(listing =>
                listing.id === id ? { ...listing, status: newStatus } : listing
            ));
            toast.success(`Listing status updated to ${newStatus}`);
        } catch (error) {
            console.error(`Error updating listing status to ${newStatus}:`, error);
            toast.error('Failed to update listing status');
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: '#0E424C',
                    boxShadow: 24,
                    p: 4,
                    width: '80%',
                    maxHeight: '80%',
                    borderRadius: 8,
                    overflow: 'hidden',
                    overflowY: 'auto', // Enable vertical scrolling
                }}
            >
                <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>Listings</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'white' }}>Description</TableCell>
                            <TableCell sx={{ color: 'white' }}>Accommodation</TableCell>
                            <TableCell sx={{ color: 'white' }}>Timestamp</TableCell>
                            <TableCell sx={{ color: 'white' }}>Status</TableCell>
                            <TableCell align="right" sx={{ color: 'white' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listings.map((listing) => (
                            <TableRow key={listing.id}>
                                <TableCell sx={{ color: 'white' }}>{listing.description}</TableCell>
                                <TableCell sx={{ color: 'white' }}>{listing.willProvideAccommodation ? 'Yes' : 'No'}</TableCell>
                                <TableCell sx={{ color: 'white' }}>{listing.timestamp && new Date(listing.timestamp.toDate()).toLocaleString()}</TableCell>
                                <TableCell sx={{ color: 'white' }}>{listing.status}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Delete">
                                        <IconButton onClick={() => handleDeleteListing(listing.id)} sx={{ color: 'red' }}><DeleteIcon /></IconButton>
                                    </Tooltip>
                                    {listing.status === 'ongoing' ? (
                                        <Tooltip title="Make Unavailable">
                                            <IconButton onClick={() => handleUpdateStatus(listing.id, 'unavailable')} sx={{ color: 'white' }}><BlockIcon /></IconButton>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Make Available">
                                            <IconButton onClick={() => handleUpdateStatus(listing.id, 'ongoing')} sx={{ color: 'white' }}><CheckCircleIcon /></IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Modal>
    );
};

export default ListingsManager;
