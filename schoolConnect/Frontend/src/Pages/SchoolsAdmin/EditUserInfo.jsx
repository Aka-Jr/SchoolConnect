import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';

const EditUserInfo = ({ open, handleClose, userData, updateUser }) => {
    // Initialize formData with userData or empty strings if userData is null
    const [formData, setFormData] = useState(userData || { schoolName: '', phoneNumber: '' });

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
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Edit User Information
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        id="schoolName"
                        label="School Name"
                        value={formData.schoolName} // Pre-fill value
                        onChange={handleChange}
                        placeholder={userData ? userData.schoolName : 'School Name'} // Placeholder or pre-filled value
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        id="phoneNumber"
                        label="phoneNumber"
                        value={formData.phoneNumber} // Pre-fill value
                        onChange={handleChange}
                        placeholder={userData ? userData.phoneNumber : 'Phone Number'} // Placeholder or pre-filled value
                        fullWidth
                        margin="normal"
                    />
                    {/* Add more fields as needed */}
                    <Button type="submit" variant="contained" color="primary">
                        Save Changes
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default EditUserInfo;
