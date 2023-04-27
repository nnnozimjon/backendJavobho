import { Request, Response } from 'express'
import { con } from '../app'
import { baseUrl } from '../utils/baseURL'
import jwt from 'jsonwebtoken'
import secret from '../validators'
import isUserRequester from './check/isUserRequester'

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
      res.sendStatus(500)
    }
  }
  static async getFollowing(req: Request, res: Response) {}

  static postFollow = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization

      const { followerId, followingId } = req.body

      if (await isUserRequester(token, followerId)) {
        if (followerId !== followerId) {
          return res.sendStatus(401)
        }

        if (followerId === followingId) {
          return res.sendStatus(400)
        }

        const sql = `INSERT INTO jvb_follow (followerId,followingId) VALUES(?,?)`

        const result: any = await new Promise((resolve, reject) => {
          con.query(sql, [followerId, followingId], (err, result) => {
            if (err) {
              reject(err)
            }
            resolve(result)
          })
        })

        res.json({ message: result.affectedRows > 0 ? 'success' : 'failed' })
      }
    } catch (error) {
      res.sendStatus(500)
    }
  }

  static async postUnfollow(req: Request, res: Response) {
    const token = req.headers.authorization
    const { followerId, followingId } = req.body

    try {
      const sql = `DELETE FROM jvb_follow WHERE followerId = ? AND followingId = ?`

      if (await isUserRequester(token, followerId)) {
        const result: any = await new Promise((resolve, reject) => {
          con.query(sql, [followerId, followingId], (err, result) => {
            if (err) {
              reject(err)
            }
            resolve(result)
          })
        })

        res.json({ message: result.affectedRows > 0 ? 'success' : 'failed' })
      } else {
        res.sendStatus(400)
      }
    } catch (error) {
      return res.sendStatus(500)
    }
  }
}

export default GetFollowController
