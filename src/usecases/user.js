
const User = require('../models/user')
const bcrypt = require('../lib/bcrypt')
const jwt = require('../lib/jwt')

// CREATE new user
async function create (userData) {
  const { password, ...restUserData } = userData
  const encriptedPassword = await bcrypt.hash(password)

  return User.create({
    password: encriptedPassword,
    ...restUserData
  })
}

// DELETE user by Id
function deleteByID (id) {
  return User.findByIdAndDelete(id)
}

// GET all users
function getAll () {
  return User.find()
}

// LOGIN user
async function login (email, password) {
  const userFound = await User.findOne({ email })
  console.log('userFound', userFound)
  if (!userFound) throw new Error('Correo o contraseña inválidos')
  if (!userFound.isVerified) throw new Error('Por favor, valida tu correo electrónico')
  const isValidPassword = await bcrypt.compare(password, userFound.password)
  if (!isValidPassword) throw new Error('Correo o contraseña inválidos')

  return jwt.sign({ id: userFound._id })
}

// UPDATE user by id
async function updateById (id, infoToUpdate) {
  const { password } = infoToUpdate
  const encriptedPassword = await bcrypt.hash(password)
  infoToUpdate.password = encriptedPassword

  return User.findOneAndUpdate({
    id,
    ...infoToUpdate
  })
}

// VALIDATE session
function validateSession (token) {
  const { id } = jwt.verify(token)

  return jwt.sign({ id })
}
// get session
async function getUserSession (token) {
  const { id } = jwt.verify(token)
  const finded = await User.findOne({ _id: id })
  const dataSession = {
    user: finded
  }
  return dataSession
}
// get session
async function validateMail (hash) {
  const finded = await User.findOneAndUpdate({ token: hash }, {
    isVerified: true
  })
  const dataSession = {
    user: finded
  }
  console.log(dataSession)
  return dataSession
}

module.exports = {
  create,
  deleteByID,
  login,
  getAll,
  updateById,
  validateSession,
  getUserSession,
  validateMail
}
