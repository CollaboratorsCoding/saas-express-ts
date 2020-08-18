import { Request } from "express";
import { UserDoc } from "./user.interface";

export interface DataStoredInToken {
  _id: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: UserDoc;
}
