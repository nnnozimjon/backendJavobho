import { Model, DataTypes } from 'sequelize'
import sequelize from '../../config/db'

class PostTagModel extends Model {
  public postId!: number
  public tagId!: number
  public createdAt!: Date
}

PostTagModel.init(
  {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tagId: {
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
    modelName: 'jvbPostTags',
    tableName: 'jvb_postTags',
    timestamps: false,
  }
)

export default PostTagModel
