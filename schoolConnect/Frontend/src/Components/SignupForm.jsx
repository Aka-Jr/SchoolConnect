import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../firebaseConfig';
import { addDoc, collection as addCollection, doc, setDoc } from "firebase/firestore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Input, Typography, Box, FormControl, MenuItem, Select } from '@mui/material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { useNavigate } from 'react-router-dom';

const SignupForm = ({ handleSwitchForm }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'volunteer', // Default user type
    schoolName: '',
    registrationNumber: '',
    phoneNumber: '',
    location: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstname, surname, email, password, confirmPassword, userType, schoolName, registrationNumber, phoneNumber, location } = formData;

    // Form validation
    const validationErrors = {};

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

    if (userType === 'school') {
      if (!schoolName) {
        validationErrors.schoolName = 'School name is required.';
      }

      if (!registrationNumber) {
        validationErrors.registrationNumber = 'Registration number is required.';
      }

      if (!phoneNumber) {
        validationErrors.phoneNumber = 'Phone number is required.';
      }

      if (!location) {
        validationErrors.location = 'Location is required.';
      }
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
      // Create user account with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Get the Firebase user ID
      const userId = userCredential.user.uid;

      // Define the data object to be stored in Firestore
      let userData = {
        email,
        userType
      };

      // Add the user data to the appropriate collection in Firestore based on userType
      if (userType === 'volunteer') {
        // Add to 'volunteers' collection
        userData = { ...userData, firstname, surnamem, phoneNumber};
        await setDoc(doc(db, "volunteers", userId), userData);

        // navigate('/user'); // Redirect to user dashboard
      } else if (userType === 'school') {
        // Add to 'schools' collection with document ID as the authentication user ID
        userData = { ...userData, schoolName, registrationNumber, phoneNumber, location };
        await setDoc(doc(db, "schools", userId), userData);
        // navigate('/sadmin'); // Redirect to school admin dashboard
      }

      // Clear form inputs
      setFormData({
        firstname: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'volunteer', // Reset user type to default
        schoolName: '',
        registrationNumber: '',
        phoneNumber: '',
        location: ''
        // Reset school name
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
            onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
            id="userType"
            displayEmpty
          >
            <MenuItem value="volunteer">Volunteer</MenuItem>
            <MenuItem value="school">School</MenuItem>
          </Select>
        </FormControl>
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
            <Input
              type='text'
              id='registrationNumber'
              placeholder="Registration Number"
              sx={{ width: '100%', mt: 2 }}
              value={formData.registrationNumber}
              onChange={handleChange}
            />
            <Input
              type='text'
              id='phoneNumber'
              placeholder="Phone Number"
              sx={{ width: '100%', mt: 2 }}
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <Input
              type='text'
              id='location'
              placeholder="Location"
              sx={{ width: '100%', mt: 2 }}
              value={formData.location}
              onChange={handleChange}
            />
          </>
        )}
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
        <Input
          type='email'
          id='email'
          placeholder="Email"
          sx={{ width: '100%', mt: 2 }}
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          type='text'
          id='phoneNumber'
          placeholder="Phone Number"
          sx={{ width: '100%', mt: 2 }}
          value={formData.phoneNumber}
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
