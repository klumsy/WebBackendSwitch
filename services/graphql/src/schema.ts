import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    serviceA: ServiceAQueries
    serviceB: ServiceBQueries
  }

  type Mutation {
    serviceA: ServiceAMutations
    serviceB: ServiceBMutations
  }

  type ServiceAQueries {
    getUsers: [User!]!
    getUser(id: ID!): User
  }

  type ServiceAMutations {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
  }

  type ServiceBQueries {
    getPosts: [Post!]!
    getPost(id: ID!): Post
  }

  type ServiceBMutations {
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

  input CreateUserInput {
    username: String!
    email: String!
  }

  input UpdateUserInput {
    username: String
    email: String
  }

  input CreatePostInput {
    title: String!
    content: String!
    authorId: ID!
  }

  input UpdatePostInput {
    title: String
    content: String
  }
`;
