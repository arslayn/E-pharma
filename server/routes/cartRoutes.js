const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

router.post('/create-cart/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params;

    // Create a new cart entry with ShopperID as the user ID
    const newCart = new Cart({
        ShopperEmail: userEmail,
      Quantity: 0,
      SubTotal: 0,
      ShipCharge: 0,
      Total: 0,
    });

    // Save the new cart entry
    const savedCart = await newCart.save();

    res.status(201).json(savedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/get-cart/:shopCartID', async (req, res) => {
    try {
        const { shopCartID } = req.params;

        // Find the cart entry by ShopCartID
        const cart = await Cart.findOne({ ShopCartID: shopCartID });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



module.exports = router;
