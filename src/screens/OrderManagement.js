/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
  Button,
  TextField,
  Snackbar,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
    color: '#3498db', // Color of the label
    fontFamily: 'Merriweather',
  },
  text:{
    color: '#3498db', // Color of the label
    fontFamily: 'Merriweather',
    fontSize: 17,
    textAlign: 'center',
  },
  text2:{
    color: 'black', // Color of the label
    fontFamily: 'Merriweather',
    fontSize: 15,
    textAlign: 'center',
  }
});

export default function OrderManagement() {
  const classes = useStyles();
  const [orders, setOrders] = useState([]);
  const [editableOrderId, setEditableOrderId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);


  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/orders/getAllOrders');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setOrders(data);
      return data; // Return the fetched data
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      return []; // Return an empty array in case of an error
    }
  };
  

  useEffect(() => {
   

    fetchOrders();
  }, []);

  const handleEditClick = (orderId) => {
    setEditableOrderId(orderId);
  };

  const handleSaveClick = async (orderId,  updatedShipPhone, updatedTotalPrice, updatedShipAddress) => {
    try {
      setLoading(true);
      // Make a fetch request to update the order in the backend
      const response = await fetch(`http://localhost:3001/api/orders/updateOrder/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ShipPhone: updatedShipPhone,
          TotalAmount: updatedTotalPrice, 
          ShipAddress: updatedShipAddress,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedOrderData = await response.json();
      // console.log('Updated Order Data:', updatedOrderData);

      setEditableOrderId(null);
      const updatedOrders = await fetchOrders();
      setOrders(updatedOrders);
      showSuccessSnackbar('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error.message);
      showErrorSnackbar('Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (orderId) => {
    try {
      setLoading(true);
      // Make a fetch request to delete the order in the backend
      const response = await fetch(`http://localhost:3001/api/orders/deleteOrder/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // console.log('Order deleted successfully');

      // After successfully deleting the order, you might want to fetch the orders again to update the state
      const updatedOrders = await fetchOrders();
      setOrders(updatedOrders);
      showSuccessSnackbar('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error.message);
      showErrorSnackbar('Failed to delete order');
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
        width: '100%', // Adjust the width as needed
        fontFamily: 'Merriweather',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>Order Management</h1>
      <TableContainer
        component={Paper}
        style={{
          width: '80%', // Adjust the width as needed
          fontFamily: 'Merriweather',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #3498db',
        }}
      >
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow
            
            >
              <TableCell  className={classes.text}>Order ID</TableCell>
              <TableCell  className={classes.text}>Customer Name</TableCell>
              <TableCell  className={classes.text}>Customer Phone</TableCell>
              <TableCell  className={classes.text}>Customer Email</TableCell>
              <TableCell  className={classes.text}>Total Amount</TableCell>
              <TableCell  className={classes.text}>Delivery Address</TableCell>
              <TableCell  className={classes.text}
              align='center'
              >Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order._id}>
                <TableCell  className={classes.text2}>{order.OrderID}</TableCell>
                <TableCell  className={classes.text2}>
                  {order.ShipName}
                </TableCell>
                <TableCell>
                  {editableOrderId === order._id ? (
                    <TextField
                      value={order.ShipPhone}
                      onChange={(e) => setOrders(prevOrders => (
                        prevOrders.map(prevOrder => (
                          prevOrder._id === order._id ? { ...prevOrder, ShipPhone: e.target.value } : prevOrder
                        ))
                      ))}
                    />
                  ) : (
                    order.ShipPhone
                  )}
                </TableCell>
                <TableCell  className={classes.text2}>
                  {order.ShipEmail}
                </TableCell>
                <TableCell  className={classes.text2}>
                 {
                  editableOrderId === order._id ? (
                    <TextField
                      value={order.TotalPrice}
                      onChange={(e) => setOrders(prevOrders => (
                        prevOrders.map(prevOrder => (
                          prevOrder._id === order._id ? { ...prevOrder, TotalPrice: e.target.value } : prevOrder
                        ))
                      ))}
                    />
                  ) : (
                    order.TotalPrice
                  )
                 }
                  </TableCell>
                <TableCell  className={classes.text2}>{
                  editableOrderId === order._id ? (
                    <TextField
                      value={order.ShipAddress}
                      onChange={(e) => setOrders(prevOrders => (
                        prevOrders.map(prevOrder => (
                          prevOrder._id === order._id ? { ...prevOrder, ShipAddress: e.target.value } : prevOrder
                        ))
                      ))}
                    />
                  ) : (
                    order.ShipAddress
                  )
                
}</TableCell>
                <TableCell
                // style={{
                //     display: 'flex',
                //     justifyContent: 'space-between',
                //     alignItems: 'center',
                // }}
                >
                  {editableOrderId === order._id ? (
                    <Button
                    onClick={() => handleSaveClick(
                      order.OrderID,
                    
                      order.ShipPhone,
                      order.TotalPrice, // Make sure to use the correct field name
                      order.ShipAddress,
                    )}
                    style={{
                        backgroundColor: '#3498db',
                        color: 'white',
                        // padding: '10px 20px',
                        borderRadius: '5px',
                        border: 'none',
                        fontSize: '10px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        fontFamily:"Merriweather",
                        margin: '10px',
                      }}
                      onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                      onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                    >Save</Button>
                  ) : (
                    <Button onClick={() => handleEditClick(order._id)}
                    style={{
                        backgroundColor: '#3498db',
                        color: 'white',
                        // padding: '10px 20px',
                        borderRadius: '5px',
                        border: 'none',
                        fontSize: '10px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        fontFamily:"Merriweather",
                        margin: '10px',
                      }}
                      onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                      onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                    >Edit</Button>
                  )}
                  <Button onClick={() => handleDeleteClick(order.OrderID)}
                   style={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    // padding: '10px 20px',
                    borderRadius: '5px',
                    border: 'none',
                    fontSize: '10px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    fontFamily:"Merriweather",
                    margin: '10px',
                  }}
                  onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                  onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                  >Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
}
