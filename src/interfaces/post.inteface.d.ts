export interface Post {
  postId: number
  text: string
  image: string
  type: string
  status: string
  createdAt: Date
  userId: number
  username: string
  fullname: string
  verified: boolean
  avatar: string
  likedByUser: boolean
  comments: Comment[]
  likedByUsers: User[]
  reposterId: number
  reposterText: string
  reposterUsername: string
  reposterFullname: string
  reposterVerified: boolean
}

export interface Comment {
  postId: number
  commentId: number
  userId: number
  commentText: string
  createdAt: Date
  commenterUsername: string
  commenterVerified: boolean
  commenterFullname: string
  commenterAvatar: string
  commentLikeCount: number
  commentLikedByUser: boolean
}

export interface User {
  userId: number
  username: string
  verified: boolean
  fullname: string
}
