import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Modal,
  TextField,
} from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListingFormModal = ({ handleClose, open }) => {
  const [listingData, setListingData] = useState({
    description: '',
    numberOfWeeks: '',
    willProvideAccommodation: false,
  });

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        const userDocRef = doc(db, 'schools', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListingData({ ...listingData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setListingData({ ...listingData, [name]: checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (listingData.numberOfWeeks <= 0) {
      toast.error('Number of weeks must be greater than 0');
      return;
    }

    try {
      const listingRef = collection(db, 'listings');
      await addDoc(listingRef, {
        ...listingData,
        timestamp: serverTimestamp(),
        uid: auth.currentUser.uid,
        location: userData.location,
        schoolName: userData.schoolName,
        email: userData.email,
      });

      toast.success('Listing added successfully');

      // Reset form fields
      setListingData({
        description: '',
        numberOfWeeks: '',
        willProvideAccommodation: false,
      });

      handleClose();
    } catch (error) {
      console.error('Error adding listing:', error);
      toast.error('Failed to add listing: ' + error.message);
    }
  };

  if (!userData) {
    return null; // or render a loading indicator
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="listing-form-modal"
      aria-describedby="listing-form-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
        }}
      >
        <form onSubmit={handleSubmit}>
          <TextField
            name="description"
            label="Description"
            value={listingData.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="numberOfWeeks"
            type="number"
            label="Number of Weeks"
            value={listingData.numberOfWeeks}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <FormControl sx={{ mt: 1 }} fullWidth>
            <FormControlLabel
              control={
                <Checkbox
                  name="willProvideAccommodation"
                  checked={listingData.willProvideAccommodation}
                  onChange={handleCheckboxChange}
                />
              }
              label="Will Provide Accommodation"
            />
          </FormControl>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>
        <ToastContainer />
      </Box>
    </Modal>
  );
};

export default ListingFormModal;
