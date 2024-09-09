const express = require('express');
const router = express.Router();
const CartItems = require('../models/cartItems');
const Cart = require('../models/cart');

// Route to add a product to the cart items
router.post('/add-product', async (req, res) => {
    try {
        const { ShopCartID, Price, ProductName, Quantity } = req.body;

        // Check if the product already exists in the cart items
        const existingProduct = await CartItems.findOne({ ShopCartID, ProductName });

        if (existingProduct) {
            // If the product already exists, update the quantity
            existingProduct.Quantity += Quantity;
            existingProduct.Price += Price;
            await existingProduct.save();

            // Update the cart entry
            await updateCartEntry(ShopCartID);

            res.status(200).json(existingProduct);
        } else {
            // If the product doesn't exist, create a new entry
            const newCartItem = new CartItems({
                ShopCartID,
                Price,
                ProductName,
                Quantity
            });

            // Save the new cart item
            const savedCartItem = await newCartItem.save();

            // Update the cart entry
            await updateCartEntry(ShopCartID);

            res.status(201).json(savedCartItem);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/delete-product', async (req, res) => {
    try {
        const { ShopCartID, ProductName } = req.body;

       // Find and remove the product from the cart items
const deletedProduct = await CartItems.findOneAndDelete({ ShopCartID, ProductName });

        if (deletedProduct) {
            // Update the cart entry after deletion
            await updateCartEntry(ShopCartID);

            res.status(200).json(deletedProduct);
        } else {
            res.status(404).json({ message: 'Product not found in the cart' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Route to get all cart items for a given ShopCartID
router.get('/get-cart-items/:shopCartID', async (req, res) => {
    try {
        const { shopCartID } = req.params;

        // Find all cart items for the given ShopCartID
        const cartItems = await CartItems.find({ ShopCartID: shopCartID });

        res.status(200).json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Function to update the cart entry
const updateCartEntry = async (shopCartID) => {
    try {
        // Find all cart items for the given ShopCartID
        const cartItems = await CartItems.find({ ShopCartID: shopCartID });

        // Calculate subtotal
        const subtotal = cartItems.reduce((total, item) => total + item.Price, 0);
        // if there is no item in the cart, set the subtotal to 0 and ship charge to 0
      
const shipCharge = cartItems.length === 0 ? 0 : 150;
        // Calculate total
        const total = subtotal + shipCharge;

        // Update the cart entry
        await Cart.findOneAndUpdate(
            { ShopCartID: shopCartID },
            { Quantity: cartItems.length, SubTotal: subtotal, ShipCharge: shipCharge, Total: total }
        );
    } catch (error) {
        console.error('Error updating cart entry:', error);
    }
};

module.exports = router;
