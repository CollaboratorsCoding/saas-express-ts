import { AuthenticationError } from 'apollo-server-express';
import * as jwt from 'jsonwebtoken';
import { DataStoredInToken } from '../interfaces/auth.interface';
import userModel from '../models/user.model';

const authorized = (next: any, role?: String) => async (root: any, args: any, context: any, info: any) => {
  const cookies = context.req.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
    const userId = verificationResponse._id;
    const findUser = await userModel.findById(userId);
    if (findUser) {
      return next(root, args, context, info)
    }
  }
  throw new AuthenticationError('Not Auth')

}

export { authorized }