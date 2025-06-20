import { model, Schema, Document, Model } from 'mongoose';
import { z } from 'zod';
import { bookSchema } from '../typeschema/book';

interface IBook extends Document, z.infer<typeof bookSchema> {
  deductQuantity: (quantity: number) => IBook;
}

const bookMongooseSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    available: { type: Boolean, required: true },
    copies: { type: Number, required: true },
    description: { type: String, required: false },
    genre: {
      type: String,
      required: true,
      enum: [
        'FICTION',
        'NON_FICTION',
        'SCIENCE',
        'HISTORY',
        'BIOGRAPHY',
        'FANTASY',
      ],
    },
    isbn: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

bookMongooseSchema.pre('save', function (this: IBook, next) {
  const validation = bookSchema.safeParse(this.toObject());
  if (validation.success) next();
  else next(validation.error);
});

bookMongooseSchema.methods.deductQuantity = function (
  this: IBook,
  quantity: number
) {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than zero');
  }
  if (this.copies < quantity) {
    throw new Error('Not enough copies left to borrow');
  }
  this.copies -= quantity;
  if (this.copies == 0) this.available == false;
  this.save();
  return this;
};

export const BookDBModel = model<IBook>('Book', bookMongooseSchema);
