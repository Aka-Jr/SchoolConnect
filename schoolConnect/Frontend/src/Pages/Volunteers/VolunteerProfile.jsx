import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Divider,
  Button,
  CircularProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { auth, db, storage } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import VolunteerzDrawer from './VolunteerzDrawer';

const VolunteerProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async (uid) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null); // Reset error state on valid file selection
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      // Generate unique filename
      const fileName = `${userData.uid}_${Date.now()}_${selectedFile.name}`;
      const storageRef = ref(storage, `profilePictures/${userData.uid}/${fileName}`);
      await uploadBytes(storageRef, selectedFile);

      const downloadURL = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'users', userData.uid), { photoURL: downloadURL });

      const refreshedUserData = await getDoc(doc(db, 'users', userData.uid));
      setUserData(refreshedUserData.data());

      setSelectedFile(null);
      setIsEditMode(false);
      setError(null); // Reset error state on successful upload
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCertificateSelect = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      setSelectedFile(file);
      setError(null); // Reset error state on valid file selection
    } else {
      setError('Please select a valid PDF or image file.');
    }
  };

  const handleCertificateUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      // Generate unique filename
      const fileName = `${userData.uid}_${Date.now()}_${selectedFile.name}`;
      const storageRef = ref(storage, `certificates/${userData.uid}/${fileName}`);
      await uploadBytes(storageRef, selectedFile);

      const downloadURL = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'users', userData.uid), { certificateURL: downloadURL });

      const refreshedUserData = await getDoc(doc(db, 'users', userData.uid));
      setUserData(refreshedUserData.data());

      setSelectedFile(null);
      setIsEditMode(false);
      setError(null); // Reset error state on successful upload
    } catch (error) {
      console.error('Error uploading certificate:', error);
      setError('Failed to upload certificate. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!userData) {
    return (
      <Typography variant="h6" sx={{ color: 'white' }}>
        User not logged in
      </Typography>
    );
  }

  return (
    <React.Fragment>
      <Box>
        <Typography variant="h4" sx={{ color: 'white', textAlign: 'center', marginBottom: 2 }}>
          Hello, {userData.firstname} {userData.surname}!
        </Typography>
        {/* <Typography variant='subtitle1' sx={{ color: 'white', textAlign: 'center', marginBottom: 2 }}>Volunteer</Typography> */}
        <Grid container spacing={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Grid item>
            {isEditMode ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button component="span" variant="contained" color="primary">
                    Upload Picture
                  </Button>
                </label>
                {selectedFile && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleFileUpload}
                    sx={{ ml: 1 }}
                    disabled={uploading}
                  >
                    {uploading ? <CircularProgress size={24} /> : 'Confirm Upload'}
                  </Button>
                )}
                {error && (
                  <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
                    {error}
                  </Typography>
                )}
              </>
            ) : (
              <Avatar
                alt={`${userData.firstname} ${userData.surname}`}
                src={userData.photoURL}
                sx={{ width: 120, height: 120, cursor: 'pointer' }}
                onClick={() => window.open(userData.photoURL, '_blank')}
              />
            )}
          </Grid>
          <Grid item>
            <Tooltip title="Change Picture">
              <IconButton onClick={handleEditMode} sx={{ color: 'white' }}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 2, color: 'white' }}>Basic Details</Divider>
        <Grid container spacing={2} sx={{ color: 'white', marginTop: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">Email: <span style={{ color: '#A0826A' }}>{userData.email}</span></Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">Phone Number: <span style={{ color: '#A0826A' }}>{userData.phoneNumber}</span></Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">Age: <span style={{ color: '#A0826A' }}>{userData.age}</span></Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">Gender: <span style={{ color: '#A0826A' }}>{userData.gender}</span></Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">Marital Status: <span style={{ color: '#A0826A' }}>{userData.maritalStatus}</span></Typography>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 2, color: 'white' }}>Location Details</Divider>
        <Grid container spacing={2} sx={{ color: 'white', marginTop: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">Region: <span style={{ color: '#A0826A' }}>{userData.region}</span></Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">District: <span style={{ color: '#A0826A' }}>{userData.district}</span></Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">Ward: <span style={{ color: '#A0826A' }}>{userData.ward}</span></Typography>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 2, color: 'white' }}>Education Details</Divider>
        <Typography variant="body1" sx={{ mt: 2, color: '#A0826A', textAlign: 'center' }}>
          Education Level: <span style={{ color: '#A0826A' }}>{userData.educationLevel}</span>
        </Typography>
        <Divider sx={{ mt: 2, color: 'white' }}>Employment Status</Divider>
        <Typography variant="body1" sx={{ mt: 2, color: '#A0826A', textAlign: 'center' }}>
          Employment Status: <span style={{ color: '#A0826A' }}>{userData.employmentStatus}</span>
        </Typography>
        <Divider sx={{ mt: 2, color: 'white' }}>Certificate</Divider>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
        {userData.certificateURL ? (
    <>
      {userData.certificateURL.endsWith('.pdf') ? (
        <iframe
          src={userData.certificateURL}
          title="certificate"
          width="10%"
          height="auto"
          style={{ border: 'none', marginTop: 10 }}
        />
      ) : (
        <img
          src={userData.certificateURL}
          alt="certificate"
          style={{ width: '10%', height: 'auto', marginTop: 10, borderRadius: 5}}
        />
      )}
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => window.open(userData.certificateURL, '_blank')}
      >
        Download Certificate
      </Button>
    </>
  ) : (
    <Typography variant="body1">No certificate uploaded</Typography>
  )}
  <Box sx={{ mt: 2 }}>
    <input
      type="file"
      accept="application/pdf, image/*"
      onChange={handleCertificateSelect}
      style={{ display: 'none' }}
      id="certificate-upload"
    />
    <label htmlFor="certificate-upload">
      <Button
        component="span"
        variant="contained"
        color="primary"
        sx={{ width: '100%' }}
      >
        Update Certificate
      </Button>
    </label>
    {selectedFile && (
      <Button
        variant="contained"
        color="secondary"
        onClick={handleCertificateUpload}
        sx={{ ml: 1 }}
        disabled={uploading}
      >
        {uploading ? <CircularProgress size={24} /> : 'Confirm Upload'}
      </Button>
    )}
    {error && (
      <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
        {error}
      </Typography>
    )}
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default VolunteerProfile;
