import React from 'react';
import { Box, Card, CardContent, Grid, IconButton, Typography, CardActions, Button } from '@mui/material';
import RedeemIcon from '@mui/icons-material/Redeem';
import AssistantIcon from '@mui/icons-material/Assistant';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const Dashboard = () => {

    return (
        <React.Fragment>
            <Box>
                <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <Grid item xs={3}>
                        <Card sx={{ bgcolor: '#0E424C', textAlign: 'center' }}>
                            <Typography sx={{ color: 'white' }}>Schools Volunteered</Typography>
                            <CardContent>
                                <IconButton sx={{ color: 'white' }}>
                                    <AssistantIcon /></IconButton>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center' }}>
                                <Button sx={{ color: 'white', width: '100%' }} >View</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card sx={{ bgcolor: '#0E424C', textAlign: 'center' }}>
                            <Typography sx={{ color: 'white' }}>Submitted Applications</Typography>
                            <CardContent>
                                <IconButton sx={{ color: 'white' }}>
                                    <ArrowUpwardIcon /></IconButton>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center' }}>
                                <Button sx={{ color: 'white', width: '100%' }} >View</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card sx={{ bgcolor: '#0E424C', textAlign: 'center' }}>
                            <Typography sx={{ color: 'white' }}>Awarded Certificates</Typography>
                            <CardContent>
                                <IconButton sx={{ color: 'white' }}>
                                    <RedeemIcon /></IconButton>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center' }}>
                                <Button sx={{ color: 'white', width: '100%' }} >View</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

        </React.Fragment>
    )
}
export default Dashboard;