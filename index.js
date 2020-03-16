
const db = require('./src/lib/db')
const server = require('./src/server')

db
  .then(() => {
    console.log('Connected to DB!')
    console.log('Service is up!')
    server.listen(8080, () => {
      console.log('Server is runing...')
    })
  })
  .catch(error => {
    console.error('Something went wrong witdh DB', error)
  })
