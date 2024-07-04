import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigationBar from '../Components/NavigationBar';
import Footer from '../Components/Footer';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
      e.preventDefault();
      // Handle form submission, e.g., send the data to a server or email service
      toast.success('Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
  };

  return (
     
     <React.Fragment>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavigationBar />
        <Container component="main" sx={{ flex: '1 0 auto', marginTop: '5%' }}>
        <Typography variant="h4" gutterBottom>Contact Us</Typography>
          <Typography variant="body1" gutterBottom>
              If you have any questions, feel free to reach out to us. We'd love to hear from you!
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 20 }} />
                  <Typography variant="body1">support@schoolconnect.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 20 }} />
                  <Typography variant="body1">+255 783 855 338</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 20 }} />
                  <Typography variant="body1">+255 752 656 069</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 20 }} />
                  <Typography variant="body1">Ubungo, Dar es Salaam</Typography>
              </Box>
          </Box>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
              <TextField
                  fullWidth
                  variant="outlined"
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ mb: 2 }}
              />
              <TextField
                  fullWidth
                  variant="outlined"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2 }}
              />
              <TextField
                  fullWidth
                  variant="outlined"
                  label="Message"
                  multiline
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" endIcon={<SendIcon />}>
                  Send Message
              </Button>
          </Box>
          
        </Container>
        <Footer />
      </Box>
      <ToastContainer />
    </React.Fragment>
  );
};

export default ContactUs;
