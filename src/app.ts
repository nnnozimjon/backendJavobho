import express, { Request, Response } from 'express'
import PassportMiddleware from './middleware'
import dotenv from 'dotenv'
import cors from 'cors'
import mysql from 'mysql'
import Router from './routes/router'
import path from 'path'
import { env } from 'process'

dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const App = express()

App.use(express.json())
App.use(express.urlencoded({ extended: true }))
App.use(cors())

App.use(Router)

const connectionData = {
  host: env.HOST,
  user: env.USERNAME,
  password: env.PASSWORD,
  database: env.DATABASE,
}
const con = mysql.createPool(connectionData)

con.getConnection(err => {
  if (err) {
    console.log(err)
  } else {
    console.log('Connection established!')
  }
})

export default App
