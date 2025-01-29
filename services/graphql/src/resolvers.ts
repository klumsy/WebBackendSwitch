import { IResolvers } from '@graphql-tools/utils';
import { serviceAClient, serviceBClient } from './services';

export const resolvers: IResolvers = {
  Query: {
    serviceA: () => ({}),
    serviceB: () => ({}),
  },

  ServiceAQueries: {
    getUsers: async () => {
      const response = await serviceAClient.get('/api/users');
      return response.data;
    },
    getUser: async (_, { id }) => {
      const response = await serviceAClient.get(`/api/users/${id}`);
      return response.data;
    },
  },

  ServiceBQueries: {
    getPosts: async () => {
      const response = await serviceBClient.get('/api/posts');
      return response.data;
    },
    getPost: async (_, { id }) => {
      const response = await serviceBClient.get(`/api/posts/${id}`);
      return response.data;
    },
  },

  ServiceAMutations: {
    createUser: async (_, { input }) => {
      const response = await serviceAClient.post('/api/users', input);
      return response.data;
    },
    updateUser: async (_, { id, input }) => {
      const response = await serviceAClient.put(`/api/users/${id}`, input);
      return response.data;
    },
  },

  ServiceBMutations: {
    createPost: async (_, { input }) => {
      const response = await serviceBClient.post('/api/posts', input);
      return response.data;
    },
    updatePost: async (_, { id, input }) => {
      const response = await serviceBClient.put(`/api/posts/${id}`, input);
      return response.data;
    },
  },

  User: {
    posts: async (parent) => {
      const response = await serviceBClient.get(`/api/users/${parent.id}/posts`);
      return response.data;
    },
  },

  Post: {
    author: async (parent) => {
      const response = await serviceAClient.get(`/api/users/${parent.authorId}`);
      return response.data;
    },
  },
};
