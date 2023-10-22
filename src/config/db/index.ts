import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import path from 'path'

const { parsed } = dotenv.config({
  path: path.resolve(__dirname, '../../../', '.env'),
})

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: parsed!.HOST,
  database: parsed!.DATABASE,
  username: parsed!.USER,
  password: parsed!.PASSWORD,
})

export default sequelize
