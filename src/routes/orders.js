const express = require('express')
const order = require('../usecases/order')
const auth = require('../middlewares/auth')
const router = express.Router()
const moment = require('moment')

// API sendgrid
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// moment months spanish
moment.updateLocale('mx', {
  months: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
    'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Deciembre'
  ]
})

// /orders -> create()
router.post('/', async (request, response) => {
  try {
    var {
      email,
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

    // human date format -> 20 de mayo de 2020
    const humanDate = moment(deliveryDate).format('DD') + ' de ' + moment(deliveryDate).format('MMMM') + ' de ' + moment(deliveryDate).format('YYYY')

    const msg = {
      to: email,
      from: 'orders@cnergy.mx',
      subject: 'Orden lista! ... Cnergy ',
      html: `
        <table align="center" style="max-width: 400px; margin-left: auto; margin-right: auto">
          <tbody >
            <tr>
              <td>
                <div style="border-radius: 4px;box-shadow: 0 4px 10px rgba(0,0,0,.3);padding: 20px;border: 1px solid rgba(0,0,0,.1)">
                  <h2>Detalle de su compra en <b>Cnergy</b></h2> <br>
                  <p><b>Número de orden:</b> ${newOrder.orderId}</p>
                  <p><b>Fecha de entrega:</b> ${humanDate}</p>
                  <p><b>Hora aproximada de entrega:</b> ${deliveryHour.substring(0, 5)} hrs</p>
                  <p><b>Litros:</b> ${liters}</p>
                  <p><b>Precio x Litro:</b> $${priceLiter} MXN</p>
                  <p><b>Total de su compra:</b> $${total} MXN</p>
                  <p><b>Domicilio de entrega:</b> ${address}</p>
                </div>
              </tr>
            </td>
          </tbody>
        </table >
      `
    }
    sgMail.send(msg)

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
router.delete('/:id', async (request, response) => {
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
// /orders -> getByOrderId()
router.get('/order/:id', async (request, response) => {
  try {
    var { id } = request.params
    const orderData = await order.getByOrderId(id)
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
    console.log('orderUserData', orderUserData)
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
