import express from 'express';
import cors from 'cors';
import { registerRoutes } from './routes';

const app = express();

app.use(cors());
app.use(express.json());

registerRoutes(app);

const port = 5002;
app.listen(port, '0.0.0.0', () => {
  console.log(`Service B listening at http://localhost:${port}`);
});
