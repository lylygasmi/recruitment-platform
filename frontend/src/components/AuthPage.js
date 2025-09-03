import React, { useState, useEffect } from 'react';
import Login from './login';
import Register from './Register';
import { Box, Button } from '@mui/material';

const images = [
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1950&q=80', // workspace with laptop & coffee
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1950&q=80', // office desk with computer & keyboard
  'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1950&q=80', // desk with notes and laptop, no faces
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1950&q=80', // modern office, no people
];




export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Changement toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${images[currentImageIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-image 1s ease-in-out',
        p: 2,
      }}
    >
      <Box
        sx={{
          bgcolor: 'rgba(0,0,0,0.7)',
          borderRadius: '20px',
          p: 4,
          width: '100%',
          maxWidth: '600px',
          color: 'white',
        }}
      >
        <Box display="flex" justifyContent="center" mb={3}>
          <Button
            onClick={() => setActiveTab('login')}
            sx={{
              bgcolor: activeTab === 'login' ? '#00AEEF' : '#555',
              color: activeTab === 'login' ? 'black' : 'white',
              borderRadius: '20px',
              mx: 1,
              '&:hover': { bgcolor: '#0077B5' },
            }}
          >
            Se connecter
          </Button>
          <Button
            onClick={() => setActiveTab('register')}
            sx={{
              bgcolor: activeTab === 'register' ? '#00AEEF' : '#555',
              color: activeTab === 'register' ? 'black' : 'white',
              borderRadius: '20px',
              mx: 1,
              '&:hover': { bgcolor: '#0077B5' },
            }}
          >
            S'inscrire
          </Button>
        </Box>

        {activeTab === 'login' ? <Login /> : <Register />}
      </Box>
    </Box>
  );
}
