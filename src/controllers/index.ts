import { Request, Response, NextFunction } from 'express'

class RouteController {
  static home(req: Request, res: Response) {
    res.send(req.headers['user-agent'])
  }
  static Welcome(req: Request, res: Response) {
    res.send('You are crystal')
  }
}

export default RouteController
