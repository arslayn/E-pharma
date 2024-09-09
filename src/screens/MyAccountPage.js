import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  // Container,
  // Typography,
  makeStyles,
  TextField,
  Button,
  Snackbar,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import CryptoJS from 'crypto-js';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles({
  inputField: {
    '& label': {
      color: '#3498db',
      fontFamily: 'Merriweather',
    },
    '& input': {
      color: '#3498db !important',
      fontFamily: 'Merriweather',
    },
  },
});

const MyAccountPage = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState(user.username);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const classes = useStyles();

  const handleUpdateUsername = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/users/update-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          newUsername: username,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedUserData = await response.json();
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
    
      // console.log('Updated User Data:', updatedUserData);
      showSuccessSnackbar('Username updated successfully');
    } catch (error) {
      console.error('Error updating username:', error.message);
      showErrorSnackbar('Failed to update username');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      setLoading(true);
      // Hash the current and new passwords using CryptoJS (you may want to use a more secure hashing library)
      const hashedCurrentPassword = CryptoJS.SHA256(currentPassword).toString(CryptoJS.enc.Hex);
      const hashedNewPassword = CryptoJS.SHA256(newPassword).toString(CryptoJS.enc.Hex);

      const response = await fetch('http://localhost:3001/api/users/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          currentPassword: hashedCurrentPassword,
          newPassword: hashedNewPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      console.log('Password updated successfully:', result);
      showSuccessSnackbar('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error.message);
      showErrorSnackbar('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const showSuccessSnackbar = (successMessage) => {
    setSnackbarSeverity('success');
    setSnackbarMessage(successMessage);
    setSnackbarOpen(true);
  };

  const showErrorSnackbar = (errorMessage) => {
    setSnackbarSeverity('error');
    setSnackbarMessage(errorMessage);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '30%',
        height: '100%',
        fontFamily: 'Merriweather',
        margin: '30px',
        padding: '30px',
      }}
    >
      <h1
        style={{
          fontFamily: 'Merriweather',
          fontSize: '30px',
          color: '#3498db',
          margin: '20px',
        
        }}
      >My Account Page</h1>
      <TextField
        className={classes.inputField}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <Button
        style={{
          backgroundColor: '#3498db',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          fontSize: '12px',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          fontFamily: 'Merriweather',
          marginTop: '20px',
        }}
        onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
        onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
        onClick={handleUpdateUsername}
      >
        Update Username
      </Button>

      {/* Update Password Section */}
      <TextField
        className={classes.inputField}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="currentPassword"
        label="Current Password"
        type="password"
        id="currentPassword"
        autoComplete="current-password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      <TextField
        className={classes.inputField}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="newPassword"
        label="New Password"
        type="password"
        id="newPassword"
        autoComplete="new-password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <Button
        style={{
          backgroundColor: '#3498db',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          fontSize: '12px',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          fontFamily: 'Merriweather',
          marginTop: '20px',
        }}
        onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
        onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
        onClick={handleUpdatePassword}
      >
        Update Password
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      {/* Backdrop for loading indicator */}
      <Backdrop className={classes.backdrop} open={loading}
      style={{
        zIndex: 2,
        color: '#fff',
      
      }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default MyAccountPage;
