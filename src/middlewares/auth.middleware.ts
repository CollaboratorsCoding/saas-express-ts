import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import HttpException from "../exceptions/HttpException";
import {
  DataStoredInToken,
  RequestWithUser,
} from "../interfaces/auth.interface";
import { User } from "../models/user.model";

async function authMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const cookies = req.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await User.findById(userId);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, "Wrong auth token"));
      }
    } catch (error) {
      next(new HttpException(401, "Wrong authentication token"));
    }
  } else {
    next(new HttpException(401, "Wrong authentication token"));
  }
}

export default authMiddleware;
