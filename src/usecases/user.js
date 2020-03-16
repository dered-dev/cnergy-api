
const User = require('../models/user')
const bcrypt = require('../lib/bcrypt')
const jwt = require('../lib/jwt')

async function create (userData) {
  const { password, ...restUserData } = userData
  const encriptedPassword = await bcrypt.hash(password)
  return User.create({
    password: encriptedPassword,
    ...restUserData
  })
}

function deleteByID (id) {
  return User.findByIdAndDelete(id)
}

function getAll () {
  return User.find()
}

async function login (email, password) {
  const userFound = await User.findOne({ email })
  if (!userFound) throw new Error("Credentials don't match")
  const isValidPassword = await bcrypt.compare(password, userFound.password)
  if (!isValidPassword) throw new Error("Credentials don't match")

  return jwt.sign({ id: userFound._id })
}

async function updateById (id, infoToUpdate) {
  const { password } = infoToUpdate
  const encriptedPassword = await bcrypt.hash(password)
  infoToUpdate.password = encriptedPassword

  return User.findOneAndUpdate({
    id,
    ...infoToUpdate
  })
}

function validateSession (token) {
  const { id } = jwt.verify(token)

  return jwt.sign({ id })
}

module.exports = {
  create,
  deleteByID,
  login,
  getAll,
  updateById,
  validateSession
}
