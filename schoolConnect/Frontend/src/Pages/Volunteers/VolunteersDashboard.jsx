import React from 'react';
import { Box} from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VolunteerzDrawer from './VolunteerzDrawer';
import DashboardCards from './DashboardCards';

const VolunteersDashboard = () => {
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
      <Box sx={{mt:10}}>
      <VolunteerzDrawer handleSignOut={handleSignOut}/>
      <DashboardCards/>
      </Box>
    </React.Fragment>
  );
};

export default VolunteersDashboard;
