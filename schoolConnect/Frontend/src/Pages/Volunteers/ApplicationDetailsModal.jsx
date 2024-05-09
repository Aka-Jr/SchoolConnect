import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { auth, db } from '../../firebaseConfig'; // Import Firebase auth

const ApplicationModal = ({ open, handleClose }) => {
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
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: '#0E424C', boxShadow: 24, p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ color: 'white', }}>Application Details</Typography>
                <Box sx={{ maxHeight: '400px', overflow: 'auto', }}> {/* Set a fixed height and enable scrolling */}
                    <TableContainer component={Paper} sx={{ bgcolor: '#0E424C', }}>
                        <Table>
                            <TableHead>
                                <TableRow >
                                    <TableCell sx={{ color: 'white', }}>S/N</TableCell>
                                    <TableCell sx={{ color: 'white', }}>School Name</TableCell>
                                    <TableCell sx={{ color: 'white', }}>Subjects</TableCell>
                                    <TableCell sx={{ color: 'white', }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {applications.map((application, index) => (
                                    <TableRow key={application.id}>
                                        <TableCell sx={{ color: 'white', }}>{index + 1}</TableCell>
                                        <TableCell sx={{ color: 'white', }}>{application.schoolName}</TableCell>
                                        <TableCell sx={{ color: 'white', }}>
                                            {application.subjects.map(subject => (
                                                <Typography key={subject}>{subject}</Typography>
                                            ))}
                                        </TableCell>
                                        <TableCell sx={{ color: 'white', }}>
                                            <span style={{ color: getStatusColor(application.status) }}>{application.status}</span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Modal>
    );
};

export default ApplicationModal;
