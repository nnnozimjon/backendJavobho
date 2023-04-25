import { Request, Response } from 'express'
import { con } from '../app'
import { baseUrl } from '../utils/baseURL'
import isUserRequester from './check/isUserRequester'
import jwt from 'jsonwebtoken'
import secret from '../validators'

class UserController {
  static async profile(req: Request, res: Response) {
    try {
      const { username } = req.params

      const userSql =
        'SELECT userId, username, fullname, description, verified, avatar, splashImage, createdAt FROM jvb_users WHERE username = ?'

      const User: any = await new Promise((resolve, reject) => {
        con.query(userSql, username, (err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result.find((user: any) => user.username === username))
        })
      })

      res.json({
        payload: {
          userId: User?.userId,
          username: User?.username,
          description: User?.description,
          fullname: User?.fullname,
          verified: User?.verified,
          avatar: `${baseUrl}/api/user/profile/img/avatar/${User?.avatar}`,
          splashImage: `${baseUrl}/api/user/profile/img/header/${User?.splashImage}`,
          createdAt: User?.createdAt,
        },
      })
    } catch (error) {
      res.sendStatus(400)
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const token = req.headers?.authorization
      const { userId, username, fullname, description } = req.body
      const userSql =
        'UPDATE jvb_users SET username = ?, fullname = ?, description = ? WHERE userId = ?'

      if (await isUserRequester(token, userId)) {
        const result: any = await new Promise((resolve, reject) => {
          con.query(
            userSql,
            [username, fullname, description, userId],
            (err, result) => {
              if (err) {
                reject(err)
              }
              resolve(result)
            }
          )
        })

        if (result.affectedRows > 0) {
          const sql =
            'SELECT userId, username, fullname, description, verified, avatar, splashImage, createdAt FROM jvb_users WHERE userId = ?'

          const payload: any = await new Promise((resolve, reject) => {
            con.query(sql, [userId], (error, result) => {
              if (error) {
                reject(error)
              }
              resolve(result[0])
            })
          })
          const token = jwt.sign(
            {
              ...payload,
              avatar: `${baseUrl}/api/user/profile/img/avatar/${payload.avatar}`,
              splashImage: `${baseUrl}/api/user/profile/img/header/${payload.splashImage}`,
            },
            secret,
            {
              expiresIn: '3d',
            }
          )
          if (payload) {
            res.json({
              message: 'success',
              token,
            })
          } else {
            res.json({
              message: 'logout',
            })
          }
        }
      } else {
        res.sendStatus(400)
      }
    } catch (error) {
      res.json({ message: 'failed' })
    }
  }

  static async checkUsernameExists(req: Request, res: Response) {
    const { username, userId } = req.body
    try {
      const sql = `SELECT * FROM jvb_users WHERE username = ? AND userId != ?`
      const result: any = await new Promise((resolve, reject) => {
        con.query(sql, [username, userId], (err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result)
        })
      })
      if (result.length > 0) {
        res.json({ message: false })
      } else {
        res.json({ message: true })
      }
    } catch (error) {
      res.json({ message: 'failed' })
    }
  }
}

export default UserController
