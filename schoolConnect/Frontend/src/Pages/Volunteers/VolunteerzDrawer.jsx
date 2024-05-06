import React from 'react';
import {
    Box,
    IconButton, Typography, Button, AppBar,
    Toolbar, Drawer, Divider, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText,
    Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useState } from 'react';
import KeyIcon from '@mui/icons-material/Key';
import BugReportIcon from '@mui/icons-material/BugReport';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const VolunteerzDrawer = ({ handleSignOut, pages, icons}) => {
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
                        <Typography sx={{ color: 'white', marginLeft: 'auto' }}>welcome, volunteersName</Typography>
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