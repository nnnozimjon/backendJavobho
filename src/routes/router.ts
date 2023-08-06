import express from 'express'
import RouteController from '../controllers'
import LoginController from '../controllers/login'
import RegisterController from '../controllers/register'
import { RequestLimiter, PostRequestLimiter } from '../middleware/RateLimit'
import PassportMiddleware from '../middleware'
import GetImageController from '../controllers/getImage'
import GetHashTagsController from '../controllers/getHashTags'
import GetFollowController from '../controllers/getFollow'
import GetPostsController from '../controllers/getPosts'
import PostController from '../controllers/postPost'
import { apiPaths } from '../contants/apiPaths'
import UserController from '../controllers/user'

const Router = express.Router()

Router.get(apiPaths.index, RouteController.home)

Router.post(apiPaths.login, RequestLimiter, LoginController.login)
Router.post(apiPaths.register, RequestLimiter, RegisterController.register)

Router.get(apiPaths.getProfileAvatarImage, GetImageController.profile)
Router.get(apiPaths.getProfileHeaderImage, GetImageController.header)
Router.get(apiPaths.getPostsImage, GetImageController.posts)
Router.post(apiPaths.postUploadPost, PostRequestLimiter, PostController.Post)

Router.get(
  apiPaths.getExploreTags,
  PassportMiddleware,
  GetHashTagsController.tags
)
Router.get(
  apiPaths.getUserFollowersAndFollowings,
  PassportMiddleware,
  GetFollowController.getFollowersAndFollowing
)
Router.post(
  apiPaths.postFollowUser,
  [PassportMiddleware, PostRequestLimiter],
  GetFollowController.postFollow
)
Router.post(
  apiPaths.postUnfollowUser,
  [PassportMiddleware, PostRequestLimiter],
  GetFollowController.postUnfollow
)
Router.get(
  apiPaths.getUserPosts,
  PassportMiddleware,
  GetPostsController.getUserPosts
)

Router.get(
  apiPaths.getFeedPosts,
  PassportMiddleware,
  GetPostsController.feedPosts
)

Router.post(
  apiPaths.commentPost,
  PassportMiddleware,
  PostController.commentPost
)
Router.post(
  apiPaths.updateProfile,
  PassportMiddleware,
  UserController.updateProfile
)

Router.post(apiPaths.likePost, PassportMiddleware, PostController.likePost)
Router.post(apiPaths.unlikePost, PassportMiddleware, PostController.unlikePost)
Router.post(apiPaths.repostPost, PassportMiddleware, PostController.repostPost)

Router.get(apiPaths.userProfile, PassportMiddleware, UserController.profile)

Router.post(
  apiPaths.checkUsername,
  PassportMiddleware,
  UserController.checkUsernameExists
)

Router.post(apiPaths.repostPost, PassportMiddleware, PostController.repostPost)
Router.post(
  apiPaths.bookmarkPost,
  PassportMiddleware,
  PostController.bookmarkPost
)

Router.post(
  apiPaths.bookmarkDelete,
  PassportMiddleware,
  PostController.bookmarkDelete
)

Router.get(apiPaths.getFeedPosts)

export default Router
