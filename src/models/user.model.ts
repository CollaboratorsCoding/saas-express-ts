import * as mongoose from "mongoose";
import { UserAttrs, UserDoc, UserModel } from "../interfaces/user.interface";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

// Error example - password missing
// User.build({email: 'test'});

// Error example - email type not string
// User.build({email: 123, password: "wweqe"})

// const newUser = User.build({email: "test@test.test", password: "wweqe"})
// newUser.e --- type mail or newUser.pass --- type word

export { User };
