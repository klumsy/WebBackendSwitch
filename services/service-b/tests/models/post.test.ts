import { PostRepository, type Post } from '../../src/models';
import { join } from 'path';
import { describe, it, expect, beforeEach } from '@jest/globals';

const TEST_DB_PATH = join(process.cwd(), 'services', 'service-b', 'test.sqlite');

describe('PostRepository', () => {
  let repository: PostRepository;

  beforeEach(() => {
    repository = new PostRepository(TEST_DB_PATH);
    repository.clearPosts(); // Clear database before each test
  });

  describe('createPost', () => {
    it('should create a new post with valid data', () => {
      const post = repository.createPost('Test Title', 'Test Content', 1);

      expect(post).toBeDefined();
      expect(post.title).toBe('Test Title');
      expect(post.content).toBe('Test Content');
      expect(post.authorId).toBe(1);
      expect(post.id).toBeDefined();
    });
  });

  describe('getPost', () => {
    it('should retrieve a post by id', () => {
      const created = repository.createPost('Test Title', 'Test Content', 1);
      const retrieved = repository.getPost(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.title).toBe('Test Title');
      expect(retrieved?.content).toBe('Test Content');
      expect(retrieved?.authorId).toBe(1);
    });

    it('should return undefined for non-existent post', () => {
      const post = repository.getPost(999);
      expect(post).toBeUndefined();
    });
  });

  describe('getPosts', () => {
    it('should return empty array when no posts exist', () => {
      const posts = repository.getPosts();
      expect(posts).toEqual([]);
    });

    it('should retrieve all posts', () => {
      repository.createPost('Post 1', 'Content 1', 1);
      repository.createPost('Post 2', 'Content 2', 2);

      const posts = repository.getPosts();
      expect(posts).toHaveLength(2);
      expect(posts[0].title).toBe('Post 1');
      expect(posts[1].title).toBe('Post 2');
    });
  });

  describe('getPostsByAuthor', () => {
    it('should return empty array when author has no posts', () => {
      const authorPosts = repository.getPostsByAuthor(999);
      expect(authorPosts).toEqual([]);
    });

    it('should retrieve posts for specific author', () => {
      repository.createPost('Author 1 Post', 'Content', 1);
      repository.createPost('Author 2 Post', 'Content', 2);
      repository.createPost('Author 1 Second Post', 'Content', 1);

      const authorPosts = repository.getPostsByAuthor(1);
      expect(authorPosts).toHaveLength(2);
      expect(authorPosts[0].title).toBe('Author 1 Post');
      expect(authorPosts[1].title).toBe('Author 1 Second Post');
      expect(authorPosts.every(post => post.authorId === 1)).toBe(true);
    });
  });
});