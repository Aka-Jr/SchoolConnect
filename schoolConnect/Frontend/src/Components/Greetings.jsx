
import React from 'react'
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Brightness5Icon from '@mui/icons-material/Brightness5';
import NightsStayIcon from '@mui/icons-material/NightsStay';

export const getGreetingMessage = () => {
  const now = new Date();
  const hour = now.getHours();

  if (hour < 12) {
    return {
      message: "Good Morning",
      icon: <WbSunnyIcon style={{ color: '#FFD700', marginRight: 8 }} />, // Gold color for morning
      color: '#FFECB3' // Light yellow background
    };
  } else if (hour < 18) {
    return {
      message: "Good Afternoon",
      icon: <Brightness5Icon style={{ color: '#FFA500', marginRight: 8 }} />, // Orange color for afternoon
      color: '#FFCC80' // Light orange background
    };
  } else {
    return {
      message: "Good Evening",
      icon: <NightsStayIcon style={{ color: '#4B0082', marginRight: 8 }} />, // Indigo color for evening
      color: '#D1C4E9' // Light purple background
    };
  }
};


export default function Greetings() {
  
  return (
    <div>
      
    </div>
  )
}


