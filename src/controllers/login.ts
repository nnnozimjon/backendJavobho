import { Request, Response } from 'express'
import IAuth from './interfaces/auth.interface'
import jwt from 'jsonwebtoken'
import secret from '../validators'
import { checkPassword, checkUser, getUserPayload } from './check/login'
import { baseUrl } from '../utils/baseURL'
class LoginController {
  static async login(req: Request, res: Response) {
    const { username, password, robot }: IAuth.login = req.body

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
      return res.json({ message: 'Username not found!' })
    }

    const isPasswordTrue = await checkPassword(username, password)

    if (!isPasswordTrue) {
      return res.json({ message: 'Wrong password!' })
    }

    const payload: IAuth.payload = await getUserPayload(username)

    const token = await jwt.sign(
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

    res.json({
      message: `Success`,
      token,
    })
  }
}

export default LoginController
