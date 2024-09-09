import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useAuth } from '../context/AuthContext';
const useStyles = makeStyles({
  card: {
    width: 400,
    margin: '10px',
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
});

export default function OrdersPage() {
  const classes = useStyles();
  const [orders, setOrders] = useState([]);
    const { user } = useAuth();
    const ShopCartID = user.shopCartID;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/orders/getOrdersByUser/${ShopCartID}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
      }
    };

    fetchOrders();
  }, [ShopCartID]);

  return (
    <Container>
      <h1
        style={{
            fontFamily: 'Merriweather',
            fontSize: '30px',
            color: '#3498db',
            margin: '0px',
          
          }}
      >Orders</h1>
      <div>
        {orders.map((order) => (
          <Card key={order._id} className={classes.card}>
            <CardContent>
              <Typography   className={classes.textStyle2}>Order ID: {order.OrderID}</Typography>
              {/* <Typography variant="body2" color="textSecondary">
                ShopCartID: {order.ShopCartID}
              </Typography> */}
              <Typography   className={classes.textStyle}>
                ShipName: {order.ShipName}
              </Typography>
              <Typography   className={classes.textStyle}>
                ShipAddress: {order.ShipAddress}
              </Typography>
              <Typography   className={classes.textStyle}>
                ShipPhone: {order.ShipPhone || 'Not provided'}
              </Typography>
              <Typography   className={classes.textStyle}>
                ShipEmail: {order.ShipEmail || 'Not provided'}
              </Typography>
              <Typography   className={classes.textStyle}>
                TotalPrice: ${order.TotalPrice}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
