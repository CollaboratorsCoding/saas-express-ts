import { gql } from 'apollo-server-express';


const exampleType = gql`

directive @authorized(
  requiredRole: Role = ADMIN,
) on OBJECT | FIELD_DEFINITION

enum Role {
  ADMIN
  REVIEWER
  USER
  UNKNOWN
}
  type Example {
    title: String
    secretData: String @authorized(requiredRole: ADMIN)
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
`


export default exampleType