import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';

const EditVolunteerInfo = ({ open, handleClose, userData, updateUser }) => {
    // Initialize formData with userData or empty strings if userData is null
    const [formData, setFormData] = useState(userData || { schoolName: '', phoneNumber: '', location: ''});

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUser(formData);
        handleClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                maxHeight: '80%',
                    overflow: 'hidden',
                    overflowY: 'auto',
            }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Edit Your Information
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        id="schoolName"
                        label="Name"
                        value={userData ? userData.surname : ''} // Pre-fill value
                        onChange={handleChange}
                        placeholder={userData ? userData.surname : 'School Name'} // Placeholder or pre-filled value
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        id="phoneNumber"
                        label="Phone Number"
                        value={userData ? userData.phoneNumber : ''} // Pre-fill value
                        onChange={handleChange}
                        placeholder={userData ? userData.phoneNumber : 'Phone Number'} // Placeholder or pre-filled value
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        id="email"
                        label="Email"
                        value={userData ? userData.email : ''}
                        // For email, it's usually read-only
                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        id="location"
                        label="Location"
                        value={userData ? `${userData.ward}, ${userData.district}, ${userData.region} ` : ''}
                        InputProps={{
                            readOnly: true,
                        }}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Save Changes
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default EditVolunteerInfo;
