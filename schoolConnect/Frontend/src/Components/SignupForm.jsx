import React, { useState } from 'react';
import { Button, FormControl, MenuItem, Select as MUISelect, Typography, Box, CircularProgress } from '@mui/material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VolunteerSignupForm from './VolunteerSignupForm';
import SchoolSignupForm from './SchoolSignupForm';

const SignupForm = ({ handleSwitchForm }) => {
  const [userType, setUserType] = useState('volunteer'); // Default user type
  const [loading, setLoading] = useState(false); // Loading state

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  return (
    <div>
      <LocalLibraryIcon />
      <Typography variant="h6">
        School<span style={{ color: '#A0826A' }}>Connect</span>
      </Typography>
      <Box sx={{ mt: 2, padding: '5%' }}>
        <FormControl fullWidth sx={{ marginBottom: '16px' }}>
          <MUISelect
            value={userType}
            onChange={handleUserTypeChange}
            id="userType"
            displayEmpty
          >
            <MenuItem value="volunteer">Volunteer</MenuItem>
            <MenuItem value="school">School</MenuItem>
          </MUISelect>
        </FormControl>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : userType === 'volunteer' ? (
          <VolunteerSignupForm handleSwitchForm={handleSwitchForm} setLoading={setLoading} />
        ) : (
          <SchoolSignupForm handleSwitchForm={handleSwitchForm} setLoading={setLoading} />
        )}
      </Box>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default SignupForm;
