const express = require('express');
const router = express.Router();
const Product = require('../models/products');

// Route to get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/add-product', async (req,res) => {
    try{
        const {ProductID, ProductTitle, ProductImage, Price,Quantity} = await req.body;
        const newProduct = await Product.create({ ProductID, ProductTitle, ProductImage, Price, Quantity });
        const productSubset = {
            email: newProduct.ProductTitle,
        };
        res.json({message: "okkk"});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})


module.exports = router;
