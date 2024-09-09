import React from 'react';
import { AppBar, Toolbar, Typography, Button, makeStyles } from '@material-ui/core';
// import { AppBar, Toolbar, Typography, Button, makeStyles, Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const useStyles = makeStyles((theme) => ({
  appBar: {
    // marginBottom: theme.spacing(2),
    backgroundColor:"#3498db",
    fontFamily:"Merriweather",
    position: 'fixed',
  },
  container: {
    width: '100%',
    // height: '100%',
    alignItems:"flex-start",
    // border: '5px solid red',
  },
  title: {
    flexGrow: 1,
    fontFamily:"Merriweather",
  },
}));

const DashboardLayout = ({ children, dashboardTitle }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    // Call the signOut method to remove user data from local storage
    signOut();

    // Redirect to the signin page
    navigate('/signin');
  };

  return (
    <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      fontFamily:"Merriweather",
      // backgroundColor: 'yellow',
      // paddingTop: '50px',
    }}
    
    >
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {dashboardTitle}
          </Typography>
          <Button color="inherit" onClick={handleSignOut}
          style={{
            fontFamily:"Merriweather",
          }}
          >
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <div className={classes.container}>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
