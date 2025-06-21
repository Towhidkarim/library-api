# Library API

A minimal RESTful API for managing books and borrow records in a library system. Built using **Express** and **Bun** (Can also be run using npm), and powered by **MongoDB** with **Mongoose ORM** for the database.

📍 **Live API**: [https://library-api-737v.onrender.com](https://library-api-737v.onrender.com)

**(NOTE: Please be patient when visiting, it may take a little bit of time to spin up the live server since it's on free tier on render.com)**

---

## Features

- Add, retrieve, modify and delete books
- Filter Books by Category and Creation Time
- Borrowing of books powered by mongoose instance method, handling the business logic
- Sumary of all borrowed books and entries using mongoose aggregation pipeline
- Centralized error handling, 404 error handling, and validation using Zod
- Organized architecture (controllers, routes, models, middlewares)
- MongoDB integration with Mongoose
- Built with Bun and Node.js compatibility (tsx package used for node)

---

## Setup Instructions

### Prerequisites

- Node.js or Bun
- MongoDB connection string
- `.env` file (not included in this repo), must be placed on the root directory

### `.env` Format

```
PORT=<server_port>
MONGO_URI=<mongodb_uri>
```

### Install Dependencies

```bash
bun install
```

> Or if using Node.js:
>
> ```bash
> npm install
> ```

### Run the Server (Development)

```bash
bun run dev
```

Or (for Node.js, start command will run the whole server with tsx) :

```bash
npm run start
```

---

## API Endpoints

### Books

- `POST /api/books` – Add a new book

#### Request:

```json
{
  "title": "The Theory of Everything v9",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "123456789",
  "description": "A given book description",
  "copies": 5,
  "available": true
}
```

#### Response:

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "68565107734df40f8a14b90c",
    "title": "The Theory of Everything v9",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "123456789",
    "description": "A given book description",
    "copies": 5,
    "available": true,
    "createdAt": "2025-06-21T06:28:23.527Z",
    "updatedAt": "2025-06-21T06:28:23.527Z"
  }
}
```

- `GET /api/books` – Get all books
- `GET /api/books/:bookId` – Get a book by it's ID
- `GET /api/books?filter=<genre>&sortBy=createdAt&sort=desc&limit=<limit>` – Get filtered books

#### GET Response Format:

```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [
    {
        "_id": "68565107734df40f8a14b90c",
        "title": "The Theory of Everything v9",
        "author": "Stephen Hawking",
        "available": true,
        "copies": 5,
        "description": "A given book description",
        "genre": "SCIENCE",
        "isbn": "9780553380163",
        "createdAt": "2025-06-21T06:28:23.527Z",
        "updatedAt": "2025-06-21T06:28:23.527Z"
    },
    {...}
  ]
}
```

- `PUT /api/books/:bookId` – Modify a book data

#### PUT Request to modify:

```json
{
  "copies": 50,
  "description": "A modified description."
}
```

#### Response:

```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "_id": "68565107734df40f8a14b90c",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "A modified description.",
    "copies": 50,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-20T08:30:00.000Z"
  }
}
```

- `DELETE /api/books/:bookId` – Delete a book

#### DELETE Response:

```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": null
}
```

### Borrow

- `POST /api/borrow` – Borrow a book

#### Request:

```json
{
  "book": "68565107734df40f8a14b90c",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

#### Response:

```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "_id": "64bc4a0f9e1c2d3f4b5a6789",
    "book": "68565107734df40f8a14b90c",
    "quantity": 3,
    "dueDate": "2025-07-18T00:00:00.000Z",
    "createdAt": "2025-06-18T07:12:15.123Z",
    "updatedAt": "2025-06-18T07:12:15.123Z"
  }
}
```

- `GET /api/borrow` – Get a sumary of all borrow records

#### GET sumary Response

```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "totalQuantity": 6,
      "book": {
        "title": "The Theory of Everything Second Edition",
        "isbn": "9780553380163"
      }
    },
    {
      "totalQuantity": 9,
      "book": {
        "title": "The Theory of Everything",
        "isbn": "5465464644894"
      }
    },
    {
      "totalQuantity": 5,
      "book": {
        "title": "The Theory of Everything v5",
        "isbn": "9780553380163"
      }
    },
    {...},
  ]
}
```

---

## Error Handling

### Schema Validation Error response demo:

Schema validation has been done using Zod

```json
{
  "success": false,
  "message": "Validation Failed",
  "errors": {
    "_errors": [],
    "genre": {
      "_errors": [
        "Invalid enum value. Expected 'FICTION' | 'NON_FICTION' | 'SCIENCE' | 'HISTORY' | 'BIOGRAPHY' | 'FANTASY', received 'Random'"
      ]
    },
    "copies": {
      "_errors": ["Number must be greater than or equal to 0"]
    }
  }
}
```

#### ALso, 404 errors are managed through configured wildcard middleware

Error handlers:

```ts
app.use((req, res) => {
  res.status(404).send('Error 404 not found');
});
app.use(errorHandler);
```

---

## Project Structure

```
src/
├── controllers      # Route logic
├── db               # MongoDB connection
├── middleware       # Error handler middleware
├── models           # Mongoose schemas with instance methods and hooks
├── routes           # Express routes
├── typeschema       # Zod validation type schemas
├── utils            # Utility functions (Error instance class)
├── app.ts           # Express app setup
└── server.ts        # App entry point
```

---

## API Testing

For API testing, **Postman** have been used, But **Thunder Client** can also be used to test the endpoints locally or on the deployed URL.

---
