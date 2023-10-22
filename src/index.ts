import server from './app'
import dotenv from 'dotenv'
import path from 'path'

const { parsed } = dotenv.config({
  path: path.resolve(__dirname, '../', '.env'),
})

server.listen(parsed!.PORT, () => {
  console.log(`Listening on ${parsed!.PORT} ${''}`)
})
