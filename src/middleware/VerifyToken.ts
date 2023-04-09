import jwt from 'jsonwebtoken'
import { con } from '../app'
import secret from '../validators'

const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const decoded: any = jwt.verify(token as string & { exp: number }, secret)

    if (!decoded || !decoded.userId || !decoded.username) {
      return false
    }

    const currentTimestamp = Math.floor(Date.now() / 1000)
    if (decoded.exp < currentTimestamp) {
      return false
    } else {
      const userId = decoded.userId
      const username = decoded.username
      const sql = 'SELECT * FROM jvb_users WHERE userId = ? AND username = ?'

      const result: boolean = await new Promise((resolve, reject) => {
        con.query(sql, [userId, username], (err, result) => {
          if (err) {
            reject(false)
          } else {
            if (result.length > 0) {
              resolve(true)
            } else {
              resolve(false)
            }
          }
        })
      })

      return result
    }
  } catch (err) {
    return false
  }
}

export default verifyToken
