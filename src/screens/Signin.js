import React, { useState } from 'react';
import {
    Box,
    Button,
    // Container,
    TextField,
    makeStyles,
    Typography,
    Link,
    Snackbar,
    Backdrop,
    CircularProgress
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { useAuth } from '../context/AuthContext';
// import back_img from '../images/back_img.jpeg';
import signup_page from '../images/signup_page.png';
import ReCAPTCHA from "react-google-recaptcha";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100vh',
    width: '100%',
    overflowY: 'hidden',
  },
  formContainer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3),
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '23%', // Adjust as needed
    marginLeft: 170,
  },
  imageContainer: {
    width: '65%',
    height: '100%',
    overflow: 'hidden', // Prevent image overflow
  },
  form: {
    width: '100%',
  },
  inputField: {
    marginBottom: theme.spacing(0.5),
    '& label': {
      color: '#3498db', // Color of the label
      fontFamily: 'Merriweather',
    },
    '& input': {
      color: '#3498db !important', // Color of the text input
      fontFamily: 'Merriweather',
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));


export default function Signin() {
    const classes = useStyles();
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRecaptchaFilled, setRecaptchaFilled] = useState(false);

    const showErrorSnackbar = (errorMessage) => {
        setSnackbarSeverity('error');
        setSnackbarMessage(errorMessage);
        setSnackbarOpen(true);
    };

    const showSuccessSnackbar = (successMessage) => {
        setSnackbarSeverity('success');
        setSnackbarMessage(successMessage);
        setSnackbarOpen(true);
    };

    const onChange = (value) => {
      // console.log("reCAPTCHA value:", value);
      // You can perform additional actions based on successful reCAPTCHA verification
      setRecaptchaFilled(true);
   };
   
    const handleSignIn = () => {
        // Implement your sign-in logic here
    
        // Simulating an error for demonstration
        if (email === '' || password === '' 
        ) {
            showErrorSnackbar('Please fill in all fields.');
            return;
        }
        if (!isRecaptchaFilled) {
          showErrorSnackbar('Please complete the reCAPTCHA verification.');
          return;
      }
    
        // Hash the password before sending it to the server
        const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    
        // Simulating an asynchronous operation (e.g., API call)
        setLoading(true);
        setTimeout(() => {
            // console.log("email", email);
            // console.log("hashed password", hashedPassword);
    
            // Make an HTTPS request to your server
            fetch('http://localhost:3001/api/users/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: hashedPassword, // Send the hashed password
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Invalid credentials');
                }
                return response.json();
            })
            .then(data => {
               signIn(data);
                setLoading(false);
                showSuccessSnackbar('Login successful. Redirecting to dashboard...');
                setTimeout(() => {
                   if (data.role === 'admin') {
                        navigate('/adminDashboard');
                    }
                    else if (data.role === 'user'){
                        navigate('/userDashboard');
                    }
                    else if (data.role === 'staff'){
                        navigate('/staffDashboard');
                    }


                }, 2000);
            })
            .catch(error => {
                console.error('Error during sign-in:', error);
                setLoading(false);
                showErrorSnackbar('Invalid credentials. Please try again.');
            });
        }, 2000);
    };

    return (
        <div className={classes.root}>
          <div className={classes.formContainer}>
            <Typography
              component="h1"
              variant="h5"
              style={{
                fontSize: '2rem',
                fontFamily: 'Merriweather',
                color: '#3498db',
              }}
            >
              Login
            </Typography>
    
            <form className={classes.form}>
              <TextField
                className={classes.inputField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                className={classes.inputField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
               <ReCAPTCHA
    sitekey="6LfV62YpAAAAAIJpT-xZ-lV4IP8OUN7fwuwBd3MK"
    onChange={onChange}
    required
   
  style={{
    marginTop: '20px',
    // marginBottom: '20px',
  
  }}
  />
              <Button
                type="button"
                fullWidth
                variant="contained"
                onClick={handleSignIn}
                className={classes.submit}
                style={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  fontFamily: 'Merriweather',
                }}
                onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
              >
                Login
              </Button>
              <Box
                mt={2}
                style={{
                  fontFamily: 'Merriweather',
                  fontSize: '1rem',
                  marginTop: '20px',
                }}
              >
                Don't have an account?
                <Link
                  component={RouterLink}
                  to="/signup"
                  variant="body2"
                  style={{
                    color: '#3498db',
                    marginLeft: '5px',
                    fontFamily: 'Merriweather',
                  }}
                >
                  Sign Up
                </Link>
              </Box>
            </form>
          </div>
          <div className={classes.imageContainer}>
            <img src={signup_page} alt="login page" style={{ width: '100%', height: '100%',
            resizeMode: 'cover',
         }} />
          </div>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={2000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
          {/* Backdrop for loading indicator */}
          <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      );
    }