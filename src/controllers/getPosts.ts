import { Request, Response } from 'express'
import { con } from '../app'

class GetPostsController {
  static async getUserPosts(req: Request, res: Response) {
    const userId = req.params.userId

    try {
      const sql = `
      SELECT
        jvb_posts.postId,
        jvb_posts.text,
        jvb_posts.image,
        jvb_posts.type,
        jvb_posts.status,
        jvb_posts.createdAt,
        COALESCE(likesCount.likesCount, 0) AS likesCount,
        jvb_likes.userId AS likedBy,
        jvb_comments.commentId,
        jvb_comments.text AS commentText,
        jvb_comments.userId AS commentedBy,
        jvb_comments.createdAt AS commentCreatedAt,
        jvb_users.userId,
        jvb_users.username,
        jvb_users.fullname,
        jvb_users.verified,
        jvb_users.avatar
      FROM jvb_posts
      LEFT JOIN (
        SELECT objectId, type, COUNT(*) AS likesCount FROM jvb_likes GROUP BY objectId, type
      ) AS likesCount ON jvb_posts.postId = likesCount.objectId AND jvb_posts.type = likesCount.type
      LEFT JOIN jvb_likes ON jvb_posts.postId = jvb_likes.objectId AND jvb_posts.type = jvb_likes.type
      LEFT JOIN jvb_comments ON jvb_posts.postId = jvb_comments.postId
      JOIN jvb_users ON jvb_likes.userId = jvb_users.userId
      WHERE jvb_posts.userId = ?
    `

      const posts: any[] = await new Promise((resolve, reject) => {
        con.query(sql, userId, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      const formattedResult = posts.reduce((acc: any, curr: any) => {
        const post = acc.find((p: any) => p.postId === curr.postId)
        const comment = curr.commentId
          ? {
              commentId: curr.commentId,
              text: curr.commentText,
              userId: curr.commentedBy,
              createdAt: curr.commentCreatedAt,
              username: curr.username,
              fullname: curr.fullname,
              verified: curr.verified,
              avatar: curr.avatar,
            }
          : null
        const likedUser = curr.likedBy
          ? {
              userId: curr.userId,
              username: curr.username,
              fullname: curr.fullname,
              verified: curr.verified,
              avatar: curr.avatar,
            }
          : null

        if (!post) {
          acc.push({
            postId: curr.postId,
            text: curr.text,
            image: curr.image,
            type: curr.type,
            createdAt: curr.createdAt,
            comments: comment ? [comment] : [],
            liked: curr.likedBy == userId,
            likesCount: curr.likesCount,
            likedUsers: likedUser ? [likedUser] : [],
          })
        } else {
          if (comment) {
            post.comments.push(comment)
          }
          if (curr.likedBy) {
            post.likedUsers.push(likedUser)
          }
          if (curr.likedBy == userId) {
            post.liked = true
          }
        }

        return acc
      }, [])

      res.json({ payload: formattedResult })
    } catch (error) {
      res.sendStatus(501)
    }
  }

  static createPost() {}
  static feedPosts() {}
}

export default GetPostsController
