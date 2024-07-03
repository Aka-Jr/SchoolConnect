// NotificationPopup.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const NotificationPopup = ({ open, handleClose, message }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Application Notification</DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default NotificationPopup;
