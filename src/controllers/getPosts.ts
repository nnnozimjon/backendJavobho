import { Request, Response } from 'express'
import { con } from '../app'
import { baseUrl } from '../utils/baseURL'

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

      const commentSql = `SELECT commentId,
      userId,
      text as commentText,
      createdAt,
      postId
      FROM jvb_comments
      WHERE postId IN (?);`

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

      const posts: any[] = await new Promise((resolve, reject) => {
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
      const comments: any[] = await new Promise((resolve, reject) => {
        con.query(commentSql, [postIds], (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      const likes: any[] = await new Promise((resolve, reject) => {
        con.query(likesSql, [postIds], (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      const likedIds = await likes.map(like => {
        return like.userId
      })

      const AlllikedUsers: any[] = await new Promise((resolve, reject) => {
        con.query(likedUsers, [likedIds], (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      const formattedData = {
        payload: posts.map(post => {
          const postComments = comments.filter(
            comment => comment.postId === post.postId
          )
          const postLikes = likes.filter(like => like.objectId === post.postId)
          const postLikedByUser = postLikes.some(like => like.userId == userId)

          const postLikedByUsers = postLikes.map(like => {
            const user = AlllikedUsers.find(user => user.userId === like.userId)
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
            image: post.image,
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
              userId: comment.userId,
              text: comment.commentText,
              createdAt: comment.createdAt,
              postId: comment.postId,
            })),
            likedByUsers: postLikedByUsers,
          }
        }),
      }

      res.json(formattedData)
    } catch (error) {
      res.sendStatus(501)
    }
  }

  static createPost() {}
  static feedPosts() {}
}

export default GetPostsController
