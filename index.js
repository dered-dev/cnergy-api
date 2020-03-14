
const db = require('./src/lib/db')
const server = require('./src/server')

db
  .then(() => {
    console.log('Connected')
    console.log('Pull up service')
    server.listen(8080, () => {
      console.log('server is runing')
    })
  })
  .catch(error => {
    console.error('Something went wrong', error)
  })
