import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { registerRoutes } from './routes';
import { PostRepository } from './models';

// Setup colored logging
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    blue: "\x1b[34m"
};

const log = {
    info: (message: string) => console.log(`${colors.green}[SERVICE-B] INFO: ${message}${colors.reset}`),
    debug: (message: string) => console.log(`${colors.blue}[SERVICE-B] DEBUG: ${message}${colors.reset}`),
    error: (message: string) => console.error(`\x1b[31m[SERVICE-B] ERROR: ${message}${colors.reset}`)
};

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
    } catch (error: any) {
        log.error(`User verification failed: ${error}`);
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
        log.debug(`Internal API: Fetching posts for user ${userId}`);

        // Get posts from the database
        const posts = postRepository.getPostsByAuthor(userId);

        // Add author information to posts
        const postsWithAuthor = posts.map(post => ({
            ...post,
            author: req.body.author
        }));

        return res.json(postsWithAuthor);
    } catch (error: any) {
        log.error(`Internal API error: ${error}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

const port = 5002;
app.listen(port, '0.0.0.0', () => {
    log.info(`Service B listening at http://localhost:${port}`);
});