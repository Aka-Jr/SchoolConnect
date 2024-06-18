import React from 'react';
import { Box, Typography } from '@mui/material';
import SchoolDrawer from './SchoolDrawer';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './Dashoboard';
import VolunteersCard from '../Volunteers/VolunteersCard';

const AdminsDashboard = () => {
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
      <SchoolDrawer  handleSignOut={handleSignOut}/>
      <Box sx={{mt:10}}>
      <Dashboard />
      <VolunteersCard />
      </Box>
      
    </React.Fragment>
  )
}
export default  AdminsDashboard;