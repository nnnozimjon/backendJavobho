import express from 'express'
import RouteController from '../controllers'
import LoginController from '../controllers/login'
import RegisterController from '../controllers/register'
import RequestLimiter from '../middleware/RateLimit'
import PassportMiddleware from '../middleware'
import GetImageController from '../controllers/getImage'

const Router = express.Router()

Router.get('/', RouteController.home)
Router.get('/api', RouteController.Welcome)
Router.post('/api/auth/login', RequestLimiter, LoginController.login)
Router.post('/api/auth/register', RequestLimiter, RegisterController.register)
Router.get('/api/user/profile/img/avatar/:image', GetImageController.profile)
Router.get('/api/user/profile/img/header/:image', GetImageController.header)

//login controller

//register controller

//follow controller

export default Router
