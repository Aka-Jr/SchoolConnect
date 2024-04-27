import React, { useState, useEffect } from 'react';
import { Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import HomeIcon from '@mui/icons-material/Home';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import LoginIcon from '@mui/icons-material/Login';
import SignUpIcon from '@mui/icons-material/PersonAdd';
import { useLocation } from 'react-router-dom';

const SideBar = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const location = useLocation();
    const Pages = ['Home', 'AboutUs', 'ContactUs', 'Login', 'SignUp'];
    const Icons = {
        'Home': <HomeIcon />,
        'AboutUs': <InfoIcon />,
        'ContactUs': <ContactPageIcon />,
        'Login': <LoginIcon />,
        'SignUp': <SignUpIcon />
    };
    const [selectedPage, setSelectedPage] = useState('Home');

    useEffect(() => {
        // Find the current page based on the route path
        const currentPage = Pages.find(page => `/${page.toLowerCase().replace(/\s/g, '-')}` === location.pathname.toLowerCase());
        setSelectedPage(currentPage || 'Home'); // Set the selected page
    }, [location.pathname, Pages]);

    return (
        <React.Fragment>
            <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} sx={{}}>
                <List>
                    {Pages.map((page, index) => (
                        <ListItemButton
                            key={index}
                            component="a"
                            href={`/${page.toLowerCase().replace(/\s/g, '-')}`}
                            selected={selectedPage === page}
                        >
                            <ListItemIcon sx={{ color: '#A0826A' }}>
                                {Icons[page]}
                            </ListItemIcon>
                            <ListItemText sx={{ color: '#0E424C' }}>
                                {page}
                            </ListItemText>
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>
            <IconButton onClick={() => setOpenDrawer(!openDrawer)} sx={{ marginLeft: 'auto', color: 'white' }}>
                <MenuIcon />
            </IconButton>
        </React.Fragment>
    );
}

export default SideBar;
