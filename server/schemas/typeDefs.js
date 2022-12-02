// import the gql tagged template function
const { gql } = require('apollo-server-express');


//create our typeDef's
const typeDefs = gql`
    type Thought {
        _id: ID
        thoughtText: String
        createdAt: String
        username: String
        reactionCount: Int
        reactions: [Reaction]
    }

    type User {
        _id: ID
        username: String
        email: String
        friendCount: Int
        thoughts: [Thought]
        friends: [User]
    }

    type Reaction {
        _id: ID
        reactionBody: String
        createdAt: String
        username: String
    }

    type Query {
        users: [User]
        user(username: String!): User
        thoughts(username: String): [Thought]
        thought(_Id: ID!): Thought
    }
  `;

//export typeDef's
module.exports = typeDefs;