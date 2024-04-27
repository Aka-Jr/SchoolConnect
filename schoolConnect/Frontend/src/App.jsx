import React from 'react'
import NavigationBar from './Components/NavigationBar'
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './Pages/Home';
import AboutUs from './Pages/AboutUs';
import ContactUs from './Pages/ContactUs';


const App = () => {

  return (
    <BrowserRouter>
      <div>
        <NavigationBar />

        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/ContactUS" element={<ContactUs />} />
        </Routes>

      </div>
    </BrowserRouter>

  )
}

export default App
