import React, { useState, useEffect } from 'react';
import { Button, Input, Typography, Box,Grid, FormControl, RadioGroup, FormControlLabel, Radio, MenuItem, Select as MUISelect, Divider } from '@mui/material';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../firebaseConfig';
import { setDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import Districts from './../assets/Districts.json';
import Wards from './../assets/Wards.json';

const VolunteerSignupForm = ({ handleSwitchForm }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    gender: '',
    age: '',
    maritalStatus: '',
    educationLevel: '',
    employmentStatus: '',
    region: '',
    district: '',
    ward: ''
  });

  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (formData.region) {
      const regionDistricts = Districts.features
        .filter(d => d.properties.region === formData.region)
        .map(d => ({ label: d.properties.District, value: d.properties.District }));
      setDistricts(regionDistricts);
      setFormData({ ...formData, district: '', ward: '' }); // Reset district and ward
    }
  }, [formData.region]);

  useEffect(() => {
    if (formData.district) {
      const districtWards = Wards.features
        .filter(w => w.properties.District === formData.district)
        .map(w => ({ label: w.properties.Ward, value: w.properties.Ward }));
      setWards(districtWards);
      setFormData({ ...formData, ward: '' }); // Reset ward
    }
  }, [formData.district]);


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSelectChange = (id, option) => {
    setFormData({ ...formData, [id]: option.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstname, surname, email, region, district, ward, password, confirmPassword, phoneNumber, gender, age, maritalStatus, educationLevel, employmentStatus, } = formData;

    // Form validation
    const validationErrors = {};

    if (!firstname) {
      validationErrors.firstname = 'First name is required.';
    }

    if (!surname) {
      validationErrors.surname = 'Surname is required.';
    }

    if (!phoneNumber) {
      validationErrors.phoneNumber = 'Phone number is required.';
    }

    if (!age) {
      validationErrors.age = 'Your age is required.';
    } else if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(age)) {
      validationErrors.age = 'Number of students can not be negative .';
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
      // Create user account with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Get the Firebase user ID
      const userId = userCredential.user.uid;

      // Define the data object to be stored in Firestore
      const userData = {
        email,
        userType: 'volunteer',
        uid: userId,
        firstname,
        surname,
        phoneNumber,
        gender,
        age,
        maritalStatus,
        educationLevel,
        employmentStatus,
        region,
        district,
        ward
      };

      // Add to 'volunteers' collection
      await setDoc(doc(db, "users", userId), userData);

      // Clear form inputs
      setFormData({
        firstname: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        gender: '',
        age: '',
        maritalStatus: '',
        educationLevel: '',
        employmentStatus: '',
        region: '',
        district: '',
        ward: ''
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
    <Box>
    <Divider sx={{ mt: 2, color: '#0E424C'}}><Typography>Basic Information</Typography></Divider>
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
      <Input
        type='text'
        id='phoneNumber'
        placeholder="Phone Number"
        sx={{ width: '100%', mt: 2 }}
        value={formData.phoneNumber}
        onChange={handleChange}
      />
      <Input
        type='email'
        id='email'
        placeholder="Email"
        sx={{ width: '100%', mt: 2 }}
        value={formData.email}
        onChange={handleChange}
      />
      <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
      <Divider sx={{ mt: 2, color: '#0E424C'}}><Typography>Gender</Typography></Divider>
        <RadioGroup
          row
          aria-label="gender"
          id="gender"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
        >
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
      </FormControl>
      <Input
        type='number'
        id='age'
        placeholder="Age"
        sx={{ width: '100%', mt: 2 }}
        value={formData.age}
        onChange={handleChange}
      />

      <FormControl fullWidth sx={{ marginBottom: '16px', mt: 2 }}>
      <Divider sx={{ mt: 2, color: '#0E424C'}}><Typography>Marital Status</Typography></Divider>
        <MUISelect
          value={formData.maritalStatus}
          onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
          id="maritalStatus"
          displayEmpty
        >
          <MenuItem value="single">Single</MenuItem>
          <MenuItem value="married">Married</MenuItem>
        </MUISelect>
      </FormControl>

      <FormControl fullWidth sx={{ marginBottom: '16px'}}>
        <Divider sx={{ mt: 2, color: '#0E424C'}}><Typography>Education Level</Typography></Divider>
        <MUISelect
          value={formData.educationLevel}
          onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
          id="educationLevel"
          displayEmpty
        >
          <MenuItem value="Diploma">Diploma</MenuItem>
          <MenuItem value="Bachelor">Bachelor</MenuItem>
        </MUISelect>
      </FormControl>

      <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
      <Divider sx={{ mt: 2, color: '#0E424C'}}><Typography>Employment Status</Typography></Divider>
        <RadioGroup
          row
          aria-label="employmentStatus"
          id="employmentStatus"
          value={formData.employmentStatus}
          onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
        >
          <FormControlLabel value="employed" control={<Radio />} label="Employed" />
          <FormControlLabel value="unemployed" control={<Radio />} label="Unemployed" />
        </RadioGroup>
      </FormControl>
      <Divider sx={{ mt: 2, color: '#0E424C'}} ><Typography>Demographic Information</Typography></Divider>
      <Box sx={{ mt: 2, gap: '5%' }} >
            <Select
              id="region"
              placeholder="Select Region"
              options={Districts.features
                .map(d => d.properties.region)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map(region => ({ label: region, value: region }))}
              value={formData.region ? { label: formData.region, value: formData.region } : null}
              onChange={option => handleSelectChange('region', option)}
              sx={{ width: '100%', mt: 2, }}
            />

            <Grid container spacing={4} >

              <Grid item xs={6} sx={{ mt: 2 }}>
                <Select
                  id="district"
                  placeholder="Select District"
                  options={districts}
                  value={formData.district ? { label: formData.district, value: formData.district } : null}
                  onChange={option => handleSelectChange('district', option)}
                  sx={{ width: '100%', mt: 2 }}
                />
              </Grid>

              <Grid item xs={6} sx={{ mt: 2 }}>
                <Select
                  id="ward"
                  placeholder="Select Ward"
                  options={wards}
                  value={formData.ward ? { label: formData.ward, value: formData.ward } : null}
                  onChange={option => handleSelectChange('ward', option)}
                  sx={{ width: '100%', mt: 2 }}
                />
              </Grid>
            </Grid>

          </Box>
      
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
      <Button variant='contained' sx={{ width: '100%', bgcolor: '#A0826A', mt: 2 }} onClick={handleSubmit}>
        Register
      </Button>
    </Box>
    
    </div>
  );
};

export default VolunteerSignupForm;
