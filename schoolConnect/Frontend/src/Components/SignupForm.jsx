import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Input, Typography, Box, FormControl, MenuItem, Select } from '@mui/material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

const SignupForm = ({ handleSwitchForm }) => {
  const auth = getAuth();
  const [formData, setFormData] = useState({
    firstname: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'volunteer', // Default user type
    schoolName: '', // Additional field for school registration
  });

  const handleChange = (e, field) => { // Accept an additional parameter 'field'
    const { value } = e.target;
    if (field === 'userType') { // Check if the field is 'registrationType'
      // If changing the registration type, reset relevant fields
      setFormData({
        ...formData,
        [field]: value,
        firstname: '',
        surname: '',
        schoolName: '', // Reset schoolName field
      });
    } else {
      // Otherwise, update the form data normally
      setFormData({ ...formData, [field]: value });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstname, surname, email, password, confirmPassword, userType, schoolName } = formData;

    // Form validation
    const validationErrors = {};

    if (!firstname && userType === 'volunteer') {
      validationErrors.firstname = 'First name is required.';
    }

    if (!surname && userType === 'volunteer') {
      validationErrors.surname = 'Surname is required.';
    }

    if (!schoolName && userType === 'school') {
      validationErrors.schoolName = 'School name is required.';
    }

    if (!email) {
      validationErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Invalid email format.';
    }

    if (!password) {
      validationErrors.password = 'Password is required.';
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password)) {
      validationErrors.password = 'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one digit.';
    }

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match.';
    }

    // Display validation errors using toasts
    Object.keys(validationErrors).forEach((key) => {
      toast.error(validationErrors[key]);
    });

    // If there are validation errors, stop form submission
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Clear form inputs
      setFormData({
        firstname: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'volunteer', // Reset user type to default
        schoolName: '', // Reset school name
      });

      // Show success message
      toast.success('Registration successful!');

      // Redirect to login component after 2 seconds
      setTimeout(() => {
        handleSwitchForm();
      }, 2000);
    } catch (error) {
      // Handle Firebase errors
      const errorCode = error.code;
      let errorMessage = '';

      switch (errorCode) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already in use. Please use a different email.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please use a stronger password.';
          break;
        default:
          errorMessage = 'An error occurred. Please try again later.';
      }

      // Display the custom error message
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <LocalLibraryIcon />
      <Typography variant="h6">
        School<span style={{ color: '#A0826A' }}>Connect</span>
      </Typography>
      <Box sx={{ mt: 2, padding: '5%' }}>
        <FormControl fullWidth sx={{ marginBottom: '16px' }}>
          <Select
            value={formData.userType}
            onChange={(e) => handleChange(e, 'userType')} // Pass 'userType' as the second argument
            id="userType" // Set the id to "userType"
            displayEmpty
          >
            <MenuItem value="volunteer">Volunteer</MenuItem>
            <MenuItem value="school">School</MenuItem>
          </Select>

        </FormControl>
        {formData.userType === 'volunteer' && (
          <>
            {/* Volunteer fields */}
            <Input
              type='text'
              id='firstname'
              placeholder="First name"
              sx={{ width: '100%' }}
              value={formData.firstname}
              onChange={handleChange}
            />
            <Input
              type='text'
              id='surname'
              placeholder="Surname"
              sx={{ width: '100%', mt: 2 }}
              value={formData.surname}
              onChange={handleChange}
            />
          </>
        )}
        {formData.userType === 'school' && (
          <>
            {/* School fields */}
            <Input
              type='text'
              id='schoolName'
              placeholder="School Name"
              sx={{ width: '100%' }}
              value={formData.schoolName}
              onChange={handleChange}
            />
            {/* Add more school fields as needed */}
          </>
        )}
        <Input
          type='email'
          id='email'
          placeholder="Email"
          sx={{ width: '100%', mt: 2 }}
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          type='password'
          id='password'
          placeholder="Password"
          sx={{ width: '100%', mt: 2 }}
          value={formData.password}
          onChange={handleChange}
        />
        <Input
          type='password'
          placeholder="Confirm Password"
          sx={{ width: '100%', mt: 2 }}
          id='confirmPassword'
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </Box>
      <Button variant='contained' sx={{ width: '100%', bgcolor: '#A0826A' }} onClick={handleSubmit}>
        Register
      </Button>
      <ToastContainer />
    </div>
  );
};

export default SignupForm;
