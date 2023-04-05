import { Request, Response, NextFunction } from 'express'
import VerifyToken from './VerifyToken'

const PassportMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization || ''
  VerifyToken(token) ? next() : res.sendStatus(401)
}

export default PassportMiddleware
