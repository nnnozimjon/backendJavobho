import LoginController from './auth/login'
import RegisterController from './auth/register'
import ValidatorController from './validators'
import GetImageController from './post/getImage'
import PostController from './post/postPost'
import GetHashTagsController from './hashTags/getHashTags'
import GetFollowController from './follow/getFollow'
import GetPostsController from './post/getPosts'
import UserController from './follow/user'

const System = {
  LoginController,
  RegisterController,
  ValidatorController,
  // GetFollowController,
  // GetImageController,
  // PostController,
  // GetHashTagsController,
  // GetPostsController,
  // UserController,
}

export default System
