const { GraphQLServer } = require('graphql-yoga');
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const db = require('./db');


function createServer() {
    // Create the GraphQL Yoga Server
    return new GraphQLServer({
        // Take the custom schema document
        typeDefs: 'src/schema.graphql',
        // Match everything in schema with a resolver
        resolvers: {
            Mutation,
            Query
        },
        // Set these options to allow for auth logic
        resolverValidationOptions: {
            requireResolversForResolveType: false
        },
        // Expose the db to every request
        context: req => ({ ...req, db }),
    });
}

module.exports = createServer;