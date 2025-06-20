import { connect } from 'mongoose';

export async function connectDB() {
  try {
    connect(process.env.MONGO_URI!);
    console.log('MongoDB Connected to Atlas Succesfully');
  } catch (error) {
    console.error(error);
  }
}
