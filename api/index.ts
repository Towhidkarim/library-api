import express from 'express';
import errorHandler from '../middleware/errorHandler';
import bookRouter from '../src/routes/book.route';
import borrowRouter from '../src/routes/borrow.route';
import { connectDB } from '../src/db/db';

const app = express();

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err);
    res.status(500).json({ message: 'Database connection error' });
  }
});

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'A Library Management API',
  });
});
app.use('/api/books', bookRouter);
app.use('/api/borrow', borrowRouter);

app.use(errorHandler);

export default app;
