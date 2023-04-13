import { Request, Response } from 'express'
import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
import { con } from '../app'

class PostController {
  static async Post(req: Request, res: Response) {
    try {
      const { text, image, type, userId } = req.body
      let newImage = ''

      if (image) {
        const extension = image.split(';')[0].split('/')[1]
        const data = image.replace(/^data:image\/\w+;base64,/, '')
        const filename = `${uuidv4()}.${extension}`

        await fs.writeFile(`src/assets/img/posts/${filename}`, data, {
          encoding: 'base64',
        })
        newImage = filename
      }

      const sqlPost =
        'INSERT INTO jvb_posts (text, image, type, userId) VALUES (?, ?, ?, ?)'
      const result: any = await new Promise((resolve, reject) => {
        con.query(
          sqlPost,
          [text || '', newImage, type, userId],
          (err, result) => {
            if (err) {
              reject(err)
            }
            resolve(result)
          }
        )
      })

      res.json({ message: result.affectedRows > 0 ? 'success' : 'failed' })
    } catch (error) {
      res.json({ message: 'failed' })
    }
  }
}

export default PostController
