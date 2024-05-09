import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, provider } from '../firebaseConfig';
import { signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { Input, Typography, IconButton, Box, Button, Divider } from '@mui/material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const LoginForm = ({ handleClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform form validation
    const validationErrors = {};

    if (!formData.email) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      validationErrors.password = 'Password is required';
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(formData.password)) {
      validationErrors.password = 'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one digit';
    }

    // Set errors using toast notifications
    Object.keys(validationErrors).forEach((key) => {
      toast.error(validationErrors[key]);
    });

    // If there are validation errors, return
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      // Authenticate user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
    
      // Fetch additional user data from Firestore using the authenticated user ID
      const userId = userCredential.user.uid;
      const userDocRef = doc(db, 'users', userId);
      const schoolDocRef = doc(db, 'schools', userId);
    
      // Get user and school data simultaneously
      const [userDocSnap, schoolDocSnap] = await Promise.all([getDoc(userDocRef), getDoc(schoolDocRef)]);
    
      // Check if the Firestore document exists in the 'users' collection
      if (userDocSnap.exists()) {
        // Document exists, retrieve data
        const userData = userDocSnap.data();
        console.log(userData);
    
        // Redirect based on userType
        if (userData.userType === 'volunteer') {
          navigate('/user');
        } else if (userData.userType === 'school') {
          navigate('/sadmin');
        }
    
        // Login successful
        toast.success('Login successful!');
        handleClose();
      } else if (schoolDocSnap.exists()) {
        // Document exists in the 'schools' collection, redirect to school admin page
        navigate('/sadmin');
    
        // Login successful
        toast.success('Login successful!');
        handleClose();
      } else {
        // Document does not exist in both collections, handle error
        console.error('User data not found');
        toast.error('Failed to login. User data not found.');
      }
    } catch (error) {
      // Handle login errors
      console.error('Login error:', error);
      toast.error('Failed to login. Please try again later.');
    }
    
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // Handle Google sign-in successful
      toast.success('Google sign-in successful!');
      handleClose();
      // Redirect to dashboard or any other page
    } catch (error) {
      // Handle Google sign-in errors
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in with Google. Please try again later.');
    }
  };

  const handleForgotPassword = () => {
    const emailAddress = formData.email;

    sendPasswordResetEmail(auth, emailAddress)
      .then(() => {
        // Password reset email sent successfully
        toast.success('Password reset email sent! Check your inbox.');
      })
      .catch((error) => {
        // Handle password reset email send errors
        console.error('Password reset email error:', error);
        toast.error('Failed to send password reset email. Please try again later.');
      });
  };

  return (
    <div>
      <IconButton>
        <LocalLibraryIcon />
      </IconButton>
      <Typography variant="h6">
        School<span style={{ color: '#A0826A' }}>Connect</span>
      </Typography>
      <Box sx={{ mt: 2, padding: '5%' }}>
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
      </Box>
      <Button variant='contained' sx={{ width: '100%', bgcolor: '#A0826A' }} onClick={handleSubmit}>Login</Button>

      <Divider sx={{mt:2}}>OR</Divider>
      <Button variant='contained' onClick={signInWithGoogle} sx={{ width: '100%', mt: 2, color: 'white', gap: '2%' }}>
        <GoogleIcon /> Sign in With Google
      </Button>

      <Box sx={{ mt: 2 }}>
        <Button onClick={handleForgotPassword} sx={{ color: '#1769aa' }}>Forgot Password?</Button>
      </Box>

      <ToastContainer />
    </div>
  );
}

export default LoginForm;
