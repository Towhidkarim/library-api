import { Router } from 'express';
import { borrowBook, getBorowSumary } from '../controllers/boorrow.controller';

const router = Router();

router.get('/', getBorowSumary);

router.post('/', borrowBook);

export default router;
