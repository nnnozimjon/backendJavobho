import jwt from 'jsonwebtoken'
import secret from '../../validators'

interface DecodedToken {
  userId: number | string
  exp: number
}

async function isUserRequester(
  access_token: string | undefined,
  userId: number | string | null
): Promise<boolean> {
  try {
    const token = access_token?.slice(7).replace(/"/g, '') || ''
    const decoded: DecodedToken = jwt.verify(token, secret) as DecodedToken
    return decoded.userId.toString() === userId?.toString()
  } catch (err) {
    return false
  }
}

export default isUserRequester
