import React from 'react';
import { Typography, Grid, Paper, Box, Container } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from '../Components/Footer';
import NavigationBar from '../Components/NavigationBar';

const AboutUs = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
  };

  return (
    <React.Fragment>
    <NavigationBar />

    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container component="main" sx={{ flex: '1 0 auto' }}>
        <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
          

          <Slider {...sliderSettings} sx={{ width: '100%', mx: 'auto', mb: 4 }}>
            <div>
              <div style={{ position: 'relative' }}>
                <img src="Mbande.jpg" alt="Slide 1" style={{ width: '100%', height: 'auto' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#0E424C', opacity: 0.7 }} />
              </div>
            </div>
            <div>
              <div style={{ position: 'relative' }}>
                <img src="ClassRoom.jpg" alt="Slide 2" style={{ width: '100%', height: 'auto' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#0E424C', opacity: 0.7 }} />
              </div>
            </div>
            <div>
              <div style={{ position: 'relative' }}>
                <img src="ClassRoom.jpg" alt="Slide 3" style={{ width: '100%', height: 'auto' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#0E424C', opacity: 0.7 }} />
              </div>
            </div>
            {/* Add more images as needed */}
          </Slider>

          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Our Vision
                </Typography>
                <Typography variant="body1">
                  Insert your vision statement here. This could be a brief description of what your organization aims to achieve.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Our Mission
                </Typography>
                <Typography variant="body1">
                  Insert your mission statement here. Describe the purpose and goals of your organization, focusing on how you plan to achieve your vision.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Footer />

    </Box>
    </React.Fragment>
  );
};

export default AboutUs;
