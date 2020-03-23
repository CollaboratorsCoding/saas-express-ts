import exampleType from './example.typeDef';


const rootSchema = `
    type Query {
      root: String
    }

    type Mutation {
      root: String
    }

    type Subscription {
      root: String
    }
    schema {
      query: Query
      mutation: Mutation
      subscription: Subscription
}`

export default [rootSchema, exampleType]