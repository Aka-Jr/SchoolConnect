import React from 'react';
import { Modal, Typography, Box, Button } from '@mui/material';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const ModalComponent = ({ open, handleClose, formType, handleSwitchForm }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'white',
                    boxShadow: 24,
                    p: 4,
                    width: '40%',
                    borderRadius: '10px',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {formType === 'login' ? 'Login' : 'Sign Up'}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {formType === 'login' ? (
                        <LoginForm handleClose={handleClose} />
                    ) : (
                        <SignupForm handleSwitchForm={handleSwitchForm} />
                    )}
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        {formType === 'login' ? "Don't have an account?" : "Already have an account?"}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button onClick={handleSwitchForm}>
                            {formType === 'login' ? 'Sign Up' : 'Login'}
                        </Button>
                        <Button onClick={handleClose}>
                            Close
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}

export default ModalComponent;
