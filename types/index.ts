import { Request } from 'express';
import { Transaction } from 'sequelize';

interface Data {
  user_id: number
  user_name: string
  created_at: string
  updated_at: string
  message_id: number
}


interface RequestWithUser extends Request {
  user: {
    user_id: number
    user_name: string
  }
}


interface ErrorWithTransaction extends Error {
  transaction: Transaction
}




export {
  Data,
  RequestWithUser,
  ErrorWithTransaction
}