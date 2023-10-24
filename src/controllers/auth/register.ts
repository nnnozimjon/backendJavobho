import { Request, Response } from 'express'
import IAuth from '../../interfaces/auth.interface'
import ValidatorController from '../validators'
import { UserModel } from '../../models'
import bcrypt from 'bcrypt'

class RegisterController {
  static async register(req: Request, res: Response) {
    try {
      const {
        username,
        fullname,
        description,
        email,
        password,
      }: IAuth.register = req.body

      const requiredParams = {
        username,
        fullname,
        description,
        email,
        password,
      }

      const validation =
        ValidatorController.validateRequiredFields(requiredParams)

      if (!validation.valid) {
        return res.status(400).json({
          code: 400,
          message: validation.error,
        })
      }

      const isEmailValid = ValidatorController.isValidEmail(email)

      if (!isEmailValid) {
        return res.status(400).json({
          code: 400,
          message: 'Адрес электронной почты неверен!',
        })
      }

      if (username.length <= 3) {
        return res.status(400).json({
          code: 400,
          message: 'Имя пользователя слишком короткое!',
        })
      }

      if (password.length <= 8) {
        return res.status(400).json({
          code: 400,
          message: 'Пароль слишком короткий!',
        })
      }

      const userNameExist = await ValidatorController.isUserByEmailExists(email)

      if (userNameExist) {
        return res.status(400).json({
          code: 400,
          message: 'Пользователь с таким именем уже существует!',
        })
      }

      const emailExist = await ValidatorController.isUserByEmailExists(email)

      if (emailExist) {
        return res.status(400).json({
          code: 400,
          message:
            'Пользователь по следующему адресу электронной почты существует!',
        })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      UserModel.create({
        username,
        fullname,
        description,
        email,
        password: hashedPassword,
      })

      res.status(200).json({
        code: 200,
        message: 'Пользователь успешно создан!',
      })
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: 'Внутренняя ошибка сервера!',
      })
    }
  }
}

export default RegisterController
