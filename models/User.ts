import sequelize from "../db"
import { DataTypes, Model } from "sequelize"


class User extends Model {
  user_id: number
  user_name: string
  password: string
}

User.init({
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  tableName: 'users',
  modelName: 'user',
  updatedAt: 'updated_at',
  createdAt: 'created_at'
})

export default User