import { Request, Response } from 'express'
import { con } from '../app'

class GetHashTagsController {
  static async tags(req: Request, res: Response) {
    try {
      const sql = `
        SELECT jvb_tags.tagId, jvb_tags.name, jvb_tags.category, COUNT(jpT.postId) AS postCount
        FROM jvb_tags
        LEFT JOIN jvb_postTags jpT ON jvb_tags.tagId = jpT.tagId
        GROUP BY jvb_tags.tagId
      `

      const result = await new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      res.json({ payload: result })
    } catch (err) {
      res.sendStatus(501)
    }
  }
}

export default GetHashTagsController
