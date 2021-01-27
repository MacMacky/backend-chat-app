import sequelize from "../db"
import { DataTypes, Model } from "sequelize"


class Message extends Model {
  message_id: number
  created_at: string
}

Message.init({
  message_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      key: 'user_id',
      model: 'users'
    }
  }
}, {
  sequelize,
  underscored: true,
  tableName: 'messages',
  modelName: 'message',
  updatedAt: 'updated_at',
  createdAt: 'created_at'
})



export default Message