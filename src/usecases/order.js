
const Order = require('../models/order')

// CREATE order
function create ({
  total,
  liters,
  idUser,
  deliveryDate,
  deliveryHour,
  priceLiter,
  createdAt,
  address,
  payment
}) {
  const newOrder = new Order({
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

  return newOrder.save()
}
// DELETE order by Id
function deleteByid (id) {
  return Order.findByIdAndDelete(id)
}

// GET all orders
function getAll () {
  return Order.find()
}

// GET order by Id
function getById (id) {
  return Order.findById(id)
}

// GET order by Id User
function getByIdUser (id) {
  return Order.find({ idUser: id })
}

// UPDATE order by Id
function updateById (id, infoToUpdate) {
  return Order.findByIdAndUpdate(id, infoToUpdate)
}

module.exports = {
  create,
  deleteByid,
  getAll,
  getById,
  updateById,
  getByIdUser
}
