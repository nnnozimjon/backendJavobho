import express from 'express'
import RouteController from '../controllers'
import LoginController from '../controllers/login'
import RegisterController from '../controllers/register'
import RequestLimiter from '../middleware/RateLimit'
import PassportMiddleware from '../middleware'
import GetImageController from '../controllers/getImage'
import GetHashTagsController from '../controllers/getHashTags'
import GetFollowController from '../controllers/getFollow'
import GetPostsController from '../controllers/getPosts'
import PostController from '../controllers/postPost'

const Router = express.Router()

Router.get('/', RouteController.home)
Router.get('/api', RouteController.Welcome)

Router.post('/api/auth/login', RequestLimiter, LoginController.login)
Router.post('/api/auth/register', RequestLimiter, RegisterController.register)

Router.get('/api/user/profile/img/avatar/:image', GetImageController.profile)
Router.get('/api/user/profile/img/header/:image', GetImageController.header)
Router.get('/api/user/profile/posts/post/:image', GetImageController.posts)
Router.post('/api/user/upload/post', PostController.Post)

Router.get(
  '/api/user/explore/tags',
  PassportMiddleware,
  GetHashTagsController.tags
)
Router.get(
  '/api/user/profile/follow/:userId',
  PassportMiddleware,
  GetFollowController.getFollowersAndFollowing
)
Router.post(
  '/api/user/post/follow',
  // PassportMiddleware,
  GetFollowController.postFollow
)
Router.post(
  '/api/user/post/unfollow',
  PassportMiddleware,
  GetFollowController.postUnfollow
)
// get all user post
Router.get(
  '/api/user/get/posts/:userId',
  PassportMiddleware,
  GetPostsController.getUserPosts
)

Router.get('/check/:userId', GetPostsController.getUserPosts)

//login controller

//register controller

//follow controller

export default Router
