import React, { useState } from 'react';
import {
    Box,
    Modal,
    Typography,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const SchoolDetailsModal = ({ open, handleClose, schoolDetails, notificationType, requestDetails, handleAccept, handleReject }) => {
    const [confirmedAction, setConfirmedAction] = useState(null);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const handleAcceptClick = (requestId) => {
        setConfirmedAction('accept');
        setConfirmationOpen(true);
        setConfirmationMessage(`Are you sure you want to accept this request? This action cannot be undone.`);
    };

    const handleRejectClick = (requestId) => {
        setConfirmedAction('reject');
        setConfirmationOpen(true);
        setConfirmationMessage(`Are you sure you want to reject this request? This action cannot be undone.`);
    };

    const handleConfirmAction = async () => {
        try {
            if (confirmedAction === 'accept') {
                await handleAccept(requestDetails.id);
                setNotificationMessage('Request accepted successfully.');
            } else if (confirmedAction === 'reject') {
                await handleReject(requestDetails.id);
                setNotificationMessage('Request rejected successfully.');
            }
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error handling action:', error);
        } finally {
            setConfirmationOpen(false); // Close confirmation dialog
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
        handleClose(); // Close the modal after action confirmation
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="school-details-modal-title"
            aria-describedby="school-details-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                maxHeight: '80%',
                overflow: 'auto',
            }}>
                <Typography variant="h6" id="school-details-modal-title">
                    School Details
                </Typography>
                {schoolDetails ? (
                    <Box>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            <strong>Name:</strong> {schoolDetails.schoolName}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            <strong>Location:</strong><br />
                            <span style={{ fontWeight: 'bold' }}>Street:</span> {schoolDetails.street}<br />
                            <span style={{ fontWeight: 'bold' }}>Ward:</span> {schoolDetails.ward}<br />
                            <span style={{ fontWeight: 'bold' }}>District:</span> {schoolDetails.district}<br />
                            <span style={{ fontWeight: 'bold' }}>Region:</span> {schoolDetails.region}<br />
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            <strong>Contact:</strong> {schoolDetails.phoneNumber}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            <strong>Gender Composition:</strong> {schoolDetails.genderComposition}
                        </Typography>
                        {notificationType === 'request' && requestDetails && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body1">
                                    <strong>Request Details:</strong>
                                </Typography>
                                <TableContainer sx={{ mt: 2 }}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell><strong>Location:</strong></TableCell>
                                                <TableCell>{requestDetails.location}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell><strong>Subjects:</strong></TableCell>
                                                <TableCell>{requestDetails.subjects.join(', ')}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell><strong>Duration:</strong></TableCell>
                                                <TableCell>{requestDetails.numberOfWeeks === 1 ? `${requestDetails.numberOfWeeks} Week` : `${requestDetails.numberOfWeeks} Weeks`}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell><strong>Status:</strong></TableCell>
                                                <TableCell>{requestDetails.status}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                                    {requestDetails.status === 'pending' && (
                                        <>
                                            <Button variant="contained" color="primary" onClick={handleAcceptClick}>Accept</Button>
                                            <Button variant="contained" color="secondary" onClick={handleRejectClick}>Reject</Button>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        No details available.
                    </Typography>
                )}
                <Button variant="contained" onClick={handleClose} sx={{ mt: 2 }}>Close</Button>

                <Dialog
                    open={confirmationOpen}
                    onClose={() => setConfirmationOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Confirm Action</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {confirmationMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmationOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmAction} color="primary" autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="success">
                        {notificationMessage}
                    </MuiAlert>
                </Snackbar>
            </Box>
        </Modal>
    );
};

export default SchoolDetailsModal;
