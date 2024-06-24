import React from 'react';
import { Box, Modal, Typography, Button, List, ListItem, ListItemText, ListItemIcon, CircularProgress } from '@mui/material';

const VolunteerNotificationsModal = ({ open, handleClose, notifications, handleAccept, handleReject }) => {
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
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <Typography variant="h6" id="volunteer-notifications-modal">Volunteer Notifications</Typography>
                {notifications.length === 0 ? (
                    <Typography variant="body1" mt={2}>No notifications to display.</Typography>
                ) : (
                    <List sx={{ width: '100%', bgcolor: 'background.paper', mt: 2 }}>
                        {notifications.map(notification => (
                            <ListItem key={notification.id}>
                                <ListItemText 
                                    primary={notification.schoolName}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2" color="textPrimary">
                                                {notification.message}
                                            </Typography>
                                            <br />
                                            Accommodation: {notification.accommodation}
                                            <br />
                                            Financial Assistance: {notification.financialAssistance}
                                            <br />
                                            Location: {notification.location}
                                        </>
                                    }
                                />
                                <ListItemIcon>
                                    <Button variant="contained" onClick={() => handleAccept(notification)}>Accept</Button>
                                    <Button variant="outlined" onClick={() => handleReject(notification)}>Reject</Button>
                                </ListItemIcon>
                            </ListItem>
                        ))}
                    </List>
                )}
                <Button variant="contained" onClick={handleClose} sx={{ mt: 2 }}>Close</Button>
            </Box>
        </Modal>
    );
};

export default VolunteerNotificationsModal;
