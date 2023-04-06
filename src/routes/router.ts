import express from 'express'
import RouteController from '../controllers'
import LoginController from '../controllers/login'
import RegisterController from '../controllers/register'
import RequestLimiter from '../middleware/RateLimit'
import PassportMiddleware from '../middleware'

const Router = express.Router()

Router.get('/', RouteController.home)
Router.get('/api', RouteController.Welcome)
Router.post('/login', RequestLimiter, LoginController.login)
Router.post('/register', RequestLimiter, RegisterController.register)
//login controller

//register controller

//follow controller

export default Router
