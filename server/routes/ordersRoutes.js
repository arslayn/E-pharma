/* eslint-disable no-self-assign */
const express = require('express');
const router = express.Router();
const Order = require('../models/orders');
const CartItems = require('../models/cartItems');
const Cart = require('../models/cart');

router.post('/place-order', async (req, res) => {
  try {
      const { ShopCartID, ShipName, ShipAddress, ShipPhone, ShipEmail, TotalPrice } = req.body;

      // Check if the shopping cart exists
      const existingCart = await CartItems.find({ ShopCartID });

      if (!existingCart || existingCart.length === 0) {
          return res.status(400).json({ message: 'Shopping cart not found or empty' });
      }

      // Create a new order entry
      const newOrder = new Order({
          ShopCartID,
          ShipName,
          ShipAddress,
          ShipPhone,
          ShipEmail,
          TotalPrice,
      });

      // Save the new order entry
      const savedOrder = await newOrder.save();

      // Clear the cart items after placing an order
      await CartItems.deleteMany({ ShopCartID });

      // Update the cart entry
      await Cart.findOneAndUpdate(
          { ShopCartID },
          { Quantity: 0, SubTotal: 0, ShipCharge: 0, Total: 0 }
      );

      res.status(201).json(savedOrder);
  } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get all orders
router.get('/getAllOrders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/getOrdersByUser/:shopCartId', async (req, res) => {
  const shopCartId = req.params.shopCartId;

  try {
    // Find orders with the specified ShopCartID
    const orders = await Order.find({ ShopCartID: shopCartId });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error getting orders by user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.patch('/updateOrder/:orderId', async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const {  ShipPhone, TotalAmount, ShipAddress } = req.body;

    // Find the order by OrderID
    const order = await Order.findOne({ OrderID: orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the order details
    
    order.ShipPhone = ShipPhone;
    order.TotalPrice = TotalAmount;
    order.ShipAddress = ShipAddress;
    order.ShipEmail=order.ShipEmail;
    order.ShipCartID=order.ShipCartID;
    order.ShipName=order.ShipName;
    // order.ShipEmail=order.ShipEmail;
    // order.ShipCartID=order.ShipCartID;
    // order.ShipName=order.ShipName;

    // Save the updated order
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/deleteOrder/:orderId', async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Find the order by OrderID
    const order = await Order.findOne({ OrderID: orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Remove the order
    await Order.findByIdAndDelete(order._id);

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
