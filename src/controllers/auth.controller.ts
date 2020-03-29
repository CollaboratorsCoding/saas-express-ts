import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '../dtos/user.dto';
import AuthService from '../services/auth.service';
import { IUser } from '../interfaces/user.interface';
import { RequestWithUser } from '../interfaces/auth.interface';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;

    try {
      const signUpUserData: IUser = await this.authService.signup(userData);
      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  }

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;

    try {
      const { cookie, findUser } = await this.authService.login(userData);
      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, message: 'login' });
    } catch (error) {
      next(error);
    }
  }
  public me = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userData: IUser = req.user;
      res.status(200).json({ data: userData });
   
  }
  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userData: IUser = req.user;

    try {
      const logOutUserData: IUser = await this.authService.logout(userData);
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0; Path=/']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
