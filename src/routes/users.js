const express = require('express')
const user = require('../usecases/user')
const router = express.Router()
const auth = require('../middlewares/auth')

// /users -> create()
router.post('/', async (request, response) => {
  try {
    const userCreated = await user.create(request.body)
    response.json({
      success: true,
      message: 'User created',
      data: {
        userCreated
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

module.exports = router
