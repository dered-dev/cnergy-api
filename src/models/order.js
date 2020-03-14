const mongoose = require('mongoose')

// create schema order
const orderSchema = new mongoose.Schema({
  total: {
    type: String,
    required: true,
    trim: true
  },
  liters: {
    type: Number,
    required: true,
    trim: true
  },
  idUser: {
    type: String,
    required: true,
    trim: true
  },
  deliveryDate: {
    type: Date,
    required: true,
    trim: true,
    default: new Date().toLocaleDateString()
  },
  deliveryHour: {
    type: String,
    required: true,
    trim: true
  },
  priceLiter: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  payment: {
    type: Object,
    required: true,
    trim: true,
    default: {
      payer_id: '',
      emailAddress: '',
      amountCurrency: '',
      currencyCode: '',
      status: '',
      idPayment: '',
      fullName: '',
      merchantID: '',
      phoneNumber: ''
    }
  }
})

// create model orders with order Schema
module.exports = mongoose.model('orders', orderSchema)
