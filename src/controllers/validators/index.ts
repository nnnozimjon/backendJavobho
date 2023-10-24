import { UserModel } from '../../models/index'
import { Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import fs from 'fs/promises'
import path from 'path'
import { userSecretKey } from '../../common/token'

class ValidatorController {
  static isValidEmail(email: any) {
    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

    // Test the email against the regular expression
    return emailRegex.test(email)
  }

  static async isUserByEmailExists(email: string) {
    try {
      const existingStoreByEmail = await UserModel.findOne({
        where: {
          email,
        },
      })

      return !!existingStoreByEmail
    } catch (error) {
      console.log('Error checking user existence: ' + error)
      return true
    }
  }

  static async isUserByUsernameExists(userName: string) {
    try {
      const existingStoreName = await UserModel.findOne({
        where: {
          username: userName,
        },
      })

      return !!existingStoreName
    } catch (error) {
      console.log('Error checking username existence: ' + error)
      return true
    }
  }

  static cleanPhoneNumber(phoneNumber: string) {
    return phoneNumber.replace(/\D/g, '')
  }

  static validatePhoneNumber(phoneNumber: string) {
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '')

    // Check if the cleaned phone number starts with "992" and has a length of exactly 12
    return cleanPhoneNumber.length === 12
  }

  static validateRequiredFields(fields: { [key: string]: any }): {
    valid: boolean
    error: string
  } {
    for (const key in fields) {
      if (!fields[key]) {
        return { valid: false, error: `${key} требуется!` }
      }
    }
    return { valid: true, error: '' }
  }

  static isNameValid(name: any) {
    // Basic validation for names (only letters and spaces)
    const nameRegex = /^[A-Za-z\s]+$/
    return nameRegex.test(name)
  }

  static isUsernameValid(username: any) {
    // Basic validation for usernames (letters, numbers, underscores)
    const usernameRegex = /^[A-Za-z0-9_]+$/
    return usernameRegex.test(username)
  }

  static async deleteFile(file: any, folder: string) {
    if (file) {
      const filePath = path.resolve(
        __dirname,
        `../../assets/${folder}/${file?.filename}`
      )
      await fs.unlink(filePath)
    }
  }

  static async isUserCredentialCorrect(
    res: Response,
    email: string,
    password: string
  ) {
    try {
      const user = await UserModel.findOne({
        where: {
          email,
        },
      })

      if (user) {
        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password)

        if (passwordMatch) {
          return user
        } else {
          return null // Passwords do not match
        }
      } else {
        return null // user not found
      }
    } catch (err: any) {
      return res.status(500).json({
        code: 500,
        message: err.message,
      })
    }
  }

  static getTokenData(
    token: string,
    res: Response
  ): {
    userId: number
    userName: string
    email: string
  } {
    const tokenValue = token.split(' ')[1]

    const decodedToken: any = jwt.verify(
      tokenValue,
      userSecretKey,
      (err, decoded) => {
        if (err) {
          res.status(401).json({
            code: 401,
            message: 'Неавторизованный!',
          })
        }

        return decoded
      }
    )

    return {
      userId: decodedToken.userId,
      userName: decodedToken.username,
      email: decodedToken.email,
    }
  }
}

export default ValidatorController
