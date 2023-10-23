export type DB = {
  host: string
  port?: number
  database: string
  user: string
  password: string
  timezone: string
}

export interface Database {
  query(sql: string, values?: any[]): Promise<any>
}

type dateOrString = Date | string
type numOrNull = number | null
type strOrNull = string | null

// User Model
export interface User {
  userId: number
  username: string
  fullname: string
  description: string
  verified: boolean
  avatar: string
  splashImage: string
  email: string
  emailVerified: boolean
  password: string
  createdAt: dateOrString
}

// Tag model
export interface Tag {
  tagId: number
  name: string
  category: string
  createdAt: dateOrString
}

// PostTag model
export interface PostTag {
  postId: number
  tagId: number
  createdAt: dateOrString
}

// Post model
export interface Post {
  postId: number
  text: string
  image: string
  type: string
  status: string
  userId: number
  reposterId: numOrNull
  reposterText: strOrNull
  createdAt: dateOrString
}

// likes model
export interface Like {
  likeId: number
  userId: number
  postId: number
  createdAt: dateOrString
}

// follow model
export interface Follow {
  followId: number
  followerId: number
  followingId: number
  timestamp: dateOrString
}

// comment model
export interface Comment {
  commentId: number
  userId: number
  text: string
  createdAt: dateOrString
  postId: number
  status: string
}

// comment like model
export interface CommentLike {
  commentLikeId: number
  userId: number
  commentId: number
  createdAt: dateOrString
}

// bookmark model
export interface Bookmark {
  bookId: number
  postId: number
  userId: number
  createdAt: dateOrString
}
