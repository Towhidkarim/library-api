import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(3),
  author: z.string().min(3),
  genre: z.enum([
    'FICTION',
    'NON_FICTION',
    'SCIENCE',
    'HISTORY',
    'BIOGRAPHY',
    'FANTASY',
  ]),
  isbn: z.string(),
  description: z.string().optional(),
  copies: z.number().nonnegative(),
  available: z.boolean(),
  // createdAt: z.date().optional(),
  // updatedAt: z.date().optional(),
});
