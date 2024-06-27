import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../firebaseConfig';
import { setDoc, doc } from "firebase/firestore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Input, Typography, Box, FormControl, MenuItem, Select as MUISelect, RadioGroup, Radio, FormControlLabel, Grid, Divider, Checkbox } from '@mui/material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import Select from 'react-select';
import Districts from './../assets/Districts.json';
import Wards from './../assets/Wards.json';
import { useNavigate } from 'react-router-dom';

const SchoolSignupForm = ({ handleSwitchForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    schoolName: '',
    registrationNumber: '',
    phoneNumber: '',
    region: '',
    district: '',
    ward: '',
    street: '',
    isBoarding: '',
    numberOfStudents: '',
    schoolType: '',
    genderComposition: '',
    isPrivate: '',
    isReligious: '',
    religion: '',
    termsAccepted: false
  });

  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const navigate = useNavigate();

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
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSelectChange = (name, option) => {
    setFormData({ ...formData, [name]: option.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      email, password, confirmPassword, schoolName, registrationNumber,
      phoneNumber, region, district, ward, street, isBoarding, numberOfStudents,
      schoolType, genderComposition, isPrivate, isReligious, religion, termsAccepted
    } = formData;

    // Form validation
    const validationErrors = {};


    if (!registrationNumber) {
      validationErrors.registrationNumber = 'School regisration number is required.';
    }

    if (!schoolName) {
      validationErrors.schoolName = 'School name is required.';
    }

    if (!region) {
      validationErrors.region = 'Please select region.';
    }

    if (!district) {
      validationErrors.district = 'Please select district.';
    }

    if (!ward) {
      validationErrors.ward = 'Please select ward.';
    }




    if (!email) {
      validationErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Invalid email format.';
    }

    if (!phoneNumber) {
      validationErrors.phoneNumber = 'Phone number is required.';
    }

    // if (!isReligious) {
    //   validationErrors.isReligious = 'Please select if a school is religious or not.';
    // }

    if (!genderComposition) {
      validationErrors.genderComposition = 'Please select gender composition.';
    }



    if (!numberOfStudents) {
      validationErrors.numberOfStudents = 'Number of students is required.';
    } else if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(numberOfStudents)) {
      validationErrors.numberOfStudents = 'Number of students can not be negative .';
    }

    if (!password) {
      validationErrors.password = 'Password is required.';
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password)) {
      validationErrors.password = 'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one digit.';
    }

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!termsAccepted) {
      validationErrors.termsAccepted = 'You must accept the terms and conditions.';
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
        schoolName,
        registrationNumber,
        phoneNumber,
        region,
        district,
        ward,
        street,
        isBoarding,
        numberOfStudents,
        schoolType,
        genderComposition,
        isPrivate,
        isReligious,
        religion,
        uid: userId
      };

      // Add the user data to the 'schools' collection in Firestore
      await setDoc(doc(db, "schools", userId), userData);

      // Clear form inputs
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        schoolName: '',
        registrationNumber: '',
        phoneNumber: '',
        region: '',
        district: '',
        ward: '',
        street: '',
        isBoarding: '',
        numberOfStudents: '',
        schoolType: '',
        genderComposition: '',
        isPrivate: '',
        isReligious: '',
        religion: '',
        termsAccepted: false

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
    <React.Fragment>
    <div>
      <Box>
        {/* <LocalLibraryIcon />
        <Typography variant="h6">
          School<span style={{ color: '#A0826A' }}>Connect</span>
        </Typography> */}
        <Box sx={{ mt: 2, padding: '5%' }}>
          <Input
            type='text'
            name='schoolName'
            placeholder="School Name"
            sx={{ width: '100%' }}
            value={formData.schoolName}
            onChange={handleChange}
          />
          <Grid container spacing={4} sx={{ marginBottom: '5%' }}>

            <Grid item xs={6}>

              <Input
                type='text'
                name='registrationNumber'
                placeholder="Registration Number"
                sx={{ width: '100%', mt: 2 }}
                value={formData.registrationNumber}
                onChange={handleChange}
              />

            </Grid>

            <Grid item xs={6}>
              <Input
                type='text'
                name='phoneNumber'
                placeholder="Phone Number"
                sx={{ width: '100%', mt: 2 }}
                value={formData.phoneNumber}
                onChange={handleChange}
              />

            </Grid>
          </Grid>

          <Box sx={{ mt: 2, gap: '5%' }} >
            <Select
              name="region"
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
                  name="district"
                  placeholder="Select District"
                  options={districts}
                  value={formData.district ? { label: formData.district, value: formData.district } : null}
                  onChange={option => handleSelectChange('district', option)}
                  sx={{ width: '100%', mt: 2 }}
                />
              </Grid>

              <Grid item xs={6} sx={{ mt: 2 }}>
                <Select
                  name="ward"
                  placeholder="Select Ward"
                  options={wards}
                  value={formData.ward ? { label: formData.ward, value: formData.ward } : null}
                  onChange={option => handleSelectChange('ward', option)}
                  sx={{ width: '100%', mt: 2 }}
                />
              </Grid>
            </Grid>
            <Input
              type='text'
              name='street'
              placeholder="Street Address"
              sx={{ width: '100%', mt: 2 }}
              value={formData.street}
              onChange={handleChange}
            />

          </Box>


          {/* <FormControl fullWidth sx={{ mt: 2 }}>
          <MUISelect
            value={formData.schoolType}
            onChange={handleChange}
            name="schoolType"
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select School Type
            </MenuItem>
            <MenuItem value="Public">Public</MenuItem>
            <MenuItem value="Private">Private</MenuItem>
          </MUISelect>
        </FormControl> */}

          {/* <Divider sx={{ mt: 2 }}><Typography variant='h6'>School Category</Typography></Divider> */}


          <FormControl fullWidth sx={{ mt: 2 }}>
            <MUISelect
              value={formData.isPrivate}
              onChange={handleChange}
              name="isPrivate"
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select School Type
              </MenuItem>
              <MenuItem value="No">Public</MenuItem>
              <MenuItem value="Yes">Private</MenuItem>
            </MUISelect>
          </FormControl>

          {formData.isPrivate === 'Yes' && (
            <>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <MUISelect
                  value={formData.isReligious}
                  onChange={handleChange}
                  name="isReligious"
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Is the school religious?
                  </MenuItem>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </MUISelect>
              </FormControl>

              {formData.isReligious === 'Yes' && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <MUISelect
                    value={formData.religion}
                    onChange={handleChange}
                    name="religion"
                    displayEmpty

                  >
                    <MenuItem value="" disabled>
                      Select Religion
                    </MenuItem>
                    <MenuItem value="Islamic">Islamic</MenuItem>
                    <MenuItem value="Christianity">Christianity</MenuItem>
                  </MUISelect>
                </FormControl>
              )}
            </>
          )}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <MUISelect
              value={formData.isBoarding}
              onChange={handleChange}
              name="isBoarding"
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Boarding Status
              </MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </MUISelect>
          </FormControl>
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Gender Composition:</Typography>
            <RadioGroup
              aria-label="genderComposition"
              name="genderComposition"
              value={formData.genderComposition}
              onChange={handleChange}
            >
              <FormControlLabel value="Mixed" control={<Radio />} label="Mixed" />
              <FormControlLabel value="Boys" control={<Radio />} label="Boys" />
              <FormControlLabel value="Girls" control={<Radio />} label="Girls" />
            </RadioGroup>
          </FormControl>
          <Input
            type='number'
            name='numberOfStudents'
            placeholder="Number of Students"
            sx={{ width: '100%', mt: 2 }}
            value={formData.numberOfStudents}
            inputProps={{ inputProps: { min: 0 } }}
            onChange={handleChange}
          />
          <Input
            type='email'
            name='email'
            placeholder="Email"
            sx={{ width: '100%', mt: 2 }}
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            type='password'
            name='password'
            placeholder="Password"
            sx={{ width: '100%', mt: 2 }}
            value={formData.password}
            onChange={handleChange}
          />
          <Input
            type='password'
            placeholder="Confirm Password"
            sx={{ width: '100%', mt: 2 }}
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
              />
            }
            label="I accept the terms and conditions"
            sx={{ mt: 2 }}
          />
        </Box>
        <Button variant='contained' sx={{ width: '100%', bgcolor: '#A0826A' }} onClick={handleSubmit}>
          Register
        </Button>
        
      </Box>
      </div>

      {/* <ToastContainer /> */}
    </React.Fragment>
  );
};

export default SchoolSignupForm;
