import React, { useState } from 'react';
import {
    Box,
    Button,
    // Container,
    TextField,
    makeStyles,
    Typography,
    // Checkbox,
    // FormHelperText,
    Link,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CryptoJS from 'crypto-js';
// import back_img from '../images/back_img.jpeg';
import signup_page from '../images/signup_page.png';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row', // Change to row
        justifyContent: 'space-between', // Add this
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        overflowY: 'hidden', // Prevent vertical scrolling
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
        //   marginTop: theme.spacing(1),
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

export default function Signup() {
    const classes = useStyles();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const showErrorSnackbar = (errorMessage) => {
        setSnackbarSeverity('error');
        setSnackbarMessage(errorMessage);
        setSnackbarOpen(true);
    };

    const validateData = () => {
        if (!username || !email || !password || !role || !confirmPassword) {
            showErrorSnackbar('Please fill in all fields.');
            return false;
        }
      
        if (!/\S+@\S+\.\S+/.test(email)) {
            showErrorSnackbar('Please enter a valid email address.');
            return false;
        }
      
        if (password.length < 8 || !/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|=<>]/.test(password)) {
            showErrorSnackbar('Password must be at least 8 characters long, contain a capital letter, and a special character.');
            return false;
        }
      
        if (password !== confirmPassword) {
            showErrorSnackbar('Password and confirm password do not match.');
            return false;
        }
      
        return true;
      };
      
    const createCartEntry = async (userEmail) => {
        try {
            // Make an API request to create a cart entry
            const response = await fetch(`http://localhost:3001/api/cart/create-cart/${userEmail}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Add any additional data you want to send in the body
                // body: JSON.stringify({ additionalData: value }),
            });

            // Check if the response is successful (status code 2xx)
            if (response.ok) {
                const cartEntry = await response.json();
                console.log('Cart entry created:', cartEntry);
                // You can further process the cartEntry if needed
            } else {
                // Handle error cases
                console.error('Error creating cart entry:', response.status, response.statusText);
                // You can throw an error or handle it as needed
            }
        } catch (error) {
            console.error('API Error:', error);
            // Handle any other errors
        }
    };

    const handleSignup = () => {
        // Data validation
        if (!validateData()) {
            return;
        }

        // Hash the password using CryptoJS
        const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

        // Simulating an asynchronous operation (e.g., API call)
        setLoading(true);
        setTimeout(() => {
            // Implement your signup logic here
            // console.log('Username:', username);
            // console.log('Email:', email);
            // console.log('Hashed Password:', hashedPassword); // Use this hashed password in your API request
            // console.log('Role:', role);

            // Make an API request to create a new user
            fetch('http://localhost:3001/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password: hashedPassword,
                    role,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    // Handle the response from the server
                    // console.log('API Response:', data);

                    if (data.error) {
                        // If there is an error in the response, show a snackbar with the error message
                        showErrorSnackbar(data.error);
                    } else {
                        createCartEntry(data.email);
                        // If the signup is successful, navigate to the login page
                        setSnackbarSeverity('success');
                        setSnackbarMessage('Signup successful. You will be redirected in 2 seconds.');
                        setSnackbarOpen(true);

                        setTimeout(() => {
                            navigate('/signin');
                        }, 2000);
                    }
                })
                .catch(error => {
                    console.error('API Error:', error);
                    // Handle the error and show a snackbar
                    showErrorSnackbar('Error signing up. Please try again.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }, 2000);
    };




    return (
        <div className={classes.root} >
            <div className={classes.formContainer}>
                <Typography component="h1" variant="h5"
                    style={{
                        fontSize: '2rem',
                        fontFamily: "Merriweather",
                        color: '#3498db',
                    }}
                >
                    Sign Up
                </Typography>

                <form className={classes.form}>
                    <TextField

                        className={classes.inputField}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoFocus
                        value={username}

                        onChange={(e) => setUsername(e.target.value)}
                    />
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
                    <TextField
                        className={classes.inputField}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <FormControl

                        className={classes.inputField}
                        variant="outlined" fullWidth margin="normal">
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            label="Role"
                            required
                            style={{
                                color: '#3498db', // Color of the text input
                                fontFamily: 'Merriweather',
                            }}
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="staff">Staff</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        onClick={handleSignup}
                        style={{
                            backgroundColor: '#3498db',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            border: 'none',
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            fontFamily: "Merriweather",
                            marginTop: '20px',
                        }}
                        onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                        onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                    >
                        Sign Up
                    </Button>
                    <Box mt={2}
                        style={{
                            fontFamily: "Merriweather",
                            fontSize: '1rem',
                            marginTop: '20px',

                        }}

                    > Already have an account?
                        <Link component={RouterLink} to="/signin" variant="body2"
                            style={{
                                color: '#3498db',
                                marginLeft: '5px',
                                fontFamily: "Merriweather",
                            }}
                        >
                            Sign In
                        </Link>
                    </Box>
                </form>
            </div>
            <div className={classes.imageContainer}>
                <img src={signup_page} alt="sign up page" style={{ width: '100%', height: '100%' }} />
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
