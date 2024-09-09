import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Container,
    Typography,
    makeStyles,
    TextField,
    Button,
    Snackbar,
    Backdrop,
    CircularProgress,
  } from '@material-ui/core';
  import MuiAlert from '@material-ui/lab/Alert';
import { useAuth } from '../context/AuthContext';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
const useStyles = makeStyles({
  card: {
    width: 350,
    margin: '10px',
    height: 100,
  },
  card2: {
    width: 300,
    margin: '10px',
    // height: 200,
    alignItems: 'center',
  },
  textStyle: {
    fontFamily: 'Merriweather',
    fontSize: '15px',
    color: 'black',

  },
  textStyle2: {
    fontFamily: 'Merriweather',
    fontSize: '17px',
    color: '#3498db',

  },
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

const CartPage = () => {
    const classes = useStyles();
    const [cartItems, setCartItems] = useState([]);
    const [cartDetails, setCartDetails] = useState({});
    const { user } = useAuth();
    const ShopCartID = user.shopCartID;
    const [shipperAddress, setShipperAddress] = useState('');
    const [shipperPhone, setShipperPhone] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [loading, setLoading] = useState(false);
  
  const handlePlaceOrder = async () => {
    try {
        setLoading(true);
      const response = await fetch('http://localhost:3001/api/orders/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ShopCartID,
          ShipName: user.username, // You can use the user's email as the ShipName
          ShipEmail: user.email,
          ShipAddress: shipperAddress,
          ShipPhone: shipperPhone,
          TotalPrice: cartDetails.Total,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Optionally, you may want to clear the cart items after placing an order
      // await fetch(`http://localhost:3001/api/cartItems/clear-cart/${ShopCartID}`);

      // Fetch updated cart items after placing the order
      const updatedResponse = await fetch(`http://localhost:3001/api/cartItems/get-cart-items/${ShopCartID}`);
      const updatedData = await updatedResponse.json();
      setCartItems(updatedData);

      // Fetch updated cart details after placing the order
      const updatedCartResponse = await fetch(`http://localhost:3001/api/cart/get-cart/${ShopCartID}`);
      const updatedCartData = await updatedCartResponse.json();
      setCartDetails(updatedCartData);
      setShipperAddress('');
        setShipperPhone('');
        showSuccessSnackbar('Order placed successfully');
    } catch (error) {
      console.error('Error placing order:', error.message);
      showErrorSnackbar('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productName) => {
    try {
        setLoading(true);
      const response = await fetch('http://localhost:3001/api/cartItems/delete-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ShopCartID,
          ProductName: productName,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Fetch updated cart items after deletion
      const updatedResponse = await fetch(`http://localhost:3001/api/cartItems/get-cart-items/${ShopCartID}`);
      const updatedData = await updatedResponse.json();
      setCartItems(updatedData);

      // Fetch updated cart details after deletion
      const updatedCartResponse = await fetch(`http://localhost:3001/api/cart/get-cart/${ShopCartID}`);
      const updatedCartData = await updatedCartResponse.json();
      setCartDetails(updatedCartData);
   
      showSuccessSnackbar('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error.message);
      showErrorSnackbar('Failed to delete product');
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
  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        // Fetch cart items
        const responseItems = await fetch(`http://localhost:3001/api/cartItems/get-cart-items/${ShopCartID}`);
        if (!responseItems.ok) {
          throw new Error('Network response was not ok');
        }
        const itemsData = await responseItems.json();
        setCartItems(itemsData);

        // Fetch cart details
        const responseCart = await fetch(`http://localhost:3001/api/cart/get-cart/${ShopCartID}`);
        if (!responseCart.ok) {
          throw new Error('Network response was not ok');
        }
        const cartData = await responseCart.json();
        setCartDetails(cartData);
      } catch (error) {
        console.error('Error fetching cart data:', error.message);
      }
    };

    fetchCartDetails();
  }, [ShopCartID]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        fontFamily: "Merriweather",
        padding: '20px',
      }}
    >
      <h1
        style={{
            fontFamily: 'Merriweather',
            fontSize: '30px',
            color: '#3498db',
            margin: '20px',
          
          }}
      >Cart Page</h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: "Merriweather",
          padding: '20px',
          width: '80%',
          // padding: '20px',
        }}
      >
        <div>
          {cartItems.map((cartItem) => (
            <Card key={cartItem._id} className={classes.card}>
              <CardContent>
                <Typography   className={classes.textStyle2}>{cartItem.ProductName}</Typography>
               <Container
               style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                width: '100%',
                // border: '1px solid #d3d3d3',
                padding: '0px',
               }}
               >
             <div>
              <Typography   className={classes.textStyle}>
                  Price: ${cartItem.Price}
                </Typography>
                <Typography   className={classes.textStyle}>
                  Quantity: {cartItem.Quantity}
                </Typography>
              </div>
                <DeleteOutlineIcon
                  style={{ color: 'red', cursor: 'pointer' }}
                  onClick={() => handleDeleteProduct(cartItem.ProductName)}
                />
               </Container>
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
        <Card className={classes.card2}>
            <CardContent>
              <Typography   className={classes.textStyle2}>Place Order</Typography>
            
            
              <Typography   className={classes.textStyle}>
                SubTotal: ${cartDetails.SubTotal}
              </Typography>
              <Typography   className={classes.textStyle}>
                Shipping Charge: ${cartDetails.ShipCharge}
              </Typography>
              <Typography   className={classes.textStyle}>
                Total: ${cartDetails.Total}
              </Typography>
              <TextField
               className={classes.inputField}
                label="Address"
                variant="outlined"
                fullWidth
                margin="normal"
                value={shipperAddress}
                autoComplete="Address"
                id="Address"
                name="Address"
                onChange={(e) => setShipperAddress(e.target.value)}
              />
              <TextField
               className={classes.inputField}
                label="Phone Number"
                variant="outlined"
                fullWidth
                margin="normal"
                value={shipperPhone}
               type="tel"
                autoComplete="Phone"
                id="Phone"
                name="Phone"

                onChange={(e) => setShipperPhone(e.target.value)}
              />
             {
                cartDetails.Total > 0 && (
                    <Button  style={{
              backgroundColor: '#3498db',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              border: 'none',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              fontFamily: 'Merriweather',
            }}
            onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.target.style.transform = 'scale(1)')} onClick={handlePlaceOrder}>
                    Place Order
                  </Button>
                )
             }
            </CardContent>
          </Card>
        </div>
      </div>
     {/* Snackbar */}
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

export default CartPage;
