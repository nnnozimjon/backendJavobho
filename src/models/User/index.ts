import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../../config'

class UserModel extends Model {
  public userId!: number
  public username!: string
  public fullname!: string
  public description!: string
  public verified!: boolean
  public avatar!: string
  public splashImage!: string
  public email!: string
  public emailVerified!: boolean
  public password!: string
  public createdAt!: Date
}

UserModel.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'default.png',
    },
    splashImage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'default.png',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'jvbUsers',
    tableName: 'jvb_users',
    timestamps: false,
  }
)

export default UserModel
