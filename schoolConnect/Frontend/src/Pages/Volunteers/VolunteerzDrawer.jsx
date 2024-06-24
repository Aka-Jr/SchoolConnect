import React, { useState, useEffect } from 'react';
import { auth } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getGreetingMessage } from '../../Components/Greetings';
import {
    Box,
    IconButton,
    Typography,
    Button,
    AppBar,
    Toolbar,
    Drawer,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyIcon from '@mui/icons-material/Key';
import BugReportIcon from '@mui/icons-material/BugReport';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import EditVolunteerInfo from './EditVolunteerInfo';
import VolunteerCardsModal from './VolunteerCardsModal';

const VolunteerzDrawer = ({ handleSignOut }) => {
    const [userData, setUserData] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const { message, icon, color } = getGreetingMessage();

    useEffect(() => {
        const fetchUserData = async () => {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    try {
                        const userDocRef = doc(db, 'users', user.uid);
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


    const Pages = ['Volunteering Opportunities', 'Issues', 'Edit Profile'];
    const Icons = {
        'Volunteering Opportunities': <KeyIcon />,
        'Issues': <BugReportIcon />,
        'Edit Profile': <SettingsIcon />,
    };

    const handleListItemClick = (page) => {
        if (page === 'Edit Profile') {
            handleOpenModal();
        }
    };

    const updateUser = async (updatedData) => {
        const user = auth.currentUser;
        const userDocRef = doc(db, 'schools', user.uid);
        try {
            await updateDoc(userDocRef, updatedData);
            setUserData(updatedData); // Update state with new data
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
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
                    <Toolbar sx={{ textAlign: 'center' }}>
                        <IconButton
                            edge="start"
                            sx={{ color: 'white', marginRight: 'auto' }}
                            onClick={handleDrawerOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography sx={{ color: 'white', marginRight: '0' }}>My Dashboard</Typography>
                        <Box sx={{ color: 'white', marginLeft: 'auto', display: 'flex', gap: '10%' }}>
                            <IconButton sx={{ color: 'white', }}>
                                <Badge badgeContent={4} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>

                            <Typography variant="body2">
                                <IconButton>
                                    {icon}
                                </IconButton>
                                {message}, {userData ? userData.firstname : ''}!
                            </Typography>
                        </Box>
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
                        {userData && (
                            <Avatar
                                alt={`${userData.firstname} ${userData.surname}`}
                                src={userData.photoURL}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'top center'
                                }}
                            />
                        )}
                    </Box>
                    <Typography variant='h6' sx={{ justifyContent: 'center', display: 'flex', mt: 2 }}>{userData ? userData.email : ''}</Typography>
                    <List>
                        {Pages.map((page, index) => (
                            <ListItem key={index} sx={{ display: 'block' }} onClick={() => handleListItemClick(page)}>
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
            <EditVolunteerInfo
                open={openModal}
                handleClose={handleCloseModal}
                userData={userData}
                updateUser={updateUser}
            />



        </React.Fragment>
    )
}

export default VolunteerzDrawer;
