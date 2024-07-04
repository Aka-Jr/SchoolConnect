import { Container, Typography, Box, Link } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import React from 'react';
import GooglePlayIcon from '@mui/icons-material/Google'; // You can use a custom icon for Google Play or an appropriate substitute.

const Footer = () => {
    const date = new Date();

    return (
        <footer style={{ backgroundColor: '#0E424C', color: 'white', textAlign: 'center', padding: '1rem', marginTop: '5%', bottom: 0 }}>
            <Container>
                <Typography variant="h6" gutterBottom>
                    School<span style={{ color: '#A0826A' }}>Connect</span> &copy; {date.getFullYear()}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 3, flexWrap: 'wrap' }}>
                    {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">shulekonnect@gmail.com</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">+255 783 855 338</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">+255 752 656 069</Typography>
                    </Box> */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <GooglePlayIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 20 }} />
                        <Link href="https://drive.google.com/drive/folders/1kdBesPMxii01-ayL4X700AgIpVY7tEGh?usp=sharing" target="_blank" rel="noopener" sx={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2">Get our mobile app</Typography>
                        </Link>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">Ubungo, Dar es Salaam</Typography>
                    </Box>
                </Box>
            </Container>
        </footer>
    );
};

export default Footer;
