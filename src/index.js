const { GraphQLServer } = require('graphql-yoga')


// Populate the links feed
let links = [{
  id: 'link-0',
  url: 'www.hughdevore.com',
  description: 'GraphQL developer, Backpacker, Sasquatch'
}]

// Declare how our GraphQL schema should resolve
const resolvers = {
  Query: {
    info: () => `This is the GraphQL API of Backpacker News.`,
    feed: () => links,
  },
  Link: {
    id: (root) => root.id,
    description: (root) => root.description,
    url: (root) => root.url,
  }
}

// Create our Backpacker News server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})
server.start(() => console.log(`The server is running on http::localhost:4000`))