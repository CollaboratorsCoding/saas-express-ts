import { gql } from 'apollo-server-express';
import { ApolloServerExpressConfig } from 'apollo-server-express';
import resolvers from './resolvers';
import typeDefs from './typeDefs';
import schemaDirectives from './directives';
import IContext from '../interfaces/context.interface';

const schema: ApolloServerExpressConfig = {
  typeDefs,
  resolvers,
  schemaDirectives,
  introspection: true,
  context: async ({ req, connection, payload }: any) => {
    if (connection) {
      return {};
    }
    // console.log(req.cookies.Authorization);
    const context: IContext = { req };
    return context;
  },
  playground: true
};

export default schema;
