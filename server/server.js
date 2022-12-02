const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');


const PORT = process.env.PORT || 3001;
// create new apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//create new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  //intergrate apollo server with express app as middleware
  server.applyMiddleware({ app });
}

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL api
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
  });
});

//call async function to start the server
startApolloServer(typeDefs, resolvers);
