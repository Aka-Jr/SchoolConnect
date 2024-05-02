import React from 'react'
import Cards from '../Components/Cards';
import { Badge, Container, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';
import NavigationBar from '../Components/NavigationBar';


const Home = ({user}) => {
  const newApplicationsCount = "new"
  const date = new Date();
  
 
  if(user){
    return <Navigate to="/user" />
  }
  return (
    <React.Fragment>
    <NavigationBar />
    <Container>
    <Typography sx={{ marginTop: '10%', marginLeft: '7%', color: '#A0826A' }}>
        Suggested for You
        <Badge badgeContent={newApplicationsCount} color="primary" sx={{ position:'absolute', marginLeft: '0.5rem' }} />
      </Typography>

      <Cards />
    </Container>
    <Container >
    <Typography sx={{ marginTop: '5%', marginLeft: '7%', color: '#A0826A' }}>
        All
        {/* <Badge badgeContent={newApplicationsCount} color="primary" sx={{ position:'absolute', marginLeft: '0.5rem' }} /> */}
      </Typography>

      <Cards />
    </Container>
      <footer style={{backgroundColor: '#0E424C', marginTop: '5%'}}>
        <Container>
          <Typography variant="h6" style={{color: 'white', textAlign: 'center', padding: '1rem'}}>
            School<span style={{color:'#A0826A'}}>Connect</span> &copy; {date.getFullYear()}
          </Typography>
        </Container>
      </footer>
    </React.Fragment >
  )
}

export default Home;