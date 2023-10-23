import { Model, DataTypes } from 'sequelize'
import sequelize from '../../config/db'

class BookmarkModel extends Model {
  public bookId!: number
  public postId!: number
  public userId!: number
  public createdAt!: Date
}

BookmarkModel.init(
  {
    bookId: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
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
    modelName: 'jvbBookmarks',
    tableName: 'jvb_bookmarks',
    timestamps: false,
  }
)

export default BookmarkModel
