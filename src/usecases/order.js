
const Order = require('../models/order')

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

function deleteByid (id) {
  return Order.findByIdAndDelete(id)
}

function getAll () {
  return Order.find()
}

function getById (id) {
  return Order.findById(id)
}
function getByIdUser (id) {
  return Order.find({ idUser: id })
}

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
