import React, { useState, useEffect } from 'react';

import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Home from './Pages/Home';
import AboutUs from './Pages/AboutUs';
import ContactUs from './Pages/ContactUs';
import VolunteersDashboard from './Pages/Volunteers/VolunteersDashboard';
import { ProtectedRoutes } from './Components/ProtectedRoutes';
import LinearProgress from '@mui/material/LinearProgress';
import { Box } from '@mui/material';
import AdminsDashboard from './Pages/SchoolsAdmin/AdminsDashboard';

const App = () => {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setIsFetching(false);
    });

    return () => unsubscribe();
  }, []);

  if (isFetching) {
    return <Box sx={{ width: '100%' }}>
    <LinearProgress />
  </Box>;
  }

  return (
    <BrowserRouter>
      <div>
        
        <Routes>
          <Route path="/Home" element={<Home user={user} />} />
          <Route path="/" element={<Home user={user} />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/sadmin" element={<ProtectedRoutes user={user} ><AdminsDashboard /></ProtectedRoutes>} />
          <Route path="/user" element={<ProtectedRoutes user={user} ><VolunteersDashboard /></ProtectedRoutes>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
