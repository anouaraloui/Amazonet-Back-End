
# Amazon Simulation Backend

This repository contains the backend implementation of an Amazon-like e-commerce platform. The project is developed using **Node.js**, **Express.js**, and **MongoDB** to create a robust and scalable backend system.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)

## Features
- **User Authentication & Authorization**: Secure user registration, login, and role-based access control.
- **Product Management**: Create, read, update, and delete (CRUD) operations for products.
- **Order Management**: Manage orders, including creation, tracking, and history.
- **Payment Integration**: Integration with payment gateways for handling transactions.
- **Notifications**: Real-time notifications using Socket.IO for order status updates.
- **RESTful API**: A well-structured and organized API for interaction between the client and server.

## Tech Stack
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: NoSQL database for data storage.
- **JWT**: JSON Web Tokens for secure authentication.
- **Socket.IO**: Real-time communication for notifications.


## API Endpoints

Here’s a brief overview of the key API endpoints:

- **Authentication**
  - `POST /auth/register`: Register a new user
  - `POST /auth/login`: User login
  - `POST /auth/recoverPassword`: Request to reset user password
  - `PATCH /auth/resetPassword`: Reset user password

- **Users**
  - `GET /user`: Get all users
  - `GET /users/:id`: Get a specific user by ID
  - `PUT /users/:id`: Update a user by ID
  - `DELETE /users/:id`: Delete a user by ID
  - `GET /summary`: Get the summary

- **Products**
  - `GET /products`: Get all products without filter
  - `GET /products/filter`: Get all products with filter
  - `GET /products/filter/search`: Filter products
  - `GET /products/departement/categories`: Filter products with catgory
  - `GET /products/slug/:slug`: Filter products with slug
  - `GET /products/:id`: Get a specific product by ID
  - `POST /products`: Create a new product
  - `PUT /products/:id`: Update a product by ID
  - `DELETE /products/:id`: Delete a product by ID
  - `POST /products/:id/reviews`: Add reviews to product

- **Orders**
  - `POST /:id`: Creating an with a product ID
  - `GET /orders`: Get all orders for the logged-in user
  - `GET /orders/:id`: Get a specific order by ID
  - `PATCH /orders/deliver/:id`: Deliveryman's Decision
  - `PATCH /pay/:id`: Payed the order by the customer
  - `PUT /orders/:id`: Update an order in the cart
  - `DELETE /orders/:id`: Remove an order from the cart


