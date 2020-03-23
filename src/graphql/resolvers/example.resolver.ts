import { PubSub } from 'apollo-server-express';
const pubsub = new PubSub();
const exampleResolver = {
  Query: {
    example: () => ({
      title: 'Example Title',
      secretData: 'Example Secret Data'
    }),
    // Add other queries here
  },
  Mutation: {
    exampleMutation: (_: any, { input }: any, ) => {
      pubsub.publish('EXAMPLE_SUB', { exampleSubscription: 'from sub' })
      return input.title
    }
    // Add other mutations here
  },
  Subscription: {
    exampleSubscription: {
      subscribe: () => pubsub.asyncIterator('EXAMPLE_SUB')
    }
    // Add other subscriptions here
  }
}

export default exampleResolver