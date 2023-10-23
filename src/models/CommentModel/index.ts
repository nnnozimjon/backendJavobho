import { Model, DataTypes } from 'sequelize'
import sequelize from '../../config/db'

class CommentModel extends Model {
  public commentId!: number
  public userId!: number
  public text!: string
  public createdAt!: Date
  public postId!: number
  public status!: string
}

CommentModel.init(
  {
    commentId: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'publish',
    },
  },
  {
    sequelize,
    modelName: 'jvbComments',
    tableName: 'jvb_comments',
    timestamps: false,
  }
)

export default CommentModel
