import React from 'react'
import Cards from '../Components/Cards';
import { Badge, Container, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';
import NavigationBar from '../Components/NavigationBar';
import Footer from '../Components/Footer';

const Home = ({ user }) => {
  const newApplicationsCount = "new";


  // if (user) {
  //   // Check if the user is a volunteer

  //   return <Navigate to="/user" />;
  // }
  // // Check if the user is a school admin


  return (
    <React.Fragment>
      <NavigationBar />
      <Container>
        <Typography sx={{ marginTop: '10%', marginLeft: '7%', color: '#A0826A' }}>
          Suggested for You
          <Badge badgeContent={newApplicationsCount} color="primary" sx={{ position: 'absolute', marginLeft: '0.5rem' }} />
        </Typography>
        <Cards />
      </Container>
      <Container >
        <Typography sx={{ marginTop: '5%', marginLeft: '7%', color: '#A0826A' }}>
          All
        </Typography>
        <Cards />

      </Container>
      <Footer />
    </React.Fragment>
  )
}

export default Home;
