import { model, Document, Schema } from 'mongoose';
import { z } from 'zod';
import { borrowSchema } from '../typeschema/borrow';

interface IBorrow extends Document, z.infer<typeof borrowSchema> {}

const borrowMongooseSchema = new Schema<IBorrow>(
  {
    book: { type: Schema.Types.ObjectId, required: true, ref: 'Book' },
    dueDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
);

borrowMongooseSchema.pre('save', function (this: IBorrow, next) {
  const validation = borrowSchema.safeParse(this.toObject());
  if (validation.success) next();
  else next(validation.error);
});

export const BorrowDBModel = model<IBorrow>('Borrow', borrowMongooseSchema);
