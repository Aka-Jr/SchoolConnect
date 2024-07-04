import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import Autocomplete from '@mui/material/Autocomplete';

const qualificationOptions = ['Bachelor', 'Master', 'Diploma'];

// Function to calculate difference in weeks between two dates
const differenceInWeeks = (date1, date2) => {
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.ceil(diffDays / 7);
};

const ListingFormModal = ({ handleClose, open }) => {
  const [listingData, setListingData] = useState({
    description: '',
    numberOfWeeks: '',
    willProvideAccommodation: false,
    willProvideFinancialAssistance: false,
    startDate: null,
    endDate: null,
    deadlineForApplying: null,
    qualifications: [],
    subjects: [],
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

  const handleStartDateChange = (date) => {
    setListingData((prevData) => ({
      ...prevData,
      startDate: date,
      numberOfWeeks: prevData.endDate ? differenceInWeeks(prevData.endDate, date) : '',
    }));
  };

  const handleEndDateChange = (date) => {
    setListingData((prevData) => ({
      ...prevData,
      endDate: date,
      numberOfWeeks: prevData.startDate ? differenceInWeeks(date, prevData.startDate) : '',
    }));
  };

  const handleDeadlineForApplyingChange = (date) => {
    setListingData({ ...listingData, deadlineForApplying: date });
  };

  const handleQualificationsChange = (event, newValue) => {
    setListingData({ ...listingData, qualifications: newValue });
  };

  const handleSubjectsChange = (event, newValue) => {
    setListingData({ ...listingData, subjects: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!listingData.startDate || !listingData.endDate) {
      toast.error('Please select both start date and end date');
      return;
    }

    if (!listingData.qualifications.length) {
      toast.error('Please select at least one qualification');
      return;
    }

    if (!listingData.subjects.length) {
      toast.error('Please select at least one subject');
      return;
    }

    if (!listingData.deadlineForApplying) {
      toast.error('Please select a deadline for applying');
      return;
    }

    const description = `We need teachers with the following qualifications: ${listingData.qualifications.join(
      ', '
    )}. Subjects required: ${listingData.subjects.join(
      ', '
    )}. The teaching period is from ${listingData.startDate.toLocaleDateString()} to ${listingData.endDate.toLocaleDateString()}, lasting ${listingData.numberOfWeeks} weeks. Deadline for applying is ${listingData.deadlineForApplying.toLocaleDateString()}.`;

    try {
      const listingRef = collection(db, 'listings');
      await addDoc(listingRef, {
        ...listingData,
        description,
        timestamp: serverTimestamp(),
        uid: auth.currentUser.uid,
        location: `${userData.ward}, ${userData.district}, ${userData.region}`,
        region: userData.region,
        district: userData.district,
        ward: userData.ward,
        schoolName: userData.schoolName,
        status: 'ongoing',
      });

      toast.success('Listing added successfully');

      // Reset form fields
      setListingData({
        description: '',
        numberOfWeeks: '',
        willProvideAccommodation: false,
        willProvideFinancialAssistance: false,
        startDate: null,
        endDate: null,
        deadlineForApplying: null,
        qualifications: [],
        subjects: [],
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
    <React.Fragment>
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
            width: '50%',
            maxHeight: '80%',
            overflow: 'hidden', 
            overflowY: 'auto',
            
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
          }}
        >
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <Typography variant="h6">Qualifications</Typography>
              <Autocomplete
                multiple
                options={qualificationOptions}
                value={listingData.qualifications}
                onChange={handleQualificationsChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Select Qualifications"
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <Typography variant="h6">Subjects</Typography>
              <Autocomplete
                multiple
                options={[
                  'Advance Mathematics',
                  'Basic Mathematics',
                  'English',
                  'Physics',
                  'Chemistry',
                  'Biology',
                  'Economics',
                  'Geography',
                  'Civics',
                  'General Studies',
                  'History',
                  'Islamic Knowledge',
                  'Bible Knowledge',
                  'Divinity',
                  'French',
                  'Kiswahili',
                ]}
                value={listingData.subjects}
                onChange={handleSubjectsChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Select Subjects"
                    placeholder="Subjects"
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <Typography variant="h6">Teaching Period</Typography>
              <DatePicker
                selected={listingData.startDate}
                onChange={handleStartDateChange}
                placeholderText="Select start date"
                minDate={new Date()}
                customInput={<TextField fullWidth margin="normal" />}
              />
              <DatePicker
                selected={listingData.endDate}
                onChange={handleEndDateChange}
                placeholderText="Select end date"
                minDate={listingData.startDate || new Date()}
                customInput={<TextField fullWidth margin="normal" />}
              />
              <TextField
                name="numberOfWeeks"
                type="number"
                label="Number of Weeks"
                value={listingData.numberOfWeeks}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                margin="normal"
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <Typography variant="h6">Deadline for Applying</Typography>
              <DatePicker
                selected={listingData.deadlineForApplying}
                onChange={handleDeadlineForApplyingChange}
                placeholderText="Select deadline for applying"
                minDate={new Date()}
                customInput={<TextField fullWidth margin="normal" />}
              />
            </FormControl>

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
            <FormControl sx={{ mt: 1 }} fullWidth>
              <FormControlLabel
                control={
                  <Checkbox
                    name="willProvideFinancialAssistance"
                    checked={listingData.willProvideFinancialAssistance}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Will Provide Financial Assistance"
              />
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
      <ToastContainer />
    </React.Fragment>
  );
};

export default ListingFormModal;
