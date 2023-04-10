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
      FROM jvb_follow jf
            left join jvb_users ju on ju.userId = jf.followerId
      where followingId=?`
      const sqlFollowing = `SELECT userId, username, fullname, verified, avatar
      FROM jvb_follow jf
            left join jvb_users ju on ju.userId = jf.followingId
      where followerId=?`

      const followers: followers[] = await new Promise((resolve, reject) => {
        con.query(sqlFollowers, userId, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      const following: followers[] = await new Promise((resolve, reject) => {
        con.query(sqlFollowing, userId, (err, result) => {
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
  static async postFollow(req: Request, res: Response) {
    const { followerId, followingId } = req.body

    try {
      const sql = `INSERT INTO jvb_follow (followerId,followingId) VALUES(?,?)`

      const result: any = await new Promise((resolve, reject) => {
        con.query(sql, [followerId, followingId], (err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result)
        })
      })
      if (result.affectedRows > 0) {
        res.json(200)
      } else {
        res.sendStatus(501)
      }
    } catch (error) {
      return res.sendStatus(501)
    }
  }
  static async postUnfollow(req: Request, res: Response) {
    const { followerId, followingId } = req.body

    try {
      const sql = `DELETE FROM jvb_follow WHERE followerId = ? AND followingId = ?`

      const result: any = await new Promise((resolve, reject) => {
        con.query(sql, [followerId, followingId], (err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result)
        })
      })
      if (result.affectedRows > 0) {
        res.json(200)
      } else {
        res.sendStatus(501)
      }
    } catch (error) {
      return res.sendStatus(501)
    }
  }
}

export default GetFollowController
