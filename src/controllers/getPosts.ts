import { Request, Response } from 'express'
import { con } from '../app'
import { baseUrl } from '../utils/baseURL'

interface Post {
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
}

interface Comment {
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

interface User {
  userId: number
  username: string
  verified: boolean
  fullname: string
}
class GetPostsController {
  static async getUserPosts(req: Request, res: Response) {
    const userId = req.params.userId

    try {
      const postSql = `
      SELECT jp.postId,
      jp.text,
      jp.image,
      jp.type,
      jp.status,
      jp.createdAt,
      jp.userId,
      ju.verified,
      ju.username,
      ju.fullname,
      ju.avatar
      FROM jvb_posts jp
      LEFT JOIN jvb_users ju ON jp.userId = ju.userId
      WHERE jp.userId = ?;`

      const commentSql = `SELECT jc.commentId,
      jc.userId,
      text as commentText,
      jc.createdAt,
      jc.postId,
      ju.username as commenterUsername,
      ju.verified as commenterVerified,
      ju.fullname as commenterFullname,
      ju.avatar as commenterAvatar
      FROM jvb_comments jc
      LEFT JOIN jvb_users ju ON ju.userId = jc.userId
      WHERE postId IN (?)`

      const likesSql = `
      SELECT likeID,
      userId,
      type,
      objectId
      from jvb_likes WHERE objectId IN  (?);`

      const likedUsers = `SELECT
      userId,
      username,
      verified,
      fullname
  from jvb_users WHERE userId in (?);`

      const commentLikeSql = `
      SELECT commentId, COUNT(*) AS likeCount, GROUP_CONCAT(userId) AS userIds
      FROM jvb_commentLike
      WHERE commentId IN (?)
      GROUP BY commentId;`

      const posts: Post[] = await new Promise((resolve, reject) => {
        con.query(postSql, userId, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      // get all posts ids from posts
      const postIds = await posts.map(post => {
        return post.postId
      })

      // get all comments with post ids
      const comments: Comment[] = await new Promise((resolve, reject) => {
        con.query(
          commentSql,
          [postIds.length > 0 ? postIds : 0],
          (err, result) => {
            if (err) reject(err)
            resolve(result)
          }
        )
      })

      const commentIds = await comments.map(comment => {
        return comment.commentId
      })

      const commentLikes: any[] = await new Promise((resolve, reject) => {
        con.query(
          commentLikeSql,
          [commentIds.length > 0 ? commentIds : 0],
          (err, result) => {
            if (err) reject(err)
            resolve(result)
          }
        )
      })

      const likes: any[] = await new Promise((resolve, reject) => {
        con.query(
          likesSql,
          [postIds.length > 0 ? postIds : 0],
          (err, result) => {
            if (err) reject(err)
            resolve(result)
          }
        )
      })

      const likedIds = await likes.map(like => {
        return like.userId
      })

      const AlllikedUsers: any[] = await new Promise((resolve, reject) => {
        con.query(
          likedUsers,
          [likedIds.length > 0 ? likedIds : 0],
          (err, result) => {
            if (err) reject(err)
            resolve(result)
          }
        )
      })

      const formattedData = {
        payload: posts.map(post => {
          const postComments = comments.filter(
            comment => comment.postId == post.postId
          )
          const postLikes = likes.filter(like => like.objectId == post.postId)
          const postLikedByUser = postLikes.some(like => like.userId == userId)

          const commentsLikes = postComments.map(comment => {
            const filteredLikes = commentLikes.filter(
              like => like.commentId == comment.commentId
            )
            const commentLikeCount = filteredLikes[0]?.likeCount

            const commentLikedbyUser = filteredLikes.some(
              like => like.userIds == userId
            )
            return {
              commentId: comment.commentId,
              commentLikeCount,
              commentLikedbyUser,
            }
          })

          const postLikedByUsers = postLikes.map(like => {
            const user = AlllikedUsers.find(user => user.userId == like.userId)
            return {
              userId: user.userId,
              username: user.username,
              verified: user.verified,
              fullname: user.fullname,
            }
          })

          return {
            postId: post.postId,
            text: post.text,
            image: baseUrl + '/api/user/profile/posts/post/' + post.image,
            type: post.type,
            status: post.status,
            createdAt: post.createdAt,
            userId: post.userId,
            username: post.username,
            fullname: post.fullname,
            verified: post.verified,
            avatar: baseUrl + '/api/user/profile/img/avatar/' + post.avatar,
            likedByUser: postLikedByUser,
            comments: postComments.map(comment => ({
              commentId: comment.commentId,
              userId: comment.userId,
              text: comment.commentText,
              createdAt: comment.createdAt,
              commenterUsername: comment.commenterUsername,
              commenterVerified: comment.commenterVerified,
              commenterFullname: comment.commenterFullname,
              commenterAvatar:
                baseUrl +
                '/api/user/profile/img/avatar/' +
                comment.commenterAvatar,
              commentLikeCount: commentsLikes.find(
                like => like.commentId === comment.commentId
              )?.commentLikeCount,
              commentLikeByUser: commentsLikes.find(
                like => like.commentId === comment.commentId
              )?.commentLikedbyUser,
            })),
            likedByUsers: postLikedByUsers,
          }
        }),
      }

      // res.json(commentLikes)
      res.json(formattedData)
    } catch (error) {
      res.sendStatus(501)
    }
  }

  static createPost() {}
  static feedPosts() {}
}

export default GetPostsController
