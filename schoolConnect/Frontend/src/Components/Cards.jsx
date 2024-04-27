import * as React from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, IconButton, Box, Container } from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Schools from '../assets/Schools.json';

const Cards = () => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const handleNextClick = () => {
        setCurrentIndex(currentIndex + 1);
    };

    const handlePreviousClick = () => {
        setCurrentIndex(currentIndex - 1);
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', width: '100%' }}>
                {Schools.slice(currentIndex, currentIndex + 3).map((school, index) => (
                    <Card key={index} sx={{ maxWidth: 250, bgcolor: '#0E424C', height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '3%' }}>
                            <CardMedia
                                component='img'
                                alt='school logo'
                                height='140'
                                image={school.logo}
                                sx={{ height: '100px', width: '100px', borderRadius: '50%' }}
                            />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, height: '200px', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant='h5' sx={{ color: 'white', textAlign: 'center' }}>
                                    {school.name}
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'white', textAlign: 'center', marginBottom: '5%', marginTop: '5%' }}>
                                    {school.need}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'white', fontSize: 'small' }}>
                                <IconButton sx={{ color: 'white' }}><LocationOnIcon /></IconButton>
                                <Typography variant='subtitle'>{school.location}</Typography>
                                <IconButton sx={{ color: 'white', marginLeft: '10%' }}><AccessAlarmIcon /></IconButton>
                                <Typography variant='subtitle'>{school.duration}</Typography>
                            </Box>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'center' }}>
                            <Button variant='contained' sx={{ textAlign: 'center', width: '100%', bgcolor: '#A0826A' }}>Apply</Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', width: '100%' }}>
                <Button variant='contained' onClick={handlePreviousClick} disabled={currentIndex === 0}>Previous</Button>
                <Button variant='contained' onClick={handleNextClick} disabled={currentIndex + 3 >= Schools.length}>Next</Button>
            </Box>
        </Container>
    );
}

export default Cards;
