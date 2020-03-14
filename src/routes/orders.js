const express = require('express')
const order = require('../usecases/order')
const auth = require('../middlewares/auth')
const router = express.Router()

// /orders -> create()
router.post('/', async (request, response) => {
  try {
    var {
      total,
      liters,
      idUser,
      deliveryDate,
      deliveryHour,
      priceLiter,
      createdAt,
      address,
      payment
    } = request.body
    const newOrder = await order.create({
      total,
      liters,
      idUser,
      deliveryDate,
      deliveryHour,
      priceLiter,
      createdAt,
      address,
      payment
    })

    response.json({
      success: true,
      message: 'New order',
      data: {
        newOrder
      }
    })
  } catch (error) {
    response.status(400)
    response.json({
      success: false,
      message: error.message
    })
  }
})

// /orders -> deleteById()
router.delete('/:id', auth, async (request, response) => {
  try {
    var { id } = request.params
    const orderDeleteData = await order.deleteByid(id)
    response.json({
      success: true,
      message: 'Order deleted',
      data: {
        order: orderDeleteData
      }
    })
  } catch (error) {
    response.status(400)
    response.json({
      success: false,
      message: error.message
    })
  }
})

// /orders -> getAll()
router.get('/', async (request, response) => {
  try {
    const orders = await order.getAll()
    response.json({
      success: true,
      message: 'All orders',
      data: {
        orders
      }
    })
  } catch (error) {
    response.status(401)
    console.log(error)
    response.json({
      success: false,
      message: error.message
    })
  }
})

// /orders -> getById()
router.get('/:id', async (request, response) => {
  try {
    var { id } = request.params
    const orderData = await order.getById(id)
    response.json({
      success: true,
      message: 'Order data',
      data: {
        order: orderData
      }
    })
  } catch (error) {
    response.status(400)
    response.json({
      success: false,
      message: error.message
    })
  }
})

// /orders -> getByIdUser()
router.get('/user/:id', async (request, response) => {
  try {
    var { id } = request.params
    const orderUserData = await order.getByIdUser(id)
    response.json({
      success: true,
      message: 'Orders by user',
      data: {
        orders: orderUserData
      }
    })
  } catch (error) {
    response.status(400)
    response.json({
      success: false,
      message: error.message
    })
  }
})

// /orders -> updateById()
router.patch('/:id', auth, async (request, response) => {
  try {
    var infoToUpdate = request.body
    var { id } = request.params
    const orderUpdated = await order.updateById(id, infoToUpdate)
    response.json({
      success: true,
      message: 'Order updated',
      data: {
        orderUpdated
      }
    })
  } catch (error) {
    response.status(400)
    response.json({
      success: false,
      message: error.message
    })
  }
})

module.exports = router
