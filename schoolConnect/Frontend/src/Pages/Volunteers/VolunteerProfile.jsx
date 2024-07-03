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
  Collapse,
  Paper,
  Modal,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { auth, db, storage } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const VolunteerProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sections, setSections] = useState({
    basicDetails: true,
    locationDetails: false,
    educationDetails: false,
    employmentStatus: false,
    certificate: false,
  });

  const [formData, setFormData] = useState({
    firstname: '',
    surname: '',
    phoneNumber: '',
    region: '',
    district: '',
    ward: '',
    educationLevel: '',
    aboutMe: '',
    institution: '',
    fieldOfStudy: '',
    employmentStatus: '',
    position: '',
    company: '',
  });

  useEffect(() => {
    const fetchUserData = async (uid) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setFormData(userDoc.data());
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
      setError(null);
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const fileName = `${userData.uid}_${Date.now()}_${selectedFile.name}`;
      const storageRef = ref(storage, `profilePictures/${userData.uid}/${fileName}`);
      await uploadBytes(storageRef, selectedFile);

      const downloadURL = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'users', userData.uid), { photoURL: downloadURL });

      const refreshedUserData = await getDoc(doc(db, 'users', userData.uid));
      setUserData(refreshedUserData.data());

      setSelectedFile(null);
      setIsEditMode(false);
      setError(null);
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
      setError(null);
    } else {
      setError('Please select a valid PDF or image file.');
    }
  };

  const handleCertificateUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const fileName = `${userData.uid}_${Date.now()}_${selectedFile.name}`;
      const storageRef = ref(storage, `certificates/${userData.uid}/${fileName}`);
      await uploadBytes(storageRef, selectedFile);

      const downloadURL = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'users', userData.uid), { certificateURL: downloadURL });

      const refreshedUserData = await getDoc(doc(db, 'users', userData.uid));
      setUserData(refreshedUserData.data());

      setSelectedFile(null);
      setIsEditMode(false);
      setError(null);
    } catch (error) {
      console.error('Error uploading certificate:', error);
      setError('Failed to upload certificate. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'users', userData.uid), formData);
      setUserData({ ...userData, ...formData });
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Failed to update user data. Please try again.');
    }
  };

  const toggleSection = (section) => {
    setSections((prevSections) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!userData) {
    return (
      <Typography variant="h6" sx={{ color: 'black' }}>
        User not logged in
      </Typography>
    );
  }

  return (
    <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 2 }}>
      {/* <Typography variant="h4" sx={{ color: 'black', textAlign: 'center', marginBottom: 2 }}>
        Hello, {userData.firstname} {userData.surname}!
      </Typography> */}
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
            <div>
      <Avatar
        alt={`${userData.firstname} ${userData.surname}`}
        src={userData.photoURL}
        sx={{ width: 120, height: 120, cursor: 'pointer' }}
        onClick={handleAvatarClick}
      />
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="full-image-modal"
        aria-describedby="displaying-full-image"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            // bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxWidth: '50%',
            maxHeight: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img
            src={userData.photoURL}
            alt={`${userData.firstname} ${userData.surname}`}
            style={{ maxWidth: '50%', maxHeight: '50%' }}
          />
        </Box>
      </Modal>
    </div>
          )}
        </Grid>
        <Grid item>
          <Tooltip title="Edit Profile" arrow>
            <IconButton color="primary" onClick={handleEditMode}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2, borderColor: 'black' }} />
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" onClick={() => toggleSection('basicDetails')} sx={{ cursor: 'pointer' }}>
          Basic Details {sections.basicDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Typography>
        <Collapse in={sections.basicDetails}>
          <Grid container spacing={2} sx={{ color: 'black', marginTop: 2 }}>
            {isEditMode ? (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    id="firstname"
                    label="First Name"
                    value={formData.firstname}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    id="surname"
                    label="Surname"
                    value={formData.surname}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    id="phoneNumber"
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    id="email"
                    label="Email"
                    value={userData ? userData.email : ''}
                    // For email, it's usually read-only
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1">First Name: <span style={{ color: '#A0826A' }}>{userData.firstname}</span></Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1">Surname: <span style={{ color: '#A0826A' }}>{userData.surname}</span></Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1">Phone Number: <span style={{ color: '#A0826A' }}>{userData.phoneNumber}</span></Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1">Email: <span style={{ color: '#A0826A' }}>{userData.email}</span></Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Collapse>
      </Paper>
      <Paper sx={{ mt: 2, p: 2 }}>
        <Typography variant="h6" onClick={() => toggleSection('locationDetails')} sx={{ cursor: 'pointer' }}>
          Location Details {sections.locationDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Typography>
        <Collapse in={sections.locationDetails}>
          <Grid container spacing={2} sx={{ color: 'black', marginTop: 2 }}>
            {isEditMode ? (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    id="region"
                    label="Region"
                    value={formData.region}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    id="district"
                    label="District"
                    value={formData.district}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    id="ward"
                    label="Ward"
                    value={formData.ward}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1">Region: <span style={{ color: '#A0826A' }}>{userData.region}</span></Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1">District: <span style={{ color: '#A0826A' }}>{userData.district}</span></Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1">Ward: <span style={{ color: '#A0826A' }}>{userData.ward}</span></Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Collapse>
      </Paper>
      <Paper sx={{ mt: 2, p: 2 }}>
        <Typography variant="h6" onClick={() => toggleSection('educationDetails')} sx={{ cursor: 'pointer' }}>
          Education Details {sections.educationDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Typography>
        <Collapse in={sections.educationDetails}>
          <Grid container spacing={2} sx={{ color: 'black', marginTop: 2 }}>
            {isEditMode ? (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    id="educationLevel"
                    label="Highest Education Level"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    id="institution"
                    label="Institution"
                    value={formData.institution}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    id="fieldOfStudy"
                    label="Field of Study"
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    id="aboutMe"
                    label="Short about Me"
                    value={formData.aboutMe}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1">Highest Education Level: <span style={{ color: '#A0826A' }}>{userData.educationLevel}</span></Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1">Institution: <span style={{ color: '#A0826A' }}>{userData.institution}</span></Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1">Field of Study: <span style={{ color: '#A0826A' }}>{userData.fieldOfStudy}</span></Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1">Short about Me: <span style={{ color: '#A0826A' }}>{userData.aboutMe}</span></Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Collapse>
      </Paper>
      <Paper sx={{ mt: 2, p: 2 }}>
        <Typography variant="h6" onClick={() => toggleSection('employmentStatus')} sx={{ cursor: 'pointer' }}>
          Employment Status {sections.employmentStatus ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Typography>
        <Collapse in={sections.employmentStatus}>
          <Grid container spacing={2} sx={{ color: 'black', marginTop: 2 }}>
            {isEditMode ? (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    id="employmentStatus"
                    label="Employment Status"
                    value={formData.employmentStatus}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    id="position"
                    label="Position"
                    value={formData.position}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    id="company"
                    label="Company"
                    value={formData.company}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1">Employment Status: <span style={{ color: '#A0826A' }}>{userData.employmentStatus}</span></Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1">Position: <span style={{ color: '#A0826A' }}>{userData.position}</span></Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1">Company: <span style={{ color: '#A0826A' }}>{userData.company}</span></Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Collapse>
      </Paper>
      <Paper sx={{ mt: 2, p: 2 }}>
        <Typography variant="h6" onClick={() => toggleSection('certificate')} sx={{ cursor: 'pointer' }}>
          Certificate {sections.certificate ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Typography>
        <Collapse in={sections.certificate}>
          <Grid container spacing={2} sx={{ color: 'black', marginTop: 2 }}>
            {userData.certificateURL ? (
              <Grid item xs={12}>
                <Typography variant="body1">
                  <a href={userData.certificateURL} target="_blank" rel="noopener noreferrer">
                    View Certificate
                  </a>
                </Typography>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ color: '#A0826A' }}>
                  No certificate uploaded.
                </Typography>
              </Grid>
            )}
            {isEditMode && (
              <Grid item xs={12}>
                <input
                  type="file"
                  accept="application/pdf, image/*"
                  onChange={handleCertificateSelect}
                  style={{ display: 'none' }}
                  id="certificate-upload"
                />
                <label htmlFor="certificate-upload">
                  <Button component="span" variant="contained" color="primary">
                    Upload Certificate
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
              </Grid>
            )}
          </Grid>
        </Collapse>
      </Paper>
      {isEditMode && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
          fullWidth
        >
          Save Changes
        </Button>
      )}
    </Box>
  );
};

export default VolunteerProfile;
