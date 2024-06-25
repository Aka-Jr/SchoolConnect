import React, { useState } from 'react';
import { Box, Typography,Container } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VolunteerzDrawer from './VolunteerzDrawer';
import DashboardCards from './DashboardCards';
import Cards from '../../Components/Cards';
import Footer from '../../Components/Footer';
import ApplicationModal from './ApplicationModal'; // Import the ApplicationModal component
import VolunteerNotificationsModal from './VolunteerNotificationsModal';


const VolunteersDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control the visibility of the modal

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            // Introduce a delay to ensure the sign-out process completes before displaying the toast
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Sign-out successful');
        } catch (error) {
            console.error('Sign-out error:', error);
            toast.error('Failed to sign out. Please try again later.');
        }
    };

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Container component="main" sx={{ flex: '1 0 auto' }}>
                    <Box sx={{ mt: 10 }}>
                        <VolunteerzDrawer handleSignOut={handleSignOut} />
                        <DashboardCards />

                        <Typography variant="h4" sx={{ textAlign: 'center', mt: 5, mb: 2 }}>Voluntering Opportunities</Typography>
                        <Cards />
                        <ApplicationModal open={isModalOpen} handleClose={handleCloseModal} />
                    </Box>
                </Container>

                <Footer />
                
            </Box>
            <ToastContainer />
        </React.Fragment>
    );
};

export default VolunteersDashboard;
