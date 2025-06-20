import app from './app';
import { connectDB } from './db/db';

const PORT = process.env.PORT || 3000;

async function main() {
  await connectDB();
  app.listen(PORT, () => console.log(`App Running on Port ${PORT}`));
}

main();
