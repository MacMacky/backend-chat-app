import User from './User'
import Message from './Message'
import Bluebird from 'bluebird'

const models = [User, Message]

module.exports = () => {
  return Bluebird.mapSeries(models, async (model) => {
    model.sync()
  }).then(() => {
    User.hasMany(Message, { foreignKey: 'user_id' })
    Message.belongsTo(User, { foreignKey: 'user_id' })
    console.log(`Done creating models...`)
  }).catch(Promise.reject)
}