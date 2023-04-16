import { Request, Response } from 'express'
import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
import { con } from '../app'
import isUserRequester from './check/isUserRequester'

class PostController {
  static async Post(req: Request, res: Response) {
    const token = req.headers?.authorization
    try {
      const { text, image, type, userId } = req.body
      let newImage = ''

      if (await isUserRequester(token, userId)) {
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
      } else {
        res.sendStatus(400)
      }
    } catch (error) {
      res.json({ message: 'failed' })
    }
  }

  // comment in post
  static async commentPost(req: Request, res: Response) {
    try {
      const token = req.headers?.authorization
      const { userId, text, postId } = req.body
      const commentSql =
        'INSERT INTO jvb_comments (userId, text, postId) VALUES (?,?,?)'

      if (text) {
        if (await isUserRequester(token, userId)) {
          const result: any = await new Promise((resolve, reject) => {
            con.query(commentSql, [userId, text, postId], (err, result) => {
              if (err) {
                reject(err)
              }
              resolve(result)
            })
          })

          res.json({ message: result.affectedRows > 0 ? 'success' : 'failed' })
        } else {
          res.sendStatus(400)
        }
      } else {
        res.sendStatus(400)
      }
    } catch (error) {
      res.json({ message: 'failed' })
    }
  }

  //
  static async likePost(req: Request, res: Response) {
    try {
      const token = req.headers?.authorization
      const { userId, postId } = req.body
      const commentSql = 'INSERT INTO jvb_likes( userId, objectId) VALUE (?,?);'

      if (await isUserRequester(token, userId)) {
        const result: any = await new Promise((resolve, reject) => {
          con.query(commentSql, [userId, postId], (err, result) => {
            if (err) {
              reject(err)
            }
            resolve(result)
          })
        })

        res.json({ message: result.affectedRows > 0 ? 'success' : 'failed' })
      } else {
        res.sendStatus(400)
      }
    } catch (error) {
      res.json({ message: 'failed' })
    }
  }

  static async unlikePost(req: Request, res: Response) {}
  static async repostPost(req: Request, res: Response) {}
}

export default PostController
