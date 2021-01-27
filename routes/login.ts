import User from '../models/User'
import { Router, Request, Response } from 'express'
import { asyncWrapper, checkPassword, generateToken } from '../helpers'


const router: Router = Router()

router.post('/', asyncWrapper(async (req: Request, res: Response) => {
  res.status(400)
  const { user_name = null, password = null } = req.body

  if (!user_name || !password)
    return res.json({ message: 'Required parameters missing' })

  const user = await User.findOne({
    where: {
      user_name
    }
  })

  if (!user)
    return res.json({ message: 'User does not exists' })

  if (!(await checkPassword(password, user.password)))
    return res.json({ message: 'Incorrect Password' })


  await generateToken(res, user.user_id, user.user_name)
  //res.status(200).json({ message: 'Successfully login.' })
}))


export default router