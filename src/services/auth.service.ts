import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { CreateUserDto } from "../dtos/user.dto";
import HttpException from "../exceptions/HttpException";
import { DataStoredInToken, TokenData } from "../interfaces/auth.interface";
import { UserDoc } from "../interfaces/user.interface";
import { User } from "../models/user.model";
import { isEmptyObject } from "../utils/util";

class AuthService {
  public users = User;

  public async signup(userData: CreateUserDto): Promise<UserDoc> {
    if (isEmptyObject(userData))
      throw new HttpException(400, "You're not userData");

    const findUser = await this.users.findOne({ email: userData.email });
    if (findUser)
      throw new HttpException(
        409,
        `Your email ${userData.email} already exists`
      );

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData = await this.users
      .build({
        ...userData,
        password: hashedPassword,
      })
      .save();

    return createUserData;
  }

  public async login(
    userData: CreateUserDto
  ): Promise<{ cookie: string; findUser: UserDoc }> {
    if (isEmptyObject(userData))
      throw new HttpException(400, "You're not userData");

    const findUser = await this.users.findOne({ email: userData.email });
    if (!findUser)
      throw new HttpException(409, `Your email ${userData.email} not found`);

    const isPasswordMatching: boolean = await bcrypt.compare(
      userData.password,
      findUser.password
    );
    if (!isPasswordMatching)
      throw new HttpException(409, "Your password not matching");

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: UserDoc): Promise<UserDoc> {
    if (isEmptyObject(userData))
      throw new HttpException(400, "You're not userData");

    const findUser = await this.users.findOne({
      password: userData.password,
    });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public createToken(user: UserDoc): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secret: string = process.env.JWT_SECRET;
    const expiresIn: number = 60 * 60;

    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/; Domain=localhost`;
  }

  public static async checkToken(token: string): Promise<UserDoc> {
    const secret = process.env.JWT_SECRET;
    const verificationResponse = jwt.verify(token, secret) as DataStoredInToken;
    const userId = verificationResponse._id;
    const findUser = await User.findById(userId);
    return findUser;
  }
}

export default AuthService;
