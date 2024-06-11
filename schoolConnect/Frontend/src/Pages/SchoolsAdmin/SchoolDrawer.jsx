import React, { useState, useEffect } from 'react';
import { auth } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import {
  Box,
  IconButton, Typography, Button, AppBar,
  Toolbar, Drawer, Divider, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText,
  Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import KeyIcon from '@mui/icons-material/Key';
import BugReportIcon from '@mui/icons-material/BugReport';
import LogoutIcon from '@mui/icons-material/Logout';
import EditSchoolInfo from './EditSchoolInfo';
import ListingsCard from '../../Components/ListingsCard';
import ListingFormModal from './ListingFormModal';


const SchoolDrawer = ({ handleSignOut}) => {
  const [userData, setUserData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState(null); // Add user state

  useEffect(() => {
    const fetchUserData = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          setUser(user); // Set user state
          try {
            const userDocRef = doc(db, 'schools', user.uid);
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
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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

  const Pages = ['Volunteering Opportunities', 'Issues', 'Edit Profile'];
  const Icons = {
    'Volunteering Opportunities': <KeyIcon />,
    'Issues': <BugReportIcon />,
    'Edit Profile': <EditIcon />,
  };

  const handleListItemClick = (page) => {
    if (page === 'Edit Profile') {
      handleOpenModal();
    }
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
            <Typography variant='subtitle' sx={{ color: 'white', marginLeft: 'auto' }}>{userData && userData.schoolName}</Typography>
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
            <Avatar src='British.png' sx={{ width: 120, height: 120 }} />
          </Box>
          <Typography variant='subtitle' sx={{ justifyContent: 'center', display: 'flex', mt: 2 }}>{userData && userData.email}</Typography>
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
      <EditSchoolInfo
        open={openModal}
        handleClose={handleCloseModal}
        userData={userData}
        updateUser={updateUser}
      />

      <ListingFormModal 
        schoolData={userData}
      />
       
      
    </React.Fragment>
  )
}
export default SchoolDrawer;
