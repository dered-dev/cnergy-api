const express = require('express')
const cors = require('cors')

const usersRouter = require('./routes/users')
const odersRouter = require('./routes/orders')

const app = express()

// middleware CORS
app.use(cors())

// middleware to get body in JSON format
app.use(express.json())

// mount routers orders and users
app.use('/orders', odersRouter)
app.use('/users', usersRouter)

module.exports = app
