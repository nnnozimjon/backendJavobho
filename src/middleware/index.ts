import { Request, Response, NextFunction } from 'express'
import verifyToken from './VerifyToken'

const PassportMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace(/"/g, '') || ''
  if (!(await verifyToken(token))) {
    return res.sendStatus(401)
  }
  next()
}

export default PassportMiddleware
