const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemsSchema = new Schema({
    ShopCartID: {
        type: Number,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    ProductName: {
        type: String,
        required: true
    },
    Quantity: {
        type: Number,
        required: true
    }
});

const CartItems = mongoose.model('CartItems', cartItemsSchema);
module.exports = CartItems;
