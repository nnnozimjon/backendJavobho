import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mysql from 'mysql'
import Router from './routes/router'
import path from 'path'
import http from 'http'
import { Server } from 'socket.io'

dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const App = express()
const server = http.createServer(App)
const io = new Server(server)

App.use(express.json({ limit: '10mb' }))
App.use(express.urlencoded({ extended: true }))
App.use(cors())

App.use(Router)

const connectionData = {
  host: '45.8.133.52',
  user: 'admin',
  password: '163425102100ismypaSS',
  database: 'test',
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

io.on('connection', socket => {
  console.log('a user connected')

  socket.on('chatRoom', msg => {
    console.log('This is chat room ' + msg)
  })
})

export { con }
export default server
