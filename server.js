import express from 'express';
import cors from 'cors';
import path from 'path';
import authRouter from './src/components/user/auth/auth.backend.js';
import menuRouter from './src/backend/menu.backend.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.resolve(process.cwd(), 'public')));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/menu-items', menuRouter);

app.listen(PORT, () => {
  console.log(`Auth server listening on http://localhost:${PORT}`);
});

