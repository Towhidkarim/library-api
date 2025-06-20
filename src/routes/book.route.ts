import { Router } from 'express';
import {
  deleteBook,
  getBooks,
  postBooks,
  updateBook,
} from '../controllers/book.controller';

const router = Router();

router.post('/', postBooks);

router.get('/:bookId', getBooks);
router.get('/', getBooks);

router.put('/:bookId', updateBook);

router.delete('/:bookId', deleteBook);

export default router;
