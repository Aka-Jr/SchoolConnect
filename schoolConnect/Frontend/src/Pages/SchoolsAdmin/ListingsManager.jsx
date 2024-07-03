import React, { useState, useEffect } from 'react';
import { Modal, Box, Table, TableHead, TableBody, TableCell, TableRow, IconButton, Typography, Tooltip, ButtonGroup, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListingsManager = ({ open, handleClose }) => {
    const [listings, setListings] = useState([]);
    const [filteredStatus, setFilteredStatus] = useState('');

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const user = auth.currentUser;
                const listingsCollection = collection(db, 'listings');
                let q = query(listingsCollection, where('uid', '==', user.uid));

                if (filteredStatus === 'unavailable') {
                    q = query(listingsCollection, where('uid', '==', user.uid), whereIn('status', ['unavailable', 'ended']));
                } else if (filteredStatus !== '') {
                    q = query(listingsCollection, where('uid', '==', user.uid), where('status', '==', filteredStatus));
                }

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
    }, [open, filteredStatus]);

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

    const clearFilter = () => {
        setFilteredStatus('');
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'white', // White background
                    boxShadow: 24,
                    p: 4,
                    width: '80%',
                    maxHeight: '80%',
                    borderRadius: 8,
                    overflow: 'hidden',
                    overflowY: 'auto', // Enable vertical scrolling
                }}
            >
                <Typography variant="h5" gutterBottom>Listings</Typography>
                <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{ mb: 2 }}>
                    <Button onClick={() => setFilteredStatus('ongoing')} variant={filteredStatus === 'ongoing' ? 'contained' : 'outlined'}>Ongoing</Button>
                    <Button onClick={() => setFilteredStatus('unavailable')} variant={filteredStatus === 'unavailable' ? 'contained' : 'outlined'}>Unavailable</Button>
                    <Button onClick={clearFilter} variant={filteredStatus === '' ? 'contained' : 'outlined'}>Clear Filter</Button>
                </ButtonGroup>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>Accommodation</TableCell>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listings.map((listing) => (
                            <TableRow key={listing.id}>
                                <TableCell>{listing.description}</TableCell>
                                <TableCell>{listing.willProvideAccommodation ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{listing.timestamp && new Date(listing.timestamp.toDate()).toLocaleString()}</TableCell>
                                <TableCell>{listing.status}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Delete">
                                        <IconButton onClick={() => handleDeleteListing(listing.id)} sx={{ color: 'red' }}><DeleteIcon /></IconButton>
                                    </Tooltip>
                                    {listing.status === 'ongoing' ? (
                                        <Tooltip title="Make Unavailable">
                                            <IconButton onClick={() => handleUpdateStatus(listing.id, 'unavailable')} sx={{ color: 'black' }}><BlockIcon /></IconButton>
                                        </Tooltip>
                                    ) : listing.status === 'unavailable' || listing.status === 'ended' ? (
                                        <Tooltip title="Make Ongoing">
                                            <IconButton onClick={() => handleUpdateStatus(listing.id, 'ongoing')} sx={{ color: 'green' }}><CheckCircleIcon /></IconButton>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Ended">
                                            <IconButton onClick={() => handleUpdateStatus(listing.id, 'ended')} sx={{ color: 'gray' }}><CheckCircleIcon /></IconButton>
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
