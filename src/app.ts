import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import errorHandler from './middleware/errorHandler';
import bookRouter from './routes/book.route';
import borrowRouter from './routes/borrow.route';
import { config } from 'dotenv';
import { connectDB } from './db/db';
import ServerlessHttp from 'serverless-http';

config();

const app = express();
app.use(express.json());
// app.use(async (req, res, next) => {
//   try {
//     await connectDB();
//     next();
//   } catch (err) {
//     console.error('DB connection failed:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'A Library Management API',
  });
});
app.use('/api/books', bookRouter);
app.use('/api/borrow', borrowRouter);

app.use((req: Request, res: Response) => {
  res.status(404).send('Error 404 not found');
});
app.use(errorHandler);

export default app;
