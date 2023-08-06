import { Request, Response } from 'express'
import { con } from '../../app'
import { baseUrl } from '../../utils/baseURL'
import secret from '../../validators'
import jwt from 'jsonwebtoken'
import { Comment, Post } from '../../interfaces/post.inteface'

class GetPostsController {
  static async getUserPosts(req: Request, res: Response) {
    const access_token = req.headers?.authorization
    const token = access_token?.slice(7).replace(/"/g, '') || ''
    const decoded: any = jwt.verify(token, secret)

    const RequesterId = decoded?.userId

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
      ju.avatar,
      jp.reposterText,
      ja.userId AS reposterUserId,
      ja.username AS reposterUsername,
      ja.fullname AS reposterFullname,
      ja.verified AS reposterVerified
      FROM jvb_posts jp
      LEFT JOIN jvb_users ju ON jp.userId = ju.userId
      LEFT JOIN jvb_users ja ON jp.reposterId = ja.userId
      WHERE jp.userId = ? AND (jp.status = 'publish') AND (jp.type = 'post' OR jp.type = 'repost')
      ORDER BY jp.createdAt DESC;`

      const commentSql = `SELECT jc.commentId,
      jc.userId,
      text as commentText,
      jc.createdAt,
      jc.postId,
      jc.status,
      ju.username as commenterUsername,
      ju.verified as commenterVerified,
      ju.fullname as commenterFullname,
      ju.avatar as commenterAvatar
      FROM jvb_comments jc
      LEFT JOIN jvb_users ju ON ju.userId = jc.userId
      WHERE postId IN (?) AND jc.status = 'publish' ORDER BY jc.createdAt DESC;`

      const likesSql = `
      SELECT likeID,
      userId,
      objectId
      from jvb_likes WHERE objectId IN  (?);`

      const likedUsers = `SELECT
      userId,
      username,
      verified,
      fullname
      from jvb_users WHERE userId in (?);`

      const commentLikeSql = `SELECT commentId, COUNT(*) AS likeCount, GROUP_CONCAT(userId) AS userIds FROM jvb_commentLike WHERE commentId IN (?) GROUP BY commentId;`

      const repostSql = `SELECT postId, COUNT(*) AS repostCount FROM jvb_posts WHERE jvb_posts.type = 'repost' AND jvb_posts.postId IN (?) GROUP BY postId;`

      const bookmarkQuery = `SELECT bookId, postId from jvb_bookmarks WHERE userId = ?;`

      const followersQuery = `SELECT followId, followingId from jvb_follow WHERE followerId = ?`

      const followersArray: any[] = await new Promise((resolve, reject) => {
        con.query(followersQuery, RequesterId, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
      const followersList = followersArray.map(follow => {
        return follow.followingId
      })

      const bookMarksArray: any[] = await new Promise((resolve, reject) => {
        con.query(bookmarkQuery, RequesterId, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      const bookedPosts = bookMarksArray.map(post => {
        return post.postId
      })

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

      const repostQuery = postIds.length > 0 ? postIds : 0

      const repost: any[] = await new Promise((resolve, reject) => {
        con.query(repostSql, [repostQuery], (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      const commentQuery = postIds.length > 0 ? postIds : 0
      // get all comments with post ids
      const comments: Comment[] = await new Promise((resolve, reject) => {
        con.query(commentSql, [commentQuery], (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      const commentIds = await comments.map(comment => {
        return comment.commentId
      })

      const commentLikeQuery = commentIds.length > 0 ? commentIds : 0
      const commentLikes: any[] = await new Promise((resolve, reject) => {
        con.query(commentLikeSql, [commentLikeQuery], (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      const likesQuery = postIds.length > 0 ? postIds : 0
      const likes: any[] = await new Promise((resolve, reject) => {
        con.query(likesSql, [likesQuery], (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      const likedIds = await likes.map(like => {
        return like.userId
      })

      const likedQuery = likedIds.length > 0 ? likedIds : 0

      const AlllikedUsers: any[] = await new Promise((resolve, reject) => {
        con.query(likedUsers, [likedQuery], (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      const formatedPosts = posts.map(post => {
        const postComments = comments.filter(
          comment => comment.postId == post.postId
        )
        const postLikes = likes.filter(like => like.objectId == post.postId)
        const postLikedByUser = postLikes.some(
          like => like.userId == RequesterId
        )

        const BookMarked = bookedPosts.some(book => post.postId == book)

        const isFollowing = followersList.some(follow => post.userId == follow)

        const commentsLikes = postComments.map(comment => {
          const filteredLikes = commentLikes.filter(
            like => like.commentId == comment.commentId
          )
          const commentLikeCount = filteredLikes[0]?.likeCount

          const commentLikedbyUser = filteredLikes.some(
            like => like.userIds == RequesterId
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
        const postImage =
          post.image && baseUrl + '/api/user/profile/posts/post/' + post.image
        const avatarImage =
          post.avatar && baseUrl + '/api/user/profile/img/avatar/' + post.avatar
        const repostCountFilter = repost.filter(
          repost => repost.postId === post.postId
        )[0]?.repostCount

        const postCommentsMap = postComments.map(comment => ({
          commentId: comment.commentId,
          userId: comment.userId,
          text: comment.commentText,
          createdAt: comment.createdAt,
          commenterUsername: comment.commenterUsername,
          commenterVerified: comment.commenterVerified,
          commenterFullname: comment.commenterFullname,
          commenterAvatar:
            comment.commenterAvatar &&
            baseUrl + '/api/user/profile/img/avatar/' + comment.commenterAvatar,
          commentLikeCount: commentsLikes.find(
            like => like.commentId === comment.commentId
          )?.commentLikeCount,
          commentLikeByUser: commentsLikes.find(
            like => like.commentId === comment.commentId
          )?.commentLikedbyUser,
        }))

        return {
          postId: post.postId,
          text: post.text,
          image: postImage,
          type: post.type,
          status: post.status,
          createdAt: post.createdAt,
          userId: post.userId,
          username: post.username,
          fullname: post.fullname,
          verified: post.verified,
          avatar: avatarImage,
          likedByUser: postLikedByUser,
          repostCount: repostCountFilter,
          comments: postCommentsMap,
          likedByUsers: postLikedByUsers,
          reposterId: post.reposterId,
          reposterText: post.reposterText,
          reposterUsername: post.reposterUsername,
          reposterFullname: post.reposterFullname,
          reposterVerified: post.reposterVerified,
          booked: BookMarked,
          isFollowing: isFollowing,
        }
      })

      res.json({
        message: 'success',
        payload: formatedPosts,
      })
    } catch (error) {
      res.json({ message: 'failed', error: error })
    }
  }

  static async feedPosts(req: Request, res: Response) {
    const userId = req.params.userId

    try {
      const followingUsersSql = `SELECT userId as userIds
      FROM jvb_follow jf
      left join jvb_users ju on ju.userId = jf.followingId
      where followerId = ? ORDER BY jf.timestamp DESC;`

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
      WHERE jp.userId IN (?) AND jp.status = 'publish'
      ORDER BY jp.createdAt DESC;`

      const commentSql = `SELECT jc.commentId,
      jc.userId,
      text as commentText,
      jc.createdAt,
      jc.postId,
      jc.status,
      ju.username as commenterUsername,
      ju.verified as commenterVerified,
      ju.fullname as commenterFullname,
      ju.avatar as commenterAvatar
      FROM jvb_comments jc
      LEFT JOIN jvb_users ju ON ju.userId = jc.userId
      WHERE postId IN (?) AND jc.status = 'publish' ORDER BY jc.createdAt DESC;`

      const likesSql = `
      SELECT likeID,
      userId,
      objectId
      from jvb_likes WHERE objectId IN  (?);`

      const likedUsers = `SELECT
      userId,
      username,
      verified,
      fullname
      from jvb_users WHERE userId in (?);`

      const commentLikeSql = `SELECT commentId, COUNT(*) AS likeCount, GROUP_CONCAT(userId) AS userIds FROM jvb_commentLike WHERE commentId IN (?) GROUP BY commentId;`

      const getAllFollwingUsers: any[] = await new Promise(
        (resolve, reject) => {
          con.query(followingUsersSql, [userId], (err, result) => {
            if (err) reject(err)
            resolve(result)
          })
        }
      )

      const followedUsers =
        getAllFollwingUsers.length > 0
          ? await Promise.all(getAllFollwingUsers.map(user => user.userIds))
          : 0

      const posts: Post[] = await new Promise((resolve, reject) => {
        con.query(postSql, [followedUsers], (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      // get all posts ids from posts
      const postIds = await posts.map(post => {
        return post.postId
      })
      const commentQuery = postIds.length > 0 ? postIds : 0
      // get all comments with post ids
      const comments: Comment[] = await new Promise((resolve, reject) => {
        con.query(commentSql, [commentQuery], (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      const commentIds = await comments.map(comment => {
        return comment.commentId
      })

      const commentLikeQuery = commentIds.length > 0 ? commentIds : 0

      const commentLikes: any[] = await new Promise((resolve, reject) => {
        con.query(commentLikeSql, [commentLikeQuery], (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      const likesQuery = postIds.length > 0 ? postIds : 0

      const likes: any[] = await new Promise((resolve, reject) => {
        con.query(likesSql, [likesQuery], (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      const likedIds = await likes.map(like => {
        return like.userId
      })

      const likedQuery = likedIds.length > 0 ? likedIds : 0

      const AlllikedUsers: any[] = await new Promise((resolve, reject) => {
        con.query(likedUsers, [likedQuery], (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      const formattedData = {
        message: 'success',
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
            image:
              post.image &&
              baseUrl + '/api/user/profile/posts/post/' + post.image,
            type: post.type,
            status: post.status,
            createdAt: post.createdAt,
            userId: post.userId,
            username: post.username,
            fullname: post.fullname,
            verified: post.verified,
            avatar:
              post.avatar &&
              baseUrl + '/api/user/profile/img/avatar/' + post.avatar,
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
                comment.commenterAvatar &&
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
      res.json(formattedData)
    } catch (error) {
      res.json({ message: 'failed', error: error })
    }
  }
}

export default GetPostsController
