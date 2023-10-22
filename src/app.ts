import express from 'express'
import Router from './routes'
import cors from 'cors'
import http from 'http'

// relative paths
const App = express()
const server = http.createServer(App)

App.use(express.json({ limit: '15mb' }))
App.use(express.urlencoded({ extended: true }))
App.use(express.static('public'))
App.use(cors())
App.use(Router)

export default server
