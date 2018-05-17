const { GraphQLServer } = require('graphql-yoga')
const _ = require('underscore')


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
    postLink: (root, args) => {
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
    },
    updateLink: (root, args) => {
      // Find the link by ID
      const link = links.findIndex(link => link.id == args.id)
      // Use the args to set the new link data
      links[link].url = args.url ? args.url : link.url
      links[link].description = args.description ? args.description : link.description
      return links[link]
    },
    deleteLink: (root, args) => {
      links = _.reject(links, (link) => {
        return link.id == args.id
      })
      return `The link with ID: ${args.id} has been deleted.`
    },
  },
}

// Create our Backpacker News server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})
server.start(() => console.log(`The server is running on http::localhost:4000`))