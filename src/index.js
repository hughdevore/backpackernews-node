const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

// Declare how our GraphQL schema should resolve
const resolvers = {
  Query: {
    info: () => `This is the GraphQL API of Backpacker News.`,
    feed: (root, args, context, info) => {
      return context.db.query.links({}, info)
    },
  },
  Mutation: {
    postLink: (root, args, context, info) => {
      // Create the new link to add to the feed
      return context.db.mutation.createLink({
        data: {
          url: args.url,
          description: args.description,
        },
      }, info)
    },
    updateLink: (root, args, context, info) => {
      return context.db.mutation.updateLink({
        data: {
          url: args.url,
          description: args.description,
        },
      }, info)
    },
    // deleteLink: (root, args, context, info) => {
    //   return context.db.mutation.deleteLink({
    //     data: {
    //       id: args.id,
    //     },
    //   }, info)
    // },
  },
}

// Create our Backpacker News server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'http://localhost:4466',
      secret: 'backpackerhughs',
      debug: true,
    }),
  }),
})
server.start(() => console.log(`The server is running on http::localhost:4000`))