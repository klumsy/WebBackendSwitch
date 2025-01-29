import { Express } from 'express';
import { PostRepository } from './models';

const postRepository = new PostRepository();

export function registerRoutes(app: Express) {
  app.get('/api/posts', (req, res) => {
    const posts = postRepository.getPosts();
    res.json(posts);
  });

  app.get('/api/posts/:id', (req, res) => {
    const post = postRepository.getPost(parseInt(req.params.id));
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json(post);
  });

  app.post('/api/posts', (req, res) => {
    const { title, content, authorId } = req.body;
    const post = postRepository.createPost(title, content, authorId);
    res.status(201).json(post);
  });

  app.get('/api/users/:userId/posts', (req, res) => {
    const posts = postRepository.getPostsByAuthor(parseInt(req.params.userId));
    res.json(posts);
  });
}
