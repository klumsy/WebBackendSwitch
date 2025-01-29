import { PostRepository, Post } from '../src/models';

describe('PostRepository', () => {
  let repository: PostRepository;

  beforeEach(() => {
    repository = new PostRepository();
  });

  test('creates a post', () => {
    const post = repository.createPost('Test Post', 'Test Content', 1);
    expect(post.id).toBe(1);
    expect(post.title).toBe('Test Post');
    expect(post.content).toBe('Test Content');
    expect(post.authorId).toBe(1);
  });

  test('gets a post by id', () => {
    const created = repository.createPost('Test Post', 'Test Content', 1);
    const retrieved = repository.getPost(created.id);
    expect(retrieved).toEqual(created);
  });

  test('gets posts by author', () => {
    repository.createPost('Post 1', 'Content 1', 1);
    repository.createPost('Post 2', 'Content 2', 1);
    repository.createPost('Post 3', 'Content 3', 2);

    const authorPosts = repository.getPostsByAuthor(1);
    expect(authorPosts).toHaveLength(2);
    expect(authorPosts.every(post => post.authorId === 1)).toBe(true);
  });
});
