import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tabs, Tab, Button, useMediaQuery, useTheme } from '@mui/material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import SearchIcon from '@mui/icons-material/Search';
import SideBar from './SideBar';
import { Link, useLocation } from 'react-router-dom';

const NavigationBar = () => {
    const [value, setValue] = useState(0);
    const theme = useTheme();
    const isMatch = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();

    const Pages = ['Home', 'AboutUs', 'ContactUs']; // Update page names to match route paths

    useEffect(() => {
        // Find the index of the current route path in the Pages array
        const index = Pages.findIndex(page => `/${page}` === location.pathname);
        setValue(index !== -1 ? index : 0); // Set the selected tab index
    }, [location.pathname, Pages]);

    return (
        <React.Fragment>
            <AppBar position="fixed" sx={{ bgcolor: '#0E424C', borderRadius: '50px' }}>
                <Toolbar>
                    <IconButton>
                        <LocalLibraryIcon sx={{ color: 'white' }} />
                    </IconButton>
                    <Typography variant="h6">School<span style={{color:'#A0826A'}}>Connect</span></Typography>
                    {isMatch ? (
                        <>
                            <SideBar />
                        </>
                    ) : (
                        <>
                            <Tabs sx={{ marginLeft: '10%' }} value={value} indicatorColor="primary" onChange={(e, value) => setValue(value)}>
                                {Pages.map((page, index) => (
                                    <Tab key={index} label={page} component={Link} to={`/${page}`} sx={{ color: 'white' }} />
                                ))}
                            </Tabs>
                            <IconButton sx={{ marginLeft: 'auto' }}>
                                <SearchIcon sx={{ color: 'white' }} />
                            </IconButton>
                            <Button sx={{ marginLeft: 'auto', color: 'white' }}>Login</Button>
                            <Button sx={{ color: 'white' }}>SignUp</Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

export default NavigationBar;
