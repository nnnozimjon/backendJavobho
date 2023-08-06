import express from 'express'
import { RequestLimiter, PostRequestLimiter } from '../middleware/RateLimit'
import PassportMiddleware from '../middleware'
import { apiPaths } from '../contants/apiPaths'
import System from '../controllers'
const Router = express.Router()

Router.post(apiPaths.login, RequestLimiter, System.LoginController.login)
Router.post(
  apiPaths.register,
  RequestLimiter,
  System.RegisterController.register
)
Router.get(apiPaths.getProfileAvatarImage, System.GetImageController.profile)
Router.get(apiPaths.getProfileHeaderImage, System.GetImageController.header)
Router.get(apiPaths.getPostsImage, System.GetImageController.posts)
Router.post(
  apiPaths.postUploadPost,
  PostRequestLimiter,
  System.PostController.Post
)
Router.get(
  apiPaths.getExploreTags,
  PassportMiddleware,
  System.GetHashTagsController.tags
)
Router.get(
  apiPaths.getUserFollowersAndFollowings,
  PassportMiddleware,
  System.GetFollowController.getFollowersAndFollowing
)
Router.post(
  apiPaths.postFollowUser,
  [PassportMiddleware, PostRequestLimiter],
  System.GetFollowController.postFollow
)
Router.post(
  apiPaths.postUnfollowUser,
  [PassportMiddleware, PostRequestLimiter],
  System.GetFollowController.postUnfollow
)
Router.get(
  apiPaths.getUserPosts,
  PassportMiddleware,
  System.GetPostsController.getUserPosts
)

Router.get(
  apiPaths.getFeedPosts,
  PassportMiddleware,
  System.GetPostsController.feedPosts
)

Router.post(
  apiPaths.commentPost,
  PassportMiddleware,
  System.PostController.commentPost
)
Router.post(
  apiPaths.updateProfile,
  PassportMiddleware,
  System.UserController.updateProfile
)

Router.post(
  apiPaths.likePost,
  PassportMiddleware,
  System.PostController.likePost
)
Router.post(
  apiPaths.unlikePost,
  PassportMiddleware,
  System.PostController.unlikePost
)
Router.post(
  apiPaths.repostPost,
  PassportMiddleware,
  System.PostController.repostPost
)

Router.get(
  apiPaths.userProfile,
  PassportMiddleware,
  System.UserController.profile
)

Router.post(
  apiPaths.checkUsername,
  PassportMiddleware,
  System.UserController.checkUsernameExists
)

Router.post(
  apiPaths.repostPost,
  PassportMiddleware,
  System.PostController.repostPost
)
Router.post(
  apiPaths.bookmarkPost,
  PassportMiddleware,
  System.PostController.bookmarkPost
)

Router.post(
  apiPaths.bookmarkDelete,
  PassportMiddleware,
  System.PostController.bookmarkDelete
)

Router.get(apiPaths.getFeedPosts)

export default Router
