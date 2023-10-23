import { Model, DataTypes } from 'sequelize'
import sequelize from '../../config/db'

class PostModel extends Model {
  public postId!: number
  public text!: string
  public image!: string
  public type!: string
  public status!: string
  public userId!: number
  public reposterId?: number
  public reposterText?: string
  public createdAt!: Date
  public updatedAt!: Date
}

PostModel.init(
  {
    postId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'publish',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reposterId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reposterText: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'jvbPosts',
    tableName: 'jvb_posts',
    timestamps: false,
  }
)

export default PostModel
