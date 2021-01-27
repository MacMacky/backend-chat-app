import User from '../models/User'
import Message from '../models/Message'
import { Router, Request, Response } from 'express'
import { asyncWrapper, verifyToken, formatDate } from '../helpers'


const router: Router = Router()

router.get('/', verifyToken, asyncWrapper(async (req: Request, res: Response) => {
  const messages = await Message.findAll({
    order: [
      ['created_at', 'ASC']
    ],
    raw: true,
    nest: true,
    include: [
      {
        model: User,
        required: true,
        attributes: [
          'user_name',
          'user_id'
        ]
      }
    ]
  })
  const _messages = messages.map(message => {
    message.created_at = formatDate(new Date(message.created_at))
    return message
  })
  return res.json({ messages: _messages })
}))



export default router