import express from 'express';
import errorHandler from '../middleware/errorHandler';
import bookRouter from './routes/book.route';
import borrowRouter from './routes/borrow.route';

const app = express();
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
