import { PostRepository, type Post } from '../../src/models';
import { join } from 'path';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('PostRepository', () => {
  let repository: PostRepository;

  beforeEach(() => {
    repository = new PostRepository();
  });

  describe('createPost', () => {
    it('should create a new post', () => {
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
    it('should retrieve all posts', () => {
      repository.createPost('Post 1', 'Content 1', 1);
      repository.createPost('Post 2', 'Content 2', 1);

      const posts = repository.getPosts();
      expect(posts.length).toBe(2);
      expect(posts[0].title).toBe('Post 1');
      expect(posts[1].title).toBe('Post 2');
    });
  });

  describe('getPostsByAuthor', () => {
    it('should retrieve posts for specific author', () => {
      repository.createPost('Author 1 Post', 'Content', 1);
      repository.createPost('Author 2 Post', 'Content', 2);

      const authorPosts = repository.getPostsByAuthor(1);
      expect(authorPosts.length).toBe(1);
      expect(authorPosts[0].title).toBe('Author 1 Post');
      expect(authorPosts[0].authorId).toBe(1);
    });
  });
});
