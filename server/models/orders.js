const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = new Schema({
  OrderID: {
    type: Number,
    unique: true,
  },
  ShopCartID: {
    type: Number,
    required: true,
  },
  ShipName: {
    type: String,
    required: true,
    maxlength: 50,
  },
  ShipAddress: {
    type: String,
    required: true,
    maxlength: 150,
  },
  ShipPhone: {
    type: String,
    required: true,
    maxlength: 20,
  },
  ShipEmail: {
    type: String,
    default: null,
    maxlength: 50,
  },
  TotalPrice: {
    type: Number,
    required: true,
  },
});

orderSchema.plugin(AutoIncrement, { inc_field: 'OrderID' });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
