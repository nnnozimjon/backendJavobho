import { con } from '../../app'
import bcrypt from 'bcrypt'

async function checkUser(username: string): Promise<boolean> {
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
      return true
    } else {
      return false
    }
  } catch (err) {
    return false
  }
}

async function checkPassword(
  username: string,
  password: string
): Promise<boolean> {
  const sql = 'SELECT password FROM jvb_users WHERE username = ?'

  try {
    const result: any = await new Promise((resolve, reject) => {
      con.query(sql, username, (error, result) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })

    if (result.length === 0) {
      return false
    }

    const check = await bcrypt.compare(password, result[0].password)
    return check
  } catch (error) {
    console.error('Error checking password:', error)
    return false
  }
}

async function getUserPayload(username: string): Promise<any> {
  const sql =
    'SELECT userId, username, fullname, description, verified, avatar, splashImage, createdAt FROM jvb_users WHERE username = ?'

  try {
    const result: any = await new Promise((resolve, reject) => {
      con.query(sql, [username], (error, result) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })

    if (result.length > 0) {
      return result[0]
    } else {
      return []
    }
  } catch (error) {
    console.error('Error getting user data:', error)
    return {}
  }
}

export { checkPassword, checkUser, getUserPayload }
