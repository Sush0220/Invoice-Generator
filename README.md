# Invoice-Generator

This repository contains the backend for an Invoice Management System built using Node.js, Express, and MongoDB. It provides RESTful APIs for managing invoices, users, and related operations. 

## Features

- **User Authentication and Authorization**:
  - Two roles: Admin and User.
  - Admin can create, edit, delete, and view all invoices.
  - Regular users can view their own invoices and download them as PDFs.

- **Invoice Management**:
  - Create, edit, and delete invoices.
  - View list of invoices or a specific invoice by ID.
  - Generate downloadable PDF versions of invoices.

- **Payment Status Management**:
  - Track the payment status of invoices (Paid, Pending, Overdue).

## Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [Postman](https://www.postman.com/) or similar tool for API testing

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sush0220/Invoice-Generator.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Invoice-Generator
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and configure the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

5. Start the server:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000`.

## API Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
- Request Body:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "role": "User" // Optional (defaults to User)
  }
  ```

#### Login
- **POST** `/auth/login`
- Request Body:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

### Invoices

#### Create Invoice (Admin Only)
- **POST** `/invoice/invoices`
- Request Body:
  ```json
  {
    "invoiceNumber": "INV-1001",
    "customerDetails": {
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "phone": "1234567890",
      "address": "123 Main St, Springfield"
    },
    "invoiceDate": "2025-01-01",
    "dueDate": "2025-01-15",
    "items": [
      { "name": "Laptop", "quantity": 1, "price": 1200 },
      { "name": "Mouse", "quantity": 1, "price": 25 }
    ],
    "taxRates": 10,
    "discount": 50,
    "paymentStatus": "Pending"
  }
  ```

#### Get All Invoices
- **GET** `/invoice/invoices`

#### Get User's Invoices (Regular User)
- **GET** `/invoice/invoices`

#### Get Invoice by ID
- **GET** `invoice/invoices/:id`

#### Update Invoice (Admin Only)
- **PUT** `/invoice/invoices/:id`
- Request Body: Same as **Create Invoice**

#### Delete Invoice (Admin Only)
- **DELETE** `/invoice/invoices/:id`

#### Download Invoice PDF
- **GET** `/invoice/invoices/:id/pdf`

## Directory Structure

```
backend/
├── controllers/
│   ├── authController.js
│   ├── invoiceController.js
├── models/
│   ├── User.js
│   ├── Invoice.js
├── routes/
│   ├── authRoutes.js
│   ├── invoiceRoutes.js
├── middleware/
│   ├── authMiddleware.js
├── utils/
│   ├── pdfGenerator.js
├── app.js
├── server.js
└── .env
```

## Middleware

- **Authentication Middleware**: Protect routes by verifying JWT tokens.
- **Role-based Access Control**: Allow or restrict actions based on user roles.

## Utilities

- **PDF Generator**: Generate invoice PDFs using `pdfkit`.

## Error Handling

- Proper error responses for invalid inputs or unauthorized access.
- Standardized error format for API responses.
