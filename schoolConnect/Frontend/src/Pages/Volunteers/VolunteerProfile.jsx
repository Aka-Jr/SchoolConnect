import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Button, Typography, Box, CircularProgress, Grid, Avatar, Divider } from '@mui/material';

const VolunteerProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async (uid) => {
      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
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

  if (loading) {
    return <CircularProgress />;
  }

  if (!userData) {
    return <Typography variant="h6" sx={{color: 'white'}}>User not logged in</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{color: 'white', left: 'auto'}}>Welcome, {userData.firstname} {userData.surname}</Typography>
      <Grid container spacing={2} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Grid item >
          <Avatar
            alt={`${userData.firstname} ${userData.surname}`}
            src={userData.photoURL}
            sx={{ width: 100, height: 100 }}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => window.open(userData.photoURL, '_blank')}>
            View Profile Picture
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{mt: 2, color: 'white'}} >Basic Details</Divider>

      <Grid container spacing={2} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
        <Grid item xs='3'>
        <Typography variant="h6">Email: <span style={{color: '#A0826A'}}>{userData.email}</span></Typography>
        </Grid>
        <Grid item xs='3'>
        <Typography variant="h6">Phone Number: <span style={{color: '#A0826A'}}>{userData.phoneNumber}</span></Typography>
        </Grid>
        <Grid item xs='3'>
        <Typography variant="h6">Age: <span style={{color: '#A0826A'}}>{userData.age}</span></Typography>
        </Grid>
        <Grid item xs='3'>
        <Typography variant="h6">Gender: <span style={{color: '#A0826A'}}>{userData.gender}</span></Typography>
        </Grid>
        <Grid item xs='12'>
        <Typography variant="h6" sx={{display: 'flex', mt: '2', alignItems: 'center', justifyContent: 'center'}}>Marital Status: <span style={{color: '#A0826A'}}>{userData.maritalStatus}</span></Typography>
        </Grid>

        <Grid item xs='4' sx={{mt: 2, color: 'white'}}>
        <Typography variant="h6">Region: <span style={{color: '#A0826A'}}>{userData.region}</span></Typography>
        </Grid>

        <Grid item xs='4'>
        <Typography variant="h6">District: <span style={{color: '#A0826A'}}>{userData.district}</span></Typography>
        </Grid>

        <Grid item xs='4'>
        <Typography variant="h6">Ward: <span style={{color: '#A0826A'}}>{userData.ward}</span></Typography>
        </Grid>
      </Grid>
      <Divider sx={{mt: 2, color: 'white'}} >Education Details</Divider>
      <Typography variant="h6" sx={{mt: 2, color: '#A0826A', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Education Level: <span style={{color: '#A0826A'}}>{userData.educationLevel}</span></Typography>

      <Divider sx={{mt: 2, color: 'white'}} >Employment Status</Divider>
      <Typography variant="h6" sx={{mt: 2, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Employment Status: <span style={{color: '#A0826A'}}>{userData.employmentStatus}</span></Typography>
      
      <Box sx={{ mt: 2, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {userData.certificateURL ? (
          <>
            <Typography variant="h6">Uploaded Certificate:</Typography>
            {userData.certificateURL.endsWith('.pdf') ? (
              <iframe
                src={userData.certificateURL}
                title="certificate"
                width="100%"
                height="10%"
                style={{ border: 'none' }}
              />
            ) : (
              <img
                src={userData.certificateURL}
                alt="certificate"
                style={{ width: '10%', height: 'auto', right:'10%'}}
              />
            )}
            <Button
              variant="contained"
              sx={{ mt: 2, left: '10%'}}
              onClick={() => window.open(userData.certificateURL, '_blank')}
            >
              Download Certificate
            </Button>
          </>
        ) : (
          <Typography variant="h6">No certificate uploaded</Typography>
        )}
      </Box>
    </Box>
  );
};

export default VolunteerProfile;
