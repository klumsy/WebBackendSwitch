import { GraphQLResolveInfo } from 'graphql';

// Base model types
export interface User {
  id: string;
  username: string;
  email: string;
  posts: Post[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  authorId: string;
}

// Input types
export interface CreateUserInput {
  username: string;
  email: string;
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  authorId: string;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
}

// Query types
export interface ServiceAQueries {
  getUsers: User[];
  getUser: (id: string) => User | null;
}

export interface ServiceBQueries {
  getPosts: Post[];
  getPost: (id: string) => Post | null;
}

export interface QueryResolvers {
  serviceA: () => ServiceAQueries;
  serviceB: () => ServiceBQueries;
}

// Mutation types
export interface ServiceAMutations {
  createUser: (input: CreateUserInput) => Promise<User>;
  updateUser: (id: string, input: UpdateUserInput) => Promise<User>;
}

export interface ServiceBMutations {
  createPost: (input: CreatePostInput) => Promise<Post>;
  updatePost: (id: string, input: UpdatePostInput) => Promise<Post>;
}

export interface MutationResolvers {
  serviceA: () => ServiceAMutations;
  serviceB: () => ServiceBMutations;
}

// Context type for Apollo Server
export interface Context {
  serviceAClient: any;
  serviceBClient: any;
}

// Resolver type with proper typing for parent, args, context
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

// Root types
export interface Resolvers {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
  User: {
    id: Resolver<string, User>;
    username: Resolver<string, User>;
    email: Resolver<string, User>;
    posts: Resolver<Post[], User>;
  };
  Post: {
    id: Resolver<string, Post>;
    title: Resolver<string, Post>;
    content: Resolver<string, Post>;
    author: Resolver<User, Post>;
  };
}

// Helper type for resolver arguments
export interface ResolverArgs {
  id?: string;
  input?: CreateUserInput | UpdateUserInput | CreatePostInput | UpdatePostInput;
}

// Type guards
export function isCreateUserInput(input: any): input is CreateUserInput {
  return input && typeof input.username === 'string' && typeof input.email === 'string';
}

export function isUpdateUserInput(input: any): input is UpdateUserInput {
  return input && (
    typeof input.username === 'string' || 
    typeof input.email === 'string'
  );
}

export function isCreatePostInput(input: any): input is CreatePostInput {
  return input && 
    typeof input.title === 'string' && 
    typeof input.content === 'string' && 
    typeof input.authorId === 'string';
}

export function isUpdatePostInput(input: any): input is UpdatePostInput {
  return input && (
    typeof input.title === 'string' || 
    typeof input.content === 'string'
  );
}
