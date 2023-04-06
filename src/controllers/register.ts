import { Request, Response } from 'express'
import IAuth from './interfaces/auth.interface'
import {
  checkEmailAvailability,
  checkUsernameAvailability,
  createUser,
} from './check/UserExistance'

class RegisterController {
  static async register(req: Request, res: Response) {
    const { username, fullname, description, email, password }: IAuth.register =
      req.body

    if (!username || !email || !password) {
      return res.json({
        message:
          'One of the following required parameters is missing: username, email, or password!',
      })
    }

    if (username.length < 3) {
      return res.json({
        message: 'Username must be at least 3 characters long!',
      })
    }

    if (password.length < 8) {
      return res.json({
        message: 'Password must be at least 8 characters long!',
      })
    }

    if (!email.includes('@')) {
      return res.json({
        message: 'Email address is not valid!',
      })
    }

    const isUsernameAvailable = await checkUsernameAvailability(username)
    if (!isUsernameAvailable) {
      return res.json({
        message: 'Username already registered!',
      })
    }

    const isEmailAvailable = await checkEmailAvailability(email)
    if (!isEmailAvailable) {
      return res.json({
        message: 'User with the following email already exists!',
      })
    }

    const isUserCreated = await createUser({
      username,
      email,
      password,
      description,
      fullname,
    })
    if (!isUserCreated) {
      return res.json({
        message: 'Error creating user: Please try again!',
      })
    }

    res.json({ message: 'User created!' })
  }
}

export default RegisterController
