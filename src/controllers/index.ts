import { Request, Response, NextFunction } from 'express'

class RouteController {
  static home(req: Request, res: Response) {
    res.send({
      latesUpdate: '06-08-2023 12:06 PM'
    })
  }
}

export default RouteController
