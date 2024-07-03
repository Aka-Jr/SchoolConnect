import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

export default function WelcomeMessage() {
  return (
    <Container>
      <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#f5f5f5', marginBottom: '20px' }}>
        <Typography variant="h4" sx={{ color: '#333', marginBottom: '10px' }}>
          Welcome to School<span style={{ color: '#A0826A' }}>Connect</span>!
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', marginBottom: '10px' }}>
          Discover and engage in meaningful volunteering opportunities at schools near you.
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', marginBottom: '10px' }}>
          SchoolConnect connects passionate volunteers with schools in need of support. Whether you aim to share your skills, gain experience, or make a difference in your community, you're in the right place.
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', marginBottom: '10px' }}>
          <strong>Ready to get started?</strong> Explore opportunities, create your profile, and make a positive impact:
        </Typography>
        <ul>
          <Typography variant="body1" component="li" sx={{ color: '#555' }}>
            <strong>Browse Opportunities:</strong> Discover volunteer positions available in your area.
          </Typography>
          <Typography variant="body1" component="li" sx={{ color: '#555' }}>
            <strong>Register Now:</strong> Sign up to apply for roles and connect with schools.
          </Typography>
          <Typography variant="body1" component="li" sx={{ color: '#555' }}>
            <strong>Make an Impact:</strong> Support students and enhance educational experiences.
          </Typography>
        </ul>
        <Typography variant="body1" sx={{ color: '#555', marginTop: '10px' }}>
          <strong>Join us today and be a part of the change!</strong>
        </Typography>
      </Paper>
    </Container>
  );
}
