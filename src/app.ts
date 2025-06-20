import express from 'express';
import errorHandler from './middleware/errorHandler';
import bookRouter from './routes/book.route';
import borrowRouter from './routes/borrow.route';
import { config } from 'dotenv';

config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'A Library Management API',
  });
});
app.use('/api/books', bookRouter);
app.use('/api/borrow', borrowRouter);

app.use((req, res) => {
  res.status(404).send('Error 404 not found');
});
app.use(errorHandler);

export default app;
