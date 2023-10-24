import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import IAuth from '../../interfaces/auth.interface'
import { userSecretKey } from '../../common/token'
import { baseUrl } from '../../utils/baseURL'
import ValidatorController from '../validators'

class LoginController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const requiredParams = {
        email,
        password,
      }

      const isRequiredParams =
        ValidatorController.validateRequiredFields(requiredParams)

      console.log(isRequiredParams)

      if (!isRequiredParams.valid) {
        return res.status(400).json({
          code: 400,
          message: 'Отсутствуют обязательные поля!',
        })
      }

      if (!ValidatorController.isValidEmail(email)) {
        return res
          .status(400)
          .json({ code: 400, message: 'Неверный адрес электронной почты!' })
      }

      const user: any = await ValidatorController.isUserCredentialCorrect(
        res,
        email,
        password
      )

      if (!user) {
        return res.status(400).json({
          code: 400,
          message: 'Неверные учетные данные!',
        })
      }

      const token = await jwt.sign(
        {
          userId: user.userId,
          userName: user.username,
          email: user.email,
        },
        userSecretKey,
        {
          expiresIn: '3d',
        }
      )

      res.status(200).json({
        code: 200,
        token,
      })
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: 'Внутренняя ошибка сервера!',
      })
    }
  }
}

export default LoginController
