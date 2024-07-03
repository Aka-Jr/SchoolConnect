import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import NavigationBar from '../Components/NavigationBar';
import Footer from '../Components/Footer';
import WelcomeMessage from '../Components/WelcomeMesaage';
import Cards from '../Components/Cards';
import VolunteersCard from './Volunteers/VolunteersCard';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Home = () => {
  const [userType, setUserType] = useState(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const checkUserType = async (uid) => {
      const schoolDoc = await getDoc(doc(db, 'schools', uid));
      if (schoolDoc.exists()) {
        setUserType('school');
        return;
      }
      const volunteerDoc = await getDoc(doc(db, 'volunteers', uid));
      if (volunteerDoc.exists()) {
        setUserType('volunteer');
        return;
      }
      setUserType(null);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        checkUserType(user.uid);
      } else {
        setUserType(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavigationBar />
        <Container component="main" sx={{ flex: '1 0 auto', marginTop: '5%' }}>
          {!userType && <WelcomeMessage />}
          <Typography variant="h5" sx={{ color: '#A0826A', marginLeft: '7%', marginBottom: '20px' }}>
            {userType === 'school'
              ? 'Discover Available Volunteers'
              : 'Discover Available Volunteering Opportunities'}
          </Typography>
          {userType === 'school' ? <VolunteersCard /> : <Cards />}
        </Container>
        <Footer />
      </Box>
    </React.Fragment>
  );
};

export default Home;
