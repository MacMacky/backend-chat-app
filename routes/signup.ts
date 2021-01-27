import { Router, Request, Response } from 'express'
import { hashPassword, asyncWrapper } from '../helpers'
import sequelize from '../db'
import User from '../models/User'

const router: Router = Router()

router.post('/', asyncWrapper(async (req: Request, res: Response) => {
  let t
  try {
    res.status(400)
    const { user_name = null, password = null, first_name = null, last_name = null } = req.body

    if (!user_name || !password || !first_name || !last_name)
      return res.json({ message: 'Required parameters missing' })

    const user = await User.findOne({
      where: {
        user_name
      }
    })

    if (user)
      return res.json({ message: 'Username already exists' })

    t = await sequelize.transaction()

    await User.create({
      user_name,
      first_name,
      last_name,
      password: await hashPassword(password), // hash password for security purposes
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { transaction: t })

    await t.commit()
    res.status(201).json({ message: 'Successfully created user...' })
  } catch (e) {
    e.transaction = t
    throw e
  }
}))

export default router