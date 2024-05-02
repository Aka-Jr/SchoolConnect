import React from 'react'
import Cards from '../Components/Cards';
<<<<<<< Updated upstream
import { Badge, Typography } from '@mui/material';
=======
import { Badge, Container, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';
import NavigationBar from '../Components/NavigationBar';
>>>>>>> Stashed changes


const Home = ({user}) => {
  const newApplicationsCount = "new"
<<<<<<< Updated upstream

  return (
    <React.Fragment>
      <Typography sx={{ marginTop: '10%', marginLeft: '7%', color: '#A0826A' }}>
=======
  const date = new Date();
  
 
  if(user){
    return <Navigate to="/user" />
  }
  return (
    <React.Fragment>
    <NavigationBar />
    <Container>
    <Typography sx={{ marginTop: '10%', marginLeft: '7%', color: '#A0826A' }}>
>>>>>>> Stashed changes
        Suggested for You
        <Badge badgeContent={newApplicationsCount} color="primary" sx={{ position:'absolute', marginLeft: '0.5rem' }} />
      </Typography>

      <Cards />
    </React.Fragment >
  )
}

export default Home;