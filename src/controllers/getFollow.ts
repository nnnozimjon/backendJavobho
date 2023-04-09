import { Request, Response } from 'express'
import { con } from '../app'
import { baseUrl } from '../utils/baseURL'

interface followers {
  userId: number
  avatar: string
  username: string
  verified: boolean
  fullname: string
}
class GetFollowController {
  static async getFollowersAndFollowing(req: Request, res: Response) {
    try {
      const userId = req.params.userId

      const sqlFollowers = `SELECT userId, username, fullname, verified, avatar
      FROM jvb_users
      WHERE userId IN (
        SELECT userId
        FROM jvb_follow
        WHERE followingId = ?
      )
      AND userId <> ?`
      const sqlFollowing = `SELECT userId, username, fullname, verified, avatar
      FROM jvb_users
      WHERE userId IN (
        SELECT userId
        FROM jvb_follow
        WHERE followerId = ?
      )
      AND userId <> ?`

      const followers: followers[] = await new Promise((resolve, reject) => {
        con.query(sqlFollowers, [userId, userId], (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      const following: followers[] = await new Promise((resolve, reject) => {
        con.query(sqlFollowing, [userId, userId], (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      const followersWithAvatar = followers.map((follower: followers) => ({
        ...follower,
        avatar: `${baseUrl}/api/user/profile/img/avatar/${follower.avatar}`,
      }))

      const followingWithAvatar = following.map((following: followers) => ({
        ...following,
        avatar: `${baseUrl}/api/user/profile/img/avatar/${following.avatar}`,
      }))

      res.json({
        payload: {
          followers: followersWithAvatar,
          following: followingWithAvatar,
        },
      })
    } catch (error) {
      res.sendStatus(501)
    }
  }
  static async getFollowing(req: Request, res: Response) {}
  static async postFollow(req: Request, res: Response) {}
  static async postUnfollow(req: Request, res: Response) {}
}

export default GetFollowController
