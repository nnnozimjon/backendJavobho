import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import IAuth from '../../interfaces/auth.interface'
import { checkPassword, checkUser, getUserPayload } from '../check/login'
import secret from '../../validators'
import { baseUrl } from '../../utils/baseURL'

class LoginController {
  static async login(req: Request, res: Response) {
    const { username, password, robot }: IAuth.login = req.body

    try {
      if (!username || !password) {
        return res.json({
          message:
            'One of the following parameters is missing: username, password!',
        })
      }

      if (!robot) {
        return res.json({ message: 'Please verify you are human!' })
      }

      if (username.length < 3) {
        return res.json({ message: 'Username must be at least 3 characters!' })
      }

      if (password.length < 8) {
        return res.json({ message: 'Password must be at least 8 characters!' })
      }

      const isUsernameAvailable = await checkUser(username)

      if (!isUsernameAvailable) {
        return res.json({ message: 'Wrong user or password combination' })
      }

      const isPasswordTrue = await checkPassword(username, password)

      if (!isPasswordTrue) {
        return res.json({ message: 'Wrong user or password combination!' })
      }

      const payload = await getUserPayload(username)

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

      return res.json({
        message: 'Success',
        token,
      })
    } catch (error) {
      console.error('Error during login:', error)
      return res.status(500).json({ message: 'Internal server error.' })
    }
  }
}

export default LoginController
