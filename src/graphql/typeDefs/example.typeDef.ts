import { gql } from 'apollo-server-express';

const exampleType = gql`
  directive @authorized(requiredRole: Role = USER) on FIELD_DEFINITION

  enum Role {
    USER
    GUEST
  }
  type Example {
    title: String
    secretData: String @authorized(requiredRole: USER)
  }

  input ExampleInput {
    title: String!
  }

  extend type Query {
    example: Example!
  }

  extend type Mutation {
    exampleMutation(input: ExampleInput!): String!
  }

  extend type Subscription {
    exampleSubscription: String!
  }
`;

export default exampleType;
