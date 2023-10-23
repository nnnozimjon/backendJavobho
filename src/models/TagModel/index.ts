import { Model, DataTypes } from 'sequelize'
import sequelize from '../../config/db'

class TagModel extends Model {
  public tagId!: number
  public name!: string
  public category!: string
  public createdAt!: Date
}

TagModel.init(
  {
    tagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(255),
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
    modelName: 'jvbTag',
    tableName: 'jvb_tags',
    timestamps: false,
  }
)

export default TagModel
