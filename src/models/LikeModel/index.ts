import { Model, DataTypes } from 'sequelize'
import sequelize from '../../config/db'

class LikeModel extends Model {
  public likeId!: number
  public userId!: number
  public postId!: number
  public createdAt!: Date
}

LikeModel.init(
  {
    likeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
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
    modelName: 'jvbLikes',
    tableName: 'jvb_likes',
    timestamps: false,
  }
)

export default LikeModel
