import React, { useState, useEffect } from 'react';
import { auth } from '../../firebaseConfig';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import {
    Box,
    IconButton,
    Typography,
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
    Badge,
    CircularProgress,
    Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyIcon from '@mui/icons-material/Key';
import BugReportIcon from '@mui/icons-material/BugReport';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import EditVolunteerInfo from './EditVolunteerInfo';
import VolunteerNotificationsModal from './VolunteerNotificationsModal';
import SchoolDetailsModal from './SchoolDetailsModal';
import { getGreetingMessage } from '../../Components/Greetings';

const VolunteerzDrawer = ({ handleSignOut }) => {
    const [userData, setUserData] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [badgeCount, setBadgeCount] = useState(0);
    const [notificationModalOpen, setNotificationModalOpen] = useState(false);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [schoolDetails, setSchoolDetails] = useState(null);
    const [schoolDetailsModalOpen, setSchoolDetailsModalOpen] = useState(false);
    const [requestDetails, setRequestDetails] = useState(null); // State to store request details
    const [notificationType, setNotificationType] = useState(null);


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
                            fetchNotifications(user.uid);
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
        // fetchUserData();

        // const interval = setInterval(() => {
        //     if (userData) {
        //         fetchNotifications(userData.uid);
        //     }
        // }, 15000); //

        // Clean up the listener when component unmounts
        return () => {
            // Detach the listener here if needed
        };
    }, []);

    const fetchNotifications = async (volunteerId) => {
        try {
            setLoadingNotifications(true);
            const notificationsRef = collection(db, 'notifications');
            const q = query(notificationsRef, where('volunteerId', '==', volunteerId));
            const querySnapshot = await getDocs(q);
            const notificationsList = [];
            querySnapshot.forEach((doc) => {
                notificationsList.push({ id: doc.id, ...doc.data() });
            });
    
            // Sort notifications to have unread notifications first
            const sortedNotifications = notificationsList.sort((a, b) => a.read - b.read);
    
            setNotifications(sortedNotifications);
            setBadgeCount(sortedNotifications.filter(notif => !notif.read).length);
            setLoadingNotifications(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setLoadingNotifications(false);
        }
    };
    
    
    



    const handleOpenNotifications = () => {
        if (userData) {
            fetchNotifications(userData.uid);
            setNotificationModalOpen(true);
        }
    };

    const handleCloseNotifications = () => {
        setNotificationModalOpen(false);
    };



    const handleDeleteNotification = async (notification) => {
        try {
            const notificationDocRef = doc(db, 'notifications', notification.id);
            await deleteDoc(notificationDocRef);
            setNotifications(notifications.filter(notif => notif.id !== notification.id));
            setBadgeCount(prevCount => Math.max(prevCount - 1, 0)); // Ensure badge count doesn't go negative
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    // Pass the handler to VolunteerNotificationsModal



    const handleAccept = async (requestDetails) => {
        try {
            const requestDocRef = doc(db, 'requests', requestDetails.id);
            await updateDoc(requestDocRef, { status: 'accepted' });

            // Send notification to the school
            const notification = {
                schoolId: requestDetails.schoolId,
                message: `Your request has been accepted by ${userData.firstname}.`,
                timestamp: new Date(),
                read: false,
            };
            await addDoc(collection(db, 'notifications'), notification);

            // Update state and refresh data as needed
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const handleReject = async (requestDetails) => {
        try {
            const requestDocRef = doc(db, 'requests', requestDetails.id);
            await updateDoc(requestDocRef, { status: 'rejected' });

            // Send notification to the school
            const notification = {
                schoolId: requestDetails.schoolId,
                message: `Your request has been rejected by ${userData.firstname}.`,
                timestamp: new Date(),
                read: false,
            };
            await addDoc(collection(db, 'notifications'), notification);

            // Update state and refresh data as needed
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };


    const handleMarkAsRead = async (notification) => {
        try {
            const notificationDocRef = doc(db, 'notifications', notification.id);
            await updateDoc(notificationDocRef, { read: true });
            setNotifications(notifications.map(notif => notif.id === notification.id ? { ...notif, read: true } : notif));
            setBadgeCount(prevCount => Math.max(prevCount - 1, 0)); // Ensure badge count doesn't go negative
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            setNotificationType(notification.type); // Set the notification type
            const schoolDocRef = doc(db, 'schools', notification.schoolId);
            const schoolDocSnap = await getDoc(schoolDocRef);
            if (schoolDocSnap.exists()) {
                setSchoolDetails(schoolDocSnap.data());
    
                if (notification.type === 'request') {
                    const requestsRef = collection(db, 'requests');
                    const q = query(requestsRef, where('volunteerId', '==', userData.uid), where('schoolId', '==', notification.schoolId));
                    const querySnapshot = await getDocs(q);
                    let fetchedRequestDetails = null;
                    querySnapshot.forEach((doc) => {
                        fetchedRequestDetails = { id: doc.id, ...doc.data() };
                    });
    
                    setRequestDetails(fetchedRequestDetails); // Update requestDetails
                } else {
                    setRequestDetails(null); // Reset requestDetails if not a request
                }
    
                setSchoolDetailsModalOpen(true); // Open modal after setting state variables
            } else {
                console.log('No such school document!');
            }
        } catch (error) {
            console.error('Error fetching school details or request details:', error);
        }
    };
    


    const handleCloseSchoolDetailsModal = () => {
        setSchoolDetailsModalOpen(false);
        setSchoolDetails(null);
        setRequestDetails(null); // Clear request details when closing modal
    };

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
                            <IconButton sx={{ color: 'white' }} onClick={handleOpenNotifications}>
                                <Badge badgeContent={badgeCount} color="error">
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
                        {Pages.map((page, index) => (<ListItem key={index} sx={{ display: 'block' }} onClick={() => handleListItemClick(page)}>
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
            {loadingNotifications ? (
                <CircularProgress />
            ) : (
                <VolunteerNotificationsModal
                    open={notificationModalOpen}
                    handleClose={handleCloseNotifications}
                    notifications={notifications}
                    handleAccept={handleAccept}
                    handleReject={handleReject}
                    handleMarkAsRead={handleMarkAsRead}
                    handleNotificationClick={handleNotificationClick}
                    handleDeleteNotification={handleDeleteNotification}
                />
            )}
            {schoolDetails && (
                <SchoolDetailsModal
                    open={schoolDetailsModalOpen}
                    handleClose={handleCloseSchoolDetailsModal}
                    schoolDetails={schoolDetails}
                    notificationType={notificationType}
                    requestDetails={requestDetails}
                    handleAccept={handleAccept}
                    handleReject={handleReject}
                />

            )}

        </React.Fragment>
    );
};

export default VolunteerzDrawer;
