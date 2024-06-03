import React, { useState } from 'react';
import { Button, FormControl, MenuItem, Select as MUISelect, Typography, Box } from '@mui/material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VolunteerSignupForm from './VolunteerSignupForm';
import SchoolSignupForm from './SchoolSignupForm';

const SignupForm = ({ handleSwitchForm }) => {
  const [userType, setUserType] = useState('volunteer'); // Default user type

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
        {userType === 'volunteer' ? (
          <VolunteerSignupForm handleSwitchForm={handleSwitchForm} />
        ) : (
          <SchoolSignupForm handleSwitchForm={handleSwitchForm} />
        )}
      </Box>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default SignupForm;
