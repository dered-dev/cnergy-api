const mongoose = require('mongoose')

// create schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
    trim: true,
    match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/
  },
  password: {
    type: String,
    minlength: 1,
    maxlength: 200,
    required: true
  },
  firstName: {
    type: String,
    minlength: 3,
    maxlength: 100,
    required: true
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 100
  },
  phone: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true
  },
  address: {
    type: String,
    minlength: 3,
    maxlength: 200,
    required: true
  }
})

// create model users
module.exports = mongoose.model('users', userSchema)
