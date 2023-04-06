import { con } from '../../app'
import IAuth from '../interfaces/auth.interface'
import bcrypt from 'bcrypt'

async function checkUsernameAvailability(username: string): Promise<boolean> {
  const sql = `SELECT * FROM jvb_users WHERE username = ?`
  try {
    const result: any = await new Promise((resolve, reject) => {
      con.query(sql, username, (err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      })
    })
    if (result.length > 0) {
      return false
    } else {
      return true
    }
  } catch (err) {
    return false
  }
}

async function checkEmailAvailability(email: string): Promise<boolean> {
  const sql = `SELECT * FROM jvb_users WHERE email = ?`
  try {
    const result: any = await new Promise((resolve, reject) => {
      con.query(sql, email, (err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      })
    })
    if (result.length > 0) {
      return false
    } else {
      return true
    }
  } catch (err) {
    return false
  }
}

async function createUser({
  username,
  email,
  password,
  description,
  fullname,
}: IAuth.register): Promise<boolean> {
  const salt = 10
  const hashedPassword = await bcrypt.hash(password, salt)
  const sql =
    'INSERT INTO jvb_users (username, fullname, email, password, description) VALUES (?,?,?,?,?)'

  try {
    const result: any = await new Promise((resolve, reject) => {
      con.query(
        sql,
        [username, fullname || '', email, hashedPassword, description || ''],
        (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        }
      )
    })

    return result.affectedRows > 0
  } catch (err) {
    console.error('Error creating user:', err)
    return false
  }
}
export { checkEmailAvailability, checkUsernameAvailability, createUser }
