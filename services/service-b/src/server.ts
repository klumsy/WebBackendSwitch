import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { registerRoutes } from './routes';
import { PostRepository } from './models';

const app = express();
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'dev_internal_key_123';
const SERVICE_A_URL = 'http://localhost:5001';

// Initialize repositories
const postRepository = new PostRepository();

// Middleware for internal API authentication
const requireInternalAuth = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const authKey = req.headers['x-internal-api-key'];
    if (!authKey || authKey !== INTERNAL_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// Middleware to verify user exists
const verifyUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const authorId = req.body.authorId || req.params.userId;
    if (!authorId) {
        return next();
    }

    try {
        const response = await axios.get(
            `${SERVICE_A_URL}/internal/api/users/verify/${authorId}`,
            {
                headers: {
                    'X-Internal-API-Key': INTERNAL_API_KEY
                }
            }
        );

        if (response.status === 200) {
            req.body.author = response.data;
            next();
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('[ERROR] User verification failed:', error);
        res.status(500).json({ error: 'Failed to verify user' });
    }
};

app.use(cors());
app.use(express.json());

// Add user verification middleware to post creation
app.use('/api/posts', (req, res, next) => {
    if (req.method === 'POST') {
        verifyUser(req, res, next);
    } else {
        next();
    }
});

// Initialize routes with repository
registerRoutes(app, postRepository);

// Internal API endpoints
app.get('/internal/api/posts/user/:userId', requireInternalAuth, verifyUser, async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        console.log(`[DEBUG] Internal API: Fetching posts for user ${userId}`);

        // Get posts from the database
        const posts = postRepository.getPostsByAuthor(userId);

        // Add author information to posts
        const postsWithAuthor = posts.map(post => ({
            ...post,
            author: req.body.author
        }));

        return res.json(postsWithAuthor);
    } catch (error) {
        console.error('[ERROR] Internal API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

const port = 5002;
app.listen(port, '0.0.0.0', () => {
    console.log(`Service B listening at http://localhost:${port}`);
});