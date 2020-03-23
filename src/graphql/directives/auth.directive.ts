import { SchemaDirectiveVisitor } from 'apollo-server-express';
import AuthService from '../../services/auth.service';

import {
  defaultFieldResolver,
  GraphQLObjectType,
  GraphQLField
} from '../../../node_modules/graphql';

class AuthorizedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
    const requiredRole = this.args.requiredRole;
    const originalResolve = field.resolve || defaultFieldResolver;
    field.resolve = async (...args: any[]) => {
      if (!requiredRole) {
        return originalResolve.apply(this, args);
      }
      const context = args[2];
      const { Authorization } = context.req.cookies;

      if (!Authorization) {
        throw new Error('not authorized');
      }
      const user = await AuthService.checkToken(Authorization);

      if (!user) {
        throw new Error('not authorized');
      }

      return originalResolve.apply(this, args);
    };
  }
}

export { AuthorizedDirective };
