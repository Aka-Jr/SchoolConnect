import React from 'react'
import Cards from '../Components/Cards';
import { Badge, Typography } from '@mui/material';


const Home = () => {
  const newApplicationsCount = "new"

  return (
    <React.Fragment>
      <Typography sx={{ marginTop: '10%', marginLeft: '7%', color: '#A0826A' }}>
        Suggested for You
        <Badge badgeContent={newApplicationsCount} color="primary" sx={{ position:'absolute', marginLeft: '0.5rem' }} />
      </Typography>

      <Cards />
    </React.Fragment >
  )
}

export default Home;