/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cart = require('../models/cart');

const CryptoJS = require('crypto-js');

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // You may want to add password encryption using CryptoJS or a proper hashing library
        const newUser = await User.create({ username, email, password, role });

        // Return only the email of the created user
        const userSubset = {
            email: newUser.email,
        };

        res.status(201).json(userSubset);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find the user by email
        const user = await User.findOne({ email });

        // If user does not exist, return an error
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // If passwords don't match, return an error
        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Fetch the ShopCartID from the Cart table based on the user's email
        const cartEntry = await Cart.findOne({ ShopperEmail: email });

        // If there is no corresponding cart entry, set ShopCartID to null
        const userSubset = {
            _id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            shopCartID: cartEntry ? cartEntry.ShopCartID : null,
            // Add other fields as needed
        };

        res.status(200).json(userSubset);
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: error.message });
    }
});



router.post('/update-username', async (req, res) => {
    try {
        const { email, newUsername } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        // If user does not exist, return an error
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the username
        user.username = newUsername;

        // Save the updated user
        await user.save();
        const cartEntry = await Cart.findOne({ ShopperEmail: email });
        // Return the updated user information
        const updatedUser = {
            _id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            shopCartID: cartEntry ? cartEntry.ShopCartID : null,
        };

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating username:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/update-password', async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        // If user does not exist, return an error
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the provided current password matches the user's stored password
        // Note: You may want to enhance this part by using a proper password hashing library (e.g., bcrypt)
        if (currentPassword !== user.password) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Update the password
        user.password = newPassword;

        // Save the updated user
        await user.save();

        // Return a success message
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
