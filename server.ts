// Require configuration
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.join(__dirname, '.env')
})


import { getFileName, formatDate } from './helpers'
import app from './app'
const log = (...args: any[]) => console.log(`[${getFileName(__filename)}]`, ...args)
// Require and dotenv and initialize globals

import http from 'http'
import socketio from 'socket.io'
import Message from './models/Message'
import sequelize from './db'
import { Data } from './types'

const server = http.createServer(app)
const io = socketio(server)


io.on('connection', socket => {

  io.emit('connected')

  socket.on('keyup', user_name => {
    // log(`${user_name} is typing`)
    socket.broadcast.emit('keyup', `${user_name} is typing...`)
  })




  socket.on('message', async (data: Data) => {
    let t
    try {
      t = await sequelize.transaction()
      data.created_at = new Date().toISOString()
      data.updated_at = new Date().toISOString()
      const message_id = await Message.create(data).then((r) => r.message_id)
      t.commit()
      data.message_id = message_id
      io.emit('new_message', { ...data, created_at: formatDate(new Date(data.created_at)), user: data })
    } catch (e) {
      if (t) t.rollback()
      socket.emit('message_error', { message: e.message });
    }
  })

  socket.on('remove_message', async (message_id: number) => {
    let t
    try {
      t = await sequelize.transaction()
      const message = await Message.findByPk(message_id)
      await message.destroy()
      t.commit()
      io.emit('removed_message', message_id)
    } catch (e) {
      if (t) t.rollback()
      socket.emit('message_error', { message: e.message });
    }
  })

})


// Start the server...
server.listen(process.env.PORT, async () => {
  try {
    // Create Tables
    await require('./models')()
    log(`Server listening at port: ${process.env.PORT}`)
  } catch (e) {
    log(`Error - ${e.message} ${e.stack}`)
    process.exit(1)
  }
})