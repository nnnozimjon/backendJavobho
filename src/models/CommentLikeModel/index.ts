import { Model, DataTypes } from 'sequelize'
import sequelize from '../../config/db'

class CommentLikeModel extends Model {
  public commentLikeId!: number
  public userId!: number
  public commentId!: number
  public createdAt!: Date
}

CommentLikeModel.init(
  {
    commentLikeId: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    commentId: {
      type: DataTypes.INTEGER,
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
    modelName: 'CommentLike',
    tableName: 'jvb_commentLike',
    timestamps: false,
  }
)

export default CommentLikeModel
