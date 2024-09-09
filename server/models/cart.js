const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


const cartSchema = new Schema({
  ShopCartID: {
    type: Number,
    unique: true,
  },
  ShopperEmail: {
    type: String,
    required: true,
  },
  Quantity: {
    type: Number,
    default: null,
  },
  SubTotal: {
    type: Number,
    default: null,
  },
  ShipCharge: {
    type: Number,
    default: null,
  },
  Total: {
    type: Number,
    default: null,
  },
  DateCreated: {
    type: Date,
    default: Date.now,
  },
});

cartSchema.plugin(AutoIncrement, { inc_field: 'ShopCartID' });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
