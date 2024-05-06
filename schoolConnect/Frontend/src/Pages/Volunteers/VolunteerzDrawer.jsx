import React , { useState, useEffect }  from 'react';
import { auth } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import {
    Box,
    IconButton, Typography, Button, AppBar,
    Toolbar, Drawer, Divider, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText,
    Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import KeyIcon from '@mui/icons-material/Key';
import BugReportIcon from '@mui/icons-material/BugReport';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const VolunteerzDrawer = ({ handleSignOut}) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    try {
                        const userDocRef = doc(db, 'volunteers', user.uid);
                        const userDocSnap = await getDoc(userDocRef);
                        if (userDocSnap.exists()) {
                            setUserData(userDocSnap.data());
                            console.log(userDocSnap.data());
                        } else {
                            console.log('No such document!');
                        }
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                    }
                }
            });
        };

        fetchUserData();

        // Clean up the listener when component unmounts
        return () => {
            // Detach the listener here if needed
        };
    }, []);

    
    const Pages = ['Volunteering Opportunities', 'Issues', 'Settings'];
    const Icons = {
        'Volunteering Opportunities': <KeyIcon />,
        'Issues': <BugReportIcon />,
        'Settings': <SettingsIcon />,
    };

    const [open, setOpen] = useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex' }}>
                <AppBar position='fixed' sx={{ bgcolor: '#0E424C' }}>
                    <Toolbar sx={{ textAlign: 'center', }}>
                        <IconButton
                            edge="start"
                            sx={{ color: 'white', marginRight: 'auto' }}
                            onClick={handleDrawerOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography sx={{ color: 'white', marginRight: '0' }}>My Dashboard</Typography>
                        <Typography sx={{ color: 'white', marginLeft: 'auto' }}>welcome, {userData && userData.surname}</Typography>
                    </Toolbar>
                </AppBar>
                <Drawer open={open} >
                    <Box sx={{ height: '10%', display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                        <IconButton onClick={handleDrawerClose} sx={{ bgcolor: '#0E424C', color: 'white' }}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Box>

                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                        <Avatar src='British.png' sx={{ width: 120, height: 120 }}>

                        </Avatar>
                        
                    </Box>
                    <Typography variant='h6' sx={{justifyContent: 'center', display: 'flex', mt: 2}}>{userData && userData.email}</Typography>
                    <List>
                        {Pages.map((page, index) => (
                            <ListItem key={index} sx={{ display: 'block' }} >
                                <ListItemButton>
                                    <ListItemIcon>
                                        {Icons[page]}
                                    </ListItemIcon>
                                    <ListItemText>
                                        {page}
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <Divider />
                        <ListItem>
                            <ListItemButton onClick={handleSignOut}>
                                <ListItemIcon>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    Sign Out
                                </ListItemText>
                            </ListItemButton>
                        </ListItem>
                    </List>
                    
                </Drawer>
            </Box>

        </React.Fragment>
    )
}
export default VolunteerzDrawer;