import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mysql from 'mysql'
import Router from './routes/router'
import path from 'path'
// import http from 'http'
// import { Server } from 'socket.io'

dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const App = express()
// const server = http.createServer(App)
// const io = new Server(server)

App.use(express.json({ limit: '10mb' }))
App.use(express.urlencoded({ extended: true }))
App.use(cors())

App.use(Router)

const connectionData = {
  host: 'iamnozns.beget.tech',
  user: 'iamnozns_javobho',
  password: '@163425102100ismyPass',
  database: 'iamnozns_javobho',
  timezone: 'utc',
}
const con = mysql.createPool(connectionData)

con.getConnection(err => {
  if (err) {
    console.log(err)
  } else {
    console.log('Connection established!')
  }
})

// io.on('connection', socket => {
//   console.log('A user connected!')

//   socket.on('disconnect', () => {
//     console.log('A user disconnected!')
//   })
// })

// const port = 8000
// server.listen(port, () => {
//   console.log(`Server listening on port ${port}`)
// })

export { con }
export default App
