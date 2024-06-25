import React, { useState } from 'react';
import {
    Box,
    Modal,
    Typography,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteIcon from '@mui/icons-material/Delete';

const VolunteerNotificationsModal = ({
    open,
    handleClose,
    notifications,
    handleAccept,
    handleReject,
    handleMarkAsRead,
    handleNotificationClick,
    handleDeleteNotification
}) => {
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [notificationToDelete, setNotificationToDelete] = useState(null);

    const openDeleteConfirm = (notification) => {
        setNotificationToDelete(notification);
        setDeleteConfirmOpen(true);
    };

    const closeDeleteConfirm = () => {
        setNotificationToDelete(null);
        setDeleteConfirmOpen(false);
    };

    const confirmDeleteNotification = () => {
        handleDeleteNotification(notificationToDelete);
        closeDeleteConfirm();
    };

    if (!notifications) {
        return null;
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="volunteer-notifications-modal"
            aria-describedby="volunteer-notifications-list"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                maxHeight: '80%',
                overflow: 'hidden',
                overflowY: 'auto',
                p: 4
            }}>
                <Typography variant="h6" id="volunteer-notifications-modal">Volunteer Notifications</Typography>
                {notifications.length === 0 ? (
                    <Typography variant="body1" mt={2}>No notifications to display.</Typography>
                ) : (
                    <TableContainer sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">SN</TableCell>
                                    <TableCell align="center">Message</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {notifications.map((notification, index) => (
                                    <TableRow key={notification.id} sx={{ backgroundColor: notification.read ? 'transparent' : '#f0f0f0' }}>
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2" color="textPrimary">
                                                {notification.message}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            {notification.read ? 'Read' : 'Unread'}
                                        </TableCell>
                                        <TableCell align="center">
                                            {notification.type === 'request' && notification.status === 'pending' && (
                                                <>
                                                    <Button variant="contained" onClick={() => handleAccept(notification)}>Accept</Button>
                                                    <Button variant="outlined" onClick={() => handleReject(notification)}>Reject</Button>
                                                </>
                                            )}
                                            {notification.type === 'request' && notification.status === 'accepted' && (
                                                <Button variant="outlined" onClick={() => handleReject(notification)}>Reject</Button>
                                            )}
                                            {notification.type === 'request' && (
                                                <IconButton color="primary" onClick={() => handleMarkAsRead(notification)}>
                                                    {notification.read ? <CheckCircleOutlineIcon /> : <HighlightOffIcon />}
                                                </IconButton>
                                            )}
                                            {notification.type !== 'request' && (
                                                <IconButton color="primary" onClick={() => handleMarkAsRead(notification)}>
                                                    {notification.read ? <CheckCircleOutlineIcon /> : <HighlightOffIcon />}
                                                </IconButton>
                                            )}
                                            <Button variant="text" onClick={() => handleNotificationClick(notification)}>View Details</Button>
                                            <IconButton color="secondary" onClick={() => openDeleteConfirm(notification)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <Button variant="contained" onClick={handleClose} sx={{ mt: 2 }}>Close</Button>

                {/* Delete confirmation dialog */}
                <Dialog
                    open={deleteConfirmOpen}
                    onClose={closeDeleteConfirm}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this notification?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDeleteConfirm} color="primary">Cancel</Button>
                        <Button onClick={confirmDeleteNotification} color="secondary" autoFocus>Delete</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Modal>
    );
};

export default VolunteerNotificationsModal;
