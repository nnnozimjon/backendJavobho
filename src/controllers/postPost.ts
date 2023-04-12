import { Request, Response } from 'express'
import fs from 'fs'
import { con } from '../app'

class PostController {
  static async Post(req: Request, res: Response) {
    try {
      const { text, image, type, userId } = req.body
      const imageData = image.split(',')[1]
      const extension = image.split(';')[0].split('/')[1]

      const data = image.replace(/^data:image\/\w+;base64,/, '')
      const name = 'uuid'

      // Write file
      fs.writeFile(
        `assets/name.${extension}`,
        data,
        { encoding: 'base64' },
        function (err) {
          if (err) {
            console.log('Error saving image:', err)
          } else {
            console.log('Image saved successfully.')
          }
        }
      )

      const sqlPost =
        'INSERT INTO jvb_posts (text, image, type,  userId) VALUES(?,?,?,?)'

      console.log(text, extension, type, userId)

      //   const result: any = await new Promise((resolve, reject) => {
      //     con.query(
      //       sqlPost,
      //       [text || '', newImage, type, userId],
      //       (err, result) => {
      //         if (err) {
      //           reject(err)
      //         }
      //         resolve(result)
      //       }
      //     )
      //   })
      //   if (result.affectedRows > 0) {
      //     res.json({
      //       message: 'success',
      //     })
      //   } else {
      //     res.json({
      //       message: 'failed',
      //     })
      //   }
    } catch (error) {
      res.json({ message: 'failed' })
    }
  }
}

export default PostController
