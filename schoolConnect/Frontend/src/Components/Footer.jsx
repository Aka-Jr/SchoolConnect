import { Container, Typography } from '@mui/material';
import React from 'react';

const Footer = () => {
    const date = new Date();

    return (
        <footer style={{ backgroundColor: '#0E424C', color: 'white', textAlign: 'center', padding: '1rem', marginTop: '5%', bottom: 0 }}>
            <Container>
                <Typography variant="h6">
                    School<span style={{ color: '#A0826A' }}>Connect</span> &copy; {date.getFullYear()}
                </Typography>
            </Container>
        </footer>
    );
};

export default Footer;
