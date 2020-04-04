const express = require('express')
const user = require('../usecases/user')
const router = express.Router()
const auth = require('../middlewares/auth')

const moment = require('moment')

// API sendgrid
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const crypto = require('crypto')
const secret = 'abcdefg'

// moment months spanish
moment.updateLocale('mx', {
  months: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
    'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Deciembre'
  ]
})

// /users -> create()
router.post('/', async (request, response) => {
  try {
    console.log(request.body)
    const { email } = request.body
    const hash = crypto.createHmac('sha256', secret)
      .update(email)
      .digest('hex')
    request.body.token = hash

    const userCreated = await user.create(request.body)
    const msg = {
      to: userCreated.email,
      from: 'orders@cnergy.mx',
      subject: 'Bienvenido a Cnergy',
      html: `
        <table align="center" style="max-width: 400px; margin-left: auto; margin-right: auto">
          <tbody >
            <tr>
              <td>
                <div style="border-radius: 4px;box-shadow: 0 4px 10px rgba(0,0,0,.3);padding: 20px;border: 1px solid rgba(0,0,0,.1)">
                  <h2>Bienvenido <br> ${userCreated.firstName} </h2>
                  <p>Te has registrado en <b>Cnergy</b> con el correo ${userCreated.email}</p>
                  <p>Para poder realizar pedidos de la forma mas rápida y segura entra al sitio web </p>
                  <p> <a href='http://localhost:3000/confirmation/${hash}'>Verifica tu correo</a></p>
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
      message: 'User created',
      data: {
        user: userCreated
      }
    })
  } catch (error) {
    response.status(400)
    console.log(error)
    response.json({
      success: false,
      message: error.message
    })
  }
})

// /users -> deleteByID()
router.delete('/', auth, async (request, response) => {
  try {
    const { id } = request.body
    const userDeleted = await user.deleteByID(id)
    response.json({
      success: true,
      message: 'User deleted',
      data: {
        user: userDeleted
      }
    })
  } catch (error) {
    response.status(401)
    response.json({
      success: false,
      message: error.message
    })
  }
})

// /users -> getAll()
router.get('/', async (request, response) => {
  try {
    const allUsers = await user.getAll()
    response.json({
      success: true,
      message: 'all users',
      data: {
        users: allUsers
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

// /users -> login()
router.post('/login', async (request, response) => {
  try {
    const { password, email } = request.body
    if (!password || !email) throw new Error('Faltan datos')
    const jwt = await user.login(email, password)
    response.json({
      success: true,
      message: 'Logged in',
      data: {
        token: jwt
      }
    })
  } catch (error) {
    response.status(401)
    response.json({
      success: false,
      message: error.message
    })
  }
})

// /users -> updateById()
router.patch('/:id', auth, async (request, response) => {
  try {
    var infoToUpdate = request.body
    var { id } = request.params
    const userUpdated = await user.updateById(id, infoToUpdate)
    response.json({
      success: true,
      message: 'User updated',
      data: {
        user: userUpdated
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

// /users -> validateSession()
router.get('/validate-session', async (request, response) => {
  try {
    const token = await user.validateSession(request.headers.authorization)
    response.json({
      success: true,
      message: 'Session Validated',
      data: {
        token
      }
    })
  } catch (error) {
    response.status(401)
    response.json({
      success: false,
      message: 'Invalid session'
    })
  }
})

// /users -> getUserSession()
router.get('/get-session', async (request, response) => {
  try {
    const sessionData = await user.getUserSession(request.headers.authorization)
    response.json({
      success: true,
      message: 'data Session ',
      data: {
        session: sessionData
      }
    })
  } catch (error) {
    response.status(401)
    response.json({
      success: false,
      message: 'Invalid session'
    })
  }
})

// /validateTokenUser -> validateToken()
router.get('/confirmation/:hash', async (request, response) => {
  console.log('confirmation')
  try {
    console.log(request.params)
    const hash = request.params.hash
    const token = await user.validateMail(hash)
    response.json({
      success: true,
      message: 'Mail Validated',
      data: {
        token
      }
    })
  } catch (error) {
    response.status(401)
    response.json({
      success: false,
      message: 'Invalid session'
    })
  }
})

module.exports = router
