import * as mongoose from 'mongoose';
import { IUser } from '../interfaces/user.interface'

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

const userModel = mongoose.model<IUser & mongoose.Document>('User', userSchema);

export default userModel;