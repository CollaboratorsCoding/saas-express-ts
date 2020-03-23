import { AuthenticationError } from 'apollo-server-express';
import AuthService from '../services/auth.service';

const authorized = (next: any, role?: String) => async (root: any, args: any, context: any, info: any) => {

  const { Authorization } = context.req.cookies;
  if (Authorization) {
    const user = await AuthService.checkToken(Authorization);

    if (user) {
      return next(root, args, context, info)
    }

  }

  throw new AuthenticationError('Not Auth')

}

export { authorized }