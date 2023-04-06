import { Request, Response } from 'express'
import fs from 'fs'

class GetImageController {
  static async profile(req: Request, res: Response) {
    const image = req.params.image

    fs.readFile(`src/assets/img/profile/${image}`, (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err}`)
        return res.status(500).send('Error reading file')
      }
      const contentType = GetImageController.getContentType(image)
      res.setHeader('Content-Type', contentType)
      res.send(data)
    })
  }

  static async header(req: Request, res: Response) {
    const image = req.params.image

    fs.readFile(`src/assets/img/header/${image}`, (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err}`)
        return res.status(500).send('Error reading file')
      }
      const contentType = GetImageController.getContentType(image)
      res.setHeader('Content-Type', contentType)
      res.send(data)
    })
  }

  private static getContentType(image: string): string {
    const extension = image.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'png':
        return 'image/png'
      case 'gif':
        return 'image/gif'
      default:
        return 'application/octet-stream'
    }
  }
}

export default GetImageController
