import { Request, Response } from 'express'

class LoginController {
  static login(req: Request, res: Response) {
    const { username, password } = req.body
    res.send(`Welcome ${username}, ${password}`)
    console.log(req.headers.authorization)
  }
}

export default LoginController
