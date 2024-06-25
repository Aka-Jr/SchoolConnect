import React from 'react';
import {
    Box,
    Modal,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button
} from '@mui/material';

const SchoolDetailsModal = ({ open, handleClose, schoolDetails, notificationType, requestDetails }) => {
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
                                                <TableCell><strong>Notes:</strong></TableCell>
                                                <TableCell>{requestDetails.notes}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        No details available.
                    </Typography>
                )}
                <Button variant="contained" onClick={handleClose} sx={{ mt: 2 }}>Close</Button>
            </Box>
        </Modal>
    );
};

export default SchoolDetailsModal;
