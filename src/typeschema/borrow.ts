import { Types } from 'mongoose';
import { z } from 'zod';

const objectIdSchema = z.custom<Types.ObjectId>(
  (val) => val instanceof Types.ObjectId,
  { message: 'Invalid ObjectId' }
);

export const borrowSchema = z.object({
  book: objectIdSchema,
  quantity: z.number().nonnegative(),
  dueDate: z.date(),
});
