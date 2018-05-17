const { GraphQLServer } = require('graphql-yoga')

// Declare our GraphQL Schema
const typeDefs = `
  type Query {
    info: String!
  }
`

// Declare how our GraphQL schema should resolve
const resolvers = {
  Query: {
    info: () => `This is the GraphQL API of Backpacker News.`
  }
}

// Create our Backpacker News server
const server = new GraphQLServer({
  typeDefs,
  resolvers,
})
server.start(() => console.log(`The server is running on http::localhost:4000`))