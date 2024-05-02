import { Typography } from '@mui/material';
import React from 'react'
import KeyIcon from '@mui/icons-material/Key';
import BugReportIcon from '@mui/icons-material/BugReport';
import SettingsIcon from '@mui/icons-material/Settings';
import VolunteerzDrawer from '../Volunteers/VolunteerzDrawer';

const AdminsDashboard = () => {
    const adminPages = ['Admin Page 1', 'Admin Page 2', 'Admin Page 3'];
    const adminIcons = {
        'Admin Page 1': <KeyIcon />,
        'Admin Page 2': <BugReportIcon />,
        'Admin Page 3': <SettingsIcon />,
    };
  return (
    <React.Fragment>
      <Typography variant="h1">Admins Dashboard</Typography>
      <VolunteerzDrawer  />
    </React.Fragment>
  )
}
export default  AdminsDashboard;