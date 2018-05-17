const { GraphQLServer } = require('graphql-yoga')


// Populate the links feed
let links = [{
  id: 'link-0',
  url: 'www.hughdevore.com',
  description: 'GraphQL developer, Backpacker, Sasquatch'
}]

// Determine the length of the link feed
let idCount = links.length

// Declare how our GraphQL schema should resolve
const resolvers = {
  Query: {
    info: () => `This is the GraphQL API of Backpacker News.`,
    feed: () => links,
  },
  Mutation: {
    post: (root, args) => {
      // Create the new link to add to the feed
      const link = {
        id: `link-${idCount ++}`,
        description: args.description,
        url: args.url,
      }
      // Add the link to the feed
      links.push(link)
      // Return the new link
      return link
    }
  },
}

// Create our Backpacker News server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})
server.start(() => console.log(`The server is running on http::localhost:4000`))