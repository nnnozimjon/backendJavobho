export const apiPaths = {
  index: '/',
  api: '/api',

  login: '/api/auth/login',
  register: '/api/auth/register',

  getFeedPosts: '/api/user/get/feed/posts/:userId',

  getProfileAvatarImage: '/api/user/profile/img/avatar/:image',
  getProfileHeaderImage: '/api/user/profile/img/header/:image',
  getPostsImage: '/api/user/profile/posts/post/:image',
  postUploadPost: '/api/user/upload/post',
  getExploreTags: '/api/user/explore/tags',
  getUserFollowersAndFollowings: '/api/user/profile/follow/:userId',
  postFollowUser: '/api/user/post/follow',
  postUnfollowUser: '/api/user/post/unfollow',
  getUserPosts: '/api/user/get/posts/:userId',

  // should be made
  commentPost: '/api/user/comment/post',
  likePost: '/api/user/like/post',
  unlikePost: '/api/user/unlike/post',
  repostPost: '/api/user/repost/post',
  userProfile: '/api/user/get/profile/:username',
}
