import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button, Grid } from '@mui/material';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

const ApplicationModal = ({ open, handleClose }) => {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [schoolsData, setSchoolsData] = useState({});
    const [listingsData, setListingsData] = useState({});
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [selectedListing, setSelectedListing] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const user = auth.currentUser;
                const applicationsCollection = collection(db, 'applications');
                const q = query(applicationsCollection, where('volunteerUID', '==', user.uid));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setApplications(data);
                setFilteredApplications(data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        fetchApplications();
    }, []);

    useEffect(() => {
        const fetchSchoolAndListingDetails = async () => {
            try {
                const schoolIds = applications.map(app => app.schoolUID);
                const listingIds = applications.map(app => app.listingUID);
                const schoolsData = {};
                const listingsData = {};
                for (const schoolId of schoolIds) {
                    const schoolDocRef = doc(db, 'schools', schoolId);
                    const schoolDocSnapshot = await getDoc(schoolDocRef);
                    if (schoolDocSnapshot.exists()) {
                        schoolsData[schoolId] = schoolDocSnapshot.data();
                    }
                }
                for (const listingId of listingIds) {
                    const listingDocRef = doc(db, 'listings', listingId);
                    const listingDocSnapshot = await getDoc(listingDocRef);
                    if (listingDocSnapshot.exists()) {
                        listingsData[listingId] = listingDocSnapshot.data();
                    }
                }
                setSchoolsData(schoolsData);
                setListingsData(listingsData);
            } catch (error) {
                console.error('Error fetching school or listing details:', error);
            }
        };

        fetchSchoolAndListingDetails();
    }, [applications]);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return '#ffc107';
            case 'accepted':
                return '#4caf50';
            case 'rejected':
                return '#f44336';
            default:
                return 'inherit';
        }
    };

    const handleFilterByStatus = (status) => {
        if (status === filterStatus) {
            setFilteredApplications(applications);
            setFilterStatus('');
        } else {
            const filtered = applications.filter(app => app.status.toLowerCase() === status.toLowerCase());
            setFilteredApplications(filtered);
            setFilterStatus(status);
        }
    };

    const handleSchoolDetailsModalOpen = (application) => {
        setSelectedSchool(schoolsData[application.schoolUID]);
        setSelectedListing(listingsData[application.listingUID]);
        setSelectedApplication(application);
    };

    const handleSchoolDetailsModalClose = () => {
        setSelectedSchool(null);
        setSelectedListing(null);
        setSelectedApplication(null);
    };

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'white',
                    boxShadow: 24,
                    p: 4,
                    maxHeight: '80%',
                    overflow: 'hidden',
                    overflowY: 'auto',
                    width: '80%',
                    borderRadius: '10px',
                }}>
                    <Typography variant="h5" gutterBottom sx={{ color: '#0E424C' }}>Application Details</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button onClick={() => handleFilterByStatus('pending')} variant={filterStatus === 'pending' ? 'contained' : 'outlined'} color="primary" sx={{ mr: 2 }}>Pending</Button>
                        <Button onClick={() => handleFilterByStatus('accepted')} variant={filterStatus === 'accepted' ? 'contained' : 'outlined'} color="success" sx={{ mr: 2 }}>Accepted</Button>
                        <Button onClick={() => handleFilterByStatus('rejected')} variant={filterStatus === 'rejected' ? 'contained' : 'outlined'} color="error" sx={{ mr: 2 }}>Rejected</Button>
                        <Button onClick={() => handleFilterByStatus('')} variant={filterStatus === '' ? 'contained' : 'outlined'} color="inherit">Clear Filter</Button>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>S/N</TableCell>
                                    <TableCell>School Name</TableCell>


                                    <TableCell>Subject(s) Applied</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredApplications.map((application, index) => (
                                    <TableRow key={application.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Button color="primary" onClick={() => handleSchoolDetailsModalOpen(application)}>{schoolsData[application.schoolUID]?.schoolName || 'N/A'}</Button>
                                        </TableCell>


                                        <TableCell>
                                            {application.subjects.map(subject => (
                                                <Typography key={subject}>{subject}</Typography>
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            <span style={{ color: getStatusColor(application.status) }}>{application.status}</span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Modal>

            {/* School and Listing Details Modal */}


            <Modal open={selectedSchool !== null} onClose={handleSchoolDetailsModalClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'white',
                    boxShadow: 24,
                    p: 4,
                    maxHeight: '80%',
                    overflow: 'auto',
                    width: '80%',
                    borderRadius: '10px',
                }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>School Details</Typography>
                    <Grid container spacing={2}>
                        {/* Left Column: School Details */}
                        <Grid item xs={6}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#0E424C' }}>{selectedSchool?.schoolName || 'School Details'}</Typography>
                            <Typography variant="body1"><strong>School Logo:</strong></Typography>
                            <img src={selectedSchool?.profileImageUrl} alt="Logo" style={{ width: 100, height: 100, borderRadius: '50%' }} />
                            <Typography variant="h6" sx={{ mt: 2 }}><strong>Contact Details</strong></Typography>
                            <Typography variant="body1"><strong>Contact:</strong> {selectedSchool?.phoneNumber || 'N/A'}</Typography>
                            <Typography variant="body1"><strong>Email:</strong> {selectedSchool?.email || 'N/A'}</Typography>
                            <Typography variant="h6" sx={{ mt: 2 }}><strong>Location Details</strong></Typography>
                            <Typography variant="body1">
                                {selectedSchool?.region && <><strong>Region:</strong> {selectedSchool.region}<br /></>}
                                {selectedSchool?.ward && <><strong>Ward:</strong> {selectedSchool.ward}<br /></>}
                                {selectedSchool?.district && <><strong>District:</strong> {selectedSchool.district}<br /></>}
                                {selectedSchool?.street && <><strong>Street:</strong> {selectedSchool.street}<br /></>}
                                <Typography variant="h6" sx={{ mt: 2 }}><strong>Other Details</strong></Typography>
                                {selectedSchool?.genderComposition && <><strong>Gender Composition:</strong> {selectedSchool.genderComposition}<br /></>}
                                {selectedSchool?.numberOfStudents && <><strong>Number of Students:</strong> {selectedSchool.numberOfStudents} students<br /></>}
                            </Typography>
                        </Grid>

                        {/* Right Column: Listing Details and Application Details */}
                        <Grid item xs={6}>
                            {selectedListing && (
                                <>
                                    <Typography variant="h6" ><strong>Opportunity Details</strong></Typography>
                                    <Typography variant="body1"><strong>Description:</strong> {selectedListing.description || 'N/A'}</Typography>
                                    <Typography variant="body1">
                                        <strong>Posted Date:</strong> {selectedListing.timestamp?.toDate().toLocaleString() || 'N/A'}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Volunteering Duration:</strong> {selectedListing.numberOfWeeks ? `${selectedListing.numberOfWeeks} weeks` : 'N/A'}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Accommodation:</strong> {selectedListing.willProvideAccommodation !== undefined ?
                                            (selectedListing.willProvideAccommodation ? 'Will be provided by school' : 'Will not be provided by school')
                                            : 'N/A'}
                                    </Typography>
                                </>
                            )}

                            {selectedApplication && (
                                <>
                                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}> <strong>Application Details</strong></Typography>
                                    <Typography variant="body1"><strong>Subject(s) Applied:</strong> {selectedApplication.subjects?.join(', ') || 'N/A'}</Typography>
                                </>
                            )}
                        </Grid>
                    </Grid>

                    {/* Close Button */}
                    <Box sx={{ mt: 3 }}>
                        <Button variant="contained" onClick={handleSchoolDetailsModalClose}>Close</Button>
                    </Box>
                </Box>
            </Modal>

        </>
    );
};

export default ApplicationModal;
