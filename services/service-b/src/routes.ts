import { Express } from 'express';
import { PostRepository } from './models';

export function registerRoutes(app: Express, postRepository: PostRepository) {
  app.get('/api/posts', (req, res) => {
    try {
      const posts = postRepository.getPosts();
      res.json(posts);
    } catch (error) {
      console.error('[ERROR] Failed to get posts:', error);
      res.status(500).json({ error: 'Failed to get posts' });
    }
  });

  app.get('/api/posts/:id', (req, res) => {
    try {
      const post = postRepository.getPost(parseInt(req.params.id));
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      res.json(post);
    } catch (error) {
      console.error('[ERROR] Failed to get post:', error);
      res.status(500).json({ error: 'Failed to get post' });
    }
  });

  app.post('/api/posts', (req, res) => {
    try {
      const { title, content, authorId } = req.body;
      if (!title || !content || !authorId) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
      const post = postRepository.createPost(title, content, parseInt(authorId));
      res.status(201).json(post);
    } catch (error) {
      console.error('[ERROR] Failed to create post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  });

  app.get('/api/users/:userId/posts', (req, res) => {
    try {
      const posts = postRepository.getPostsByAuthor(parseInt(req.params.userId));
      res.json(posts);
    } catch (error) {
      console.error('[ERROR] Failed to get user posts:', error);
      res.status(500).json({ error: 'Failed to get user posts' });
    }
  });
}