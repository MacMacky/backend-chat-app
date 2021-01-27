import { Router, Request, Response } from 'express'
import { generateAccessToken, verifyRefreshToken } from '../helpers'

const router: Router = Router()

router.post('/', async (req: Request, res: Response) => {
  if (!req.body.refresh || !req.body.user)
    return res.status(401).json({ message: 'You need to Login' })
  try {
    await verifyRefreshToken(req.body.refresh)
    const access = generateAccessToken({ ...req.body.user })
    return res.json({ message: 'access', access })
  } catch (e) {
    return res.status(401).json({ message: 'You need to Login' })
  }
})


export default router