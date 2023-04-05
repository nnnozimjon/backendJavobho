import express from 'express'
import RouteController from '../controllers'
import LoginController from '../controllers/login'
import PassportMiddleware from '../middleware'

const Router = express.Router()

Router.get('/', RouteController.home)
Router.get('/api', RouteController.Welcome)
Router.post('/login', LoginController.login)

//login controller

//register controller

//follow controller

export default Router
