import { Request, Response } from 'express'
import { con } from '../app'
import { baseUrl } from '../utils/baseURL'

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
}

export default UserController
