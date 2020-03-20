const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

require('dotenv').config()

// DB options
const {
  DB_PASSWORD,
  DB_NAME,
  DB_USER,
  DB_HOST
} = process.env

const url = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
const connection = mongoose.createConnection(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.set('useCreateIndex', true)

// for orderId
autoIncrement.initialize(connection)

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

// set autoincrement plugin
orderSchema.plugin(autoIncrement.plugin, {
  model: 'orders',
  field: 'orderId',
  startAt: 100,
  incrementBy: 1
})

// create model orders with order Schema
module.exports = mongoose.model('orders', orderSchema)
