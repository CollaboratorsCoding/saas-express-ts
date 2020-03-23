import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import App from '../app';
import AuthRoute from '../routes/auth.route';
import { CreateUserDto } from '../dtos/user.dto';
import HttpException from '../exceptions/HttpException';
import { TokenData } from '../interfaces/auth.interface';
import AuthService from '../services/auth.service';

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing AuthController', () => {
  describe('POST /signup', () => {
    it('response should have the Create userData', () => {
      const userData: CreateUserDto = {
        email: 'james.cook@test.test',
        password: 'q1w2e3r4'
      };

      const authRoute = new AuthRoute();

      authRoute.authController.authService.users.findOne = jest
        .fn()
        .mockReturnValue(Promise.resolve(undefined));

      authRoute.authController.authService.users.create = jest
        .fn()
        .mockReturnValue({ _id: 0, ...userData });

      (mongoose as any).connect = jest.fn();
      const app = new App([authRoute]);

      return request(app.server)
        .post(`${authRoute.path}/signup`)
        .send(userData);
    });
  });

  describe('POST /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData: CreateUserDto = {
        email: 'james.cook@test.test',
        password: 'q1w2e3r4',
      };
      process.env.JWT_SECRET = 'jwt_secret';

      const authRoute = new AuthRoute();

      authRoute.authController.authService.users.findOne = jest
        .fn()
        .mockReturnValue(Promise.resolve({
          _id: 0,
          email: 'james.cook@test.test',
          password: await bcrypt.hash(userData.password, 10)
        }));

      (mongoose as any).connect = jest.fn();
      const app = new App([authRoute]);
      return request(app.server)
        .post(`${authRoute.path}/login`)
        .send(userData)
        .expect('Set-Cookie', /^Authorization=.+/);
    });
  });

  describe('POST /logout', () => {
    it('logout Should Throw 401 Error', () => {
      const authRoute = new AuthRoute();

      authRoute.authController.authService.users.findOne = jest
        .fn()
        .mockReturnValue(Promise.resolve({
          _id: 0,
          email: 'james.cook@test.test',
        }));


      (mongoose as any).connect = jest.fn();
      const app = new App([authRoute]);
      return request(app.server)
        .post(`${authRoute.path}/logout`)
        .expect(401)
    });
  });
});


describe('Testing AuthService', () => {
  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const tokenData: TokenData = {
        token: '',
        expiresIn: 1
      };

      const authService = new AuthService();

      expect(typeof authService.createCookie(tokenData))
        .toEqual('string');
    });
  });

  describe('when registering a user', () => {
    describe('if the email is already token', () => {
      it('should throw an error', async () => {
        const userData: CreateUserDto = {
          email: 'james.cook@test.test',
          password: 'q1w2e3r4'
        };

        const authService = new AuthService();

        authService.users.findOne = jest
          .fn()
          .mockReturnValue(Promise.resolve(userData));

        await expect(authService.signup(userData))
          .rejects.toMatchObject(new HttpException(409, `Your email ${userData.email} already exists`));
      });
    });

    describe('if the email is not token', () => {
      it('should not throw an error', async () => {
        const userData: CreateUserDto = {
          email: 'james.cook@test.test',
          password: 'q1w2e3r4'
        };
        process.env.JWT_SECRET = 'jwt_secret';

        const authService = new AuthService();

        authService.users.findOne = jest
          .fn()
          .mockReturnValue(Promise.resolve(undefined));

        authService.users.create = jest
          .fn()
          .mockReturnValue({ _id: 0, ...userData });

        await expect(authService.signup(userData))
          .resolves.toBeDefined();
      });
    });
  });
});
