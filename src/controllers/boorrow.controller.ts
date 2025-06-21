import type { Request, Response, NextFunction } from 'express';
import { borrowSchema } from '../typeschema/borrow';
import { BorrowDBModel } from '../models/borrow.model';
import { z } from 'zod';
import { ValidationError } from '../utils/ValidationError';
import { BookDBModel } from '../models/book.model';
import { Types } from 'mongoose';

export async function borrowBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const borrowData = req.body;
  borrowData.dueDate = new Date(borrowData.dueDate);

  try {
    borrowData.book = new Types.ObjectId(borrowData.book);
    const parsedBorrowData = borrowSchema.parse(borrowData);
    const borrowedBookData = await BookDBModel.findById(parsedBorrowData.book);

    if (!borrowedBookData) throw new Error('Book with ID not found');

    const updatedBookData = borrowedBookData.deductQuantity(
      parsedBorrowData.quantity
    );
    // borrowData.save();
    const borrowDBData = await BorrowDBModel.insertOne(parsedBorrowData);
    const borrowResponseData = {
      _id: borrowDBData._id,
      book: parsedBorrowData.book,
      quantity: parsedBorrowData.quantity,
      dueDate: parsedBorrowData.dueDate,
      //@ts-ignore
      createdAt: borrowDBData.createdAt,
      //@ts-ignore
      updatedAt: borrowDBData.updatedAt,
    };
    res.json({
      success: true,
      message: 'Book borrowed successfully',
      data: borrowResponseData,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError)
      return next(new ValidationError('Validation Failed', error.format()));
    res.status(400).json({
      succes: false,
      message: 'An error occured',
      error: String(error),
    });
  }
}

export async function getBorowSumary(req: Request, res: Response) {
  try {
    const aggregation = await BorrowDBModel.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: 'book',
          foreignField: '_id',
          as: 'book',
        },
      },
      { $unwind: '$book' },
      {
        $group: {
          _id: '$book._id',
          totalQuantity: { $sum: '$quantity' },
          title: { $first: '$book.title' },
          isbn: { $first: '$book.isbn' },
        },
      },
      {
        $project: {
          _id: 0,
          book: {
            title: '$title',
            isbn: '$isbn',
          },
          totalQuantity: 1,
        },
      },
    ]);
    res.json({
      success: true,
      message: 'Borrowed books summary retrieved successfully',
      data: aggregation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Something went wrong',
      data: null,
    });
  }
}
