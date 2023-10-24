import express from 'express'
import { RequestLimiter, PostRequestLimiter } from '../middleware/RateLimit'
import Api from '../contants'
import System from '../controllers'
const Router = express.Router()

Router.post(Api.v1.auth.userLogin, RequestLimiter, System.LoginController.login)
Router.post(
  Api.v1.auth.userRegister,
  RequestLimiter,
  System.RegisterController.register
)

// Router.get(Api.getProfileAvatarImage, System.GetImageController.profile)
// Router.get(Api.getProfileHeaderImage, System.GetImageController.header)
// Router.get(Api.getPostsImage, System.GetImageController.posts)
// Router.post(Api.postUploadPost, PostRequestLimiter, System.PostController.Post)
// Router.get(
//   Api.getExploreTags,
//   PassportMiddleware,
//   System.GetHashTagsController.tags
// )
// Router.get(
//   Api.getUserFollowersAndFollowings,
//   PassportMiddleware,
//   System.GetFollowController.getFollowersAndFollowing
// )
// Router.post(
//   Api.postFollowUser,
//   [PassportMiddleware, PostRequestLimiter],
//   System.GetFollowController.postFollow
// )
// Router.post(
//   Api.postUnfollowUser,
//   [PassportMiddleware, PostRequestLimiter],
//   System.GetFollowController.postUnfollow
// )
// Router.get(
//   Api.getUserPosts,
//   PassportMiddleware,
//   System.GetPostsController.getUserPosts
// )

// Router.get(
//   Api.getFeedPosts,
//   PassportMiddleware,
//   System.GetPostsController.feedPosts
// )

// Router.post(
//   Api.commentPost,
//   PassportMiddleware,
//   System.PostController.commentPost
// )
// Router.post(
//   Api.updateProfile,
//   PassportMiddleware,
//   System.UserController.updateProfile
// )

// Router.post(Api.likePost, PassportMiddleware, System.PostController.likePost)
// Router.post(
//   Api.unlikePost,
//   PassportMiddleware,
//   System.PostController.unlikePost
// )
// Router.post(
//   Api.repostPost,
//   PassportMiddleware,
//   System.PostController.repostPost
// )

// Router.get(Api.userProfile, PassportMiddleware, System.UserController.profile)

// Router.post(
//   Api.checkUsername,
//   PassportMiddleware,
//   System.UserController.checkUsernameExists
// )

// Router.post(
//   Api.repostPost,
//   PassportMiddleware,
//   System.PostController.repostPost
// )
// Router.post(
//   Api.bookmarkPost,
//   PassportMiddleware,
//   System.PostController.bookmarkPost
// )

// Router.post(
//   Api.bookmarkDelete,
//   PassportMiddleware,
//   System.PostController.bookmarkDelete
// )

export default Router
