import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { registerRoutes } from './routes';

const app = express();
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'dev_internal_key_123';
const SERVICE_A_URL = 'http://localhost:5001';

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

app.use(cors());
app.use(express.json());

// Initialize routes
registerRoutes(app);

// Internal API endpoints
app.get('/internal/api/posts/user/:userId', requireInternalAuth, async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        console.log(`[DEBUG] Internal API: Fetching posts for user ${userId}`);

        // First verify user exists using Service A's private API
        const userVerification = await axios.get(
            `${SERVICE_A_URL}/internal/api/users/verify/${userId}`,
            {
                headers: {
                    'X-Internal-API-Key': INTERNAL_API_KEY
                }
            }
        );

        if (userVerification.status !== 200) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Here you would fetch posts for the user from your database
        // For now, returning mock data
        const posts = [
            { id: 1, title: 'Test Post', content: 'Content', userId }
        ];

        return res.json(posts);
    } catch (error) {
        console.error('[ERROR] Internal API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

const port = 5002;
app.listen(port, '0.0.0.0', () => {
    console.log(`Service B listening at http://localhost:${port}`);
});