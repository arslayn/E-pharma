const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    ProductID: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
    },
    ProductTitle: {
        type: String,
        default: null,
        trim: true,
    },
    ProductImage: {
        type: String,
        default: null,
        trim: true,
    },
    Price: {
        type: Number,
        required: true,
        default: 0.0,
    },
    Quantity: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
