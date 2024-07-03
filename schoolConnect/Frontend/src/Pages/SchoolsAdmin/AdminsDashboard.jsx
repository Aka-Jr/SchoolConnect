import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import SchoolDrawer from './SchoolDrawer';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VolunteersCard from '../Volunteers/VolunteersCard';
import Dashboard from './Dashboard';

const AdminsDashboard = () => {
    const [schoolDetails, setSchoolDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userDocRef = doc(db, 'schools', user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        setSchoolDetails(userDocSnap.data());
                    } else {
                        console.log('No such document!');
                    }
                } else {
                    console.log('User not logged in.');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            // Introduce a delay to ensure the sign-out process completes before displaying the toast
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Sign-out successful');
            // Optionally, clear state or perform any necessary cleanup
        } catch (error) {
            console.error('Sign-out error:', error);
            toast.error('Failed to sign out. Please try again later.');
        }
    };

    return (
        <React.Fragment>
            <SchoolDrawer handleSignOut={handleSignOut} />
            <Box sx={{ mt: 10 }}>
                <Dashboard />

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                        <CircularProgress />
                    </Box>
                ) : schoolDetails ? (
                    <VolunteersCard schoolDetails={schoolDetails} />
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                        <Typography variant="h6" color="textSecondary">Failed to load school details.</Typography>
                    </Box>
                )}
            </Box>
        </React.Fragment>
    );
};

export default AdminsDashboard;
