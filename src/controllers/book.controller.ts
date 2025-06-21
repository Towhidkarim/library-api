import type { Request, Response, NextFunction } from 'express';
import { BookDBModel } from '../models/book.model';
import { bookSchema } from '../typeschema/book';
import { z } from 'zod';
import { ValidationError } from '../utils/ValidationError';

export async function getBooks(req: Request, res: Response) {
  try {
    const { bookId } = req.params;
    //testing id - 6855255f748c258013828e47
    if (typeof bookId === 'string') {
      //get by id
      const bookData = await BookDBModel.findById(bookId);
      if (bookData)
        res.json({
          success: true,
          message: 'Book retrieved successfully',
          data: bookData,
        });
      else
        res.json({
          success: false,
          message: 'Book with given ID not found',
          data: null,
        });
    } else {
      const { filter, sort, sortBy, limit } = req.query;

      const filterQuery = filter ? { genre: filter } : {};
      const bookData = await BookDBModel.find(filterQuery)
        .sort(`${sort === 'asc' ? '' : '-'}${sortBy ?? 'createdAt'}`)
        .limit(!Number.isNaN(limit) && Number(limit) > 0 ? Number(limit) : 10);
      res.json({
        success: true,
        message: 'Books retrieved successfully',
        data: bookData,
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error,
      data: null,
    });
  }
}

export async function postBooks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const bookData = req.body;
  try {
    const parsedData = bookSchema.parse(bookData);
    const savedData = await BookDBModel.insertOne(parsedData);
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: savedData,
    });
  } catch (error) {
    if (error instanceof z.ZodError)
      return next(new ValidationError('Validation Failed', error.format()));
    next();
  }
}

export async function updateBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const updateData = req.body;
  const { bookId } = req.params;
  try {
    const partialBookSchema = bookSchema.partial();
    const parsedData = partialBookSchema.parse(updateData);
    const updatedData = await BookDBModel.findByIdAndUpdate(
      bookId,
      { $set: parsedData },
      { new: true }
    );
    // console.log(updateData);
    res.json({
      success: true,
      message: 'Book updated successfully',
      data: updatedData,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError)
      return next(new ValidationError('Validation Failed', error.format()));
    else
      res.status(400).json({
        success: false,
        message: 'Something Went Wrong',
        data: null,
        error,
      });
  }
}

export async function deleteBook(req: Request, res: Response) {
  const { bookId } = req.params;

  try {
    await BookDBModel.findByIdAndDelete(bookId);
    res.json({
      success: true,
      message: 'Book deleted successfully',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid ID or record with given ID doesn't exist",
    });
  }
}
