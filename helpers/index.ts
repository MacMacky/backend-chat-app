import bcrypt from 'bcryptjs'
import path from 'path'
import jwt from 'jsonwebtoken'
import Promise from 'bluebird'
import { Request, Response, NextFunction } from 'express'
import { RequestWithUser, ErrorWithTransaction } from '../types';
import { DATE } from 'sequelize/types'

/**
 * 
 * @param {string} val 
 * 
 * @example
 * isString({}) -> false
 * isString(1) -> false
 * isString('') -> true
 * 
 * @returns {boolean}
 */
const isString = (val: string = '') => typeof val === 'string';

/**
 * 
 * @param {string} filename 
 * 
 * @returns {string}
 */
const getFileName = (filename: string = '') => {
  return filename.split(path.sep).reverse().shift().split('.').shift()
}

/**
 * 
 * @param {string} password 
 * @param {number} rounds
 * 
 * @returns {Promise<string>} hashed password
 */
const hashPassword = (password: string, rounds = 10) => {
  return new Promise((res, rej) => {
    bcrypt.genSalt(rounds, (err: Error, salt: string) => {
      if (err) return rej(err)
      bcrypt.hash(password, salt, (e: Error, hash: string) => {
        if (e) return rej(e)
        res(hash)
      })
    })
  })
}

/**
 * 
 * @param {string} password 
 * @param {string} hash 
 * 
 * @returns {Promise<boolean>}
 */
const checkPassword = (password: string, hash: string) => {
  return new Promise((res, rej) => {
    bcrypt.compare(password, hash, (err: Error, isTheSame: boolean) => {
      if (err) return rej(err)
      res(isTheSame)
    })
  })
}


const asyncWrapper = (fn: Function) => (req: Request, res: Response, nxt: NextFunction) => {
  return Promise
    .resolve(fn(req, res, nxt))
    .catch((err: ErrorWithTransaction) => {
      if (err.transaction)
        err.transaction.rollback()
      console.log(err.message, err.stack)
      return res.status(500).json({ message: 'Internal Server Error' })
    })
}


const generateAccessToken = (user: { user_id: number, user_name: string }) => {
  return jwt.sign({ ...user }, process.env.JWT_SECRET_KEY, { expiresIn: '5m' });
}

const generateRefreshToken = (user: { user_id: number, user_name: string }) => {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET);
}

const verifyRefreshToken = (token: string): Promise<{ user_id, user_name }> => {
  return new Promise((res, rej) => {
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user: { user_id, user_name }) => {
      if (err) rej(err)
      return res(user)
    })
  })
}



const generateToken = (resp: Response, user_id: number, user_name: string) => {
  const token = generateAccessToken({ user_id, user_name })
  const refreshToken = generateRefreshToken({ user_id, user_name })

  return resp.status(200).json({
    message: 'Successfully login.',
    user_name,
    user_id,
    token,
    refreshToken
  })

}

const verifyToken = (req: RequestWithUser, res: Response, next: NextFunction) => {
  //const token = req.cookies.token || '';
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: 'You need to Login' })

  const token = authHeader.split(' ')[1]
  if (!token)
    return res.status(401).json({ message: 'You need to Login' })

  try {
    const decrypt = <{ user_id: number, user_name: string }>jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = {
      user_id: decrypt.user_id,
      user_name: decrypt.user_name
    }
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Token Expired.' })
  }
};

/**
 * 
 * @param {Date} date 
 * 
 * @returns {string}
 */
const formatDate = (date: Date) => {
  let month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()
  const hour = date.getHours().toString().length === 1 ? `0${date.getHours().toString()}` : date.getHours().toString()
  const mins = date.getMinutes().toString().length === 1 ? `0${date.getMinutes().toString()}` : date.getMinutes().toString()
  const secs = date.getSeconds().toString().length === 1 ? `0${date.getSeconds().toString()}` : date.getSeconds().toString()

  return `${month.toString().length === 1 ? `0${month}` : `${month}`}/${day}/${year} ${hour}:${mins}:${secs}`
}



export {
  isString,
  formatDate,
  verifyToken,
  getFileName,
  hashPassword,
  asyncWrapper,
  checkPassword,
  generateToken,
  verifyRefreshToken,
  generateAccessToken,
}