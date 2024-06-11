import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { auth, db } from '../../firebaseConfig'; // Import Firebase auth
import VolunteerProfile from './VolunteerProfile';

const VolunteerProfileModal = ({ open, handleClose }) => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const user = auth.currentUser;
                const applicationsCollection = collection(db, 'applications');
                const q = query(applicationsCollection, where('volunteerUID', '==', user.uid));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setApplications(data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        fetchApplications();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return '#ffc107'; // Yellow color for pending status
            case 'Accepted':
                return '#4caf50'; // Green color for accepted status
            case 'Rejected':
                return '#f44336'; // Red color for rejected status
            default:
                return 'inherit'; // Use default color
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: '#0E424C',
                boxShadow: 24,
                p: 4,
                maxHeight: '80%',
                overflow: 'hidden',
                overflowY: 'auto',
                width: '80%',
                borderRadius: '10px',
            }}>
                <Typography variant="h5" gutterBottom sx={{ color: 'white', }}>Application Details</Typography>
                <VolunteerProfile />
            </Box>
        </Modal>
    );
};

export default VolunteerProfileModal;
