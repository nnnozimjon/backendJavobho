import { Model, DataTypes } from 'sequelize'
import sequelize from '../../config/db'

class FollowModel extends Model {
  public followId!: number
  public followerId!: number
  public followingId!: number
  public timestamp!: Date
}

FollowModel.init(
  {
    followId: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'jvbFollow',
    tableName: 'jvb_follow',
    timestamps: false,
  }
)

export default FollowModel
