import { gql } from 'apollo-server-express';
import { ApolloServerExpressConfig } from 'apollo-server-express';
import resolvers from './resolvers';
import typeDefs from './typeDefs';
import schemaDirectives from './directives';

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
    return { req };
  },
  playground: true
};

export default schema;
