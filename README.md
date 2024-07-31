<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Task Management Backend Application

This is a backend application built with NestJS that allows users to create, view, and delete tasks. The application uses JWT tokens and cookies for authentication and authorization. User passwords are hashed using Argon2, MongoDB is used as the database, and Redis is used for storing cookies.

## Table of Contents
1. [Features](#features)
2. [Endpoints](#endpoints)
3. [Improvements](#improvements)
4. [Installation](#installation)
5. [Environment Variables](#environment-variables)
6. [Usage](#usage)
7. [Technologies Used](#technologies-used)
8. [License](#license)

## Features
- User signup and login with JWT-based authentication.
- Task management: add, view, and delete tasks.
- Password hashing using Argon2 for enhanced security.
- Efficient data handling with cookies and Redis.
- MongoDB for data storage.

## Endpoints
### Authentication
- `POST /auth/signup`: Register a new user.
- `POST /auth/login`: Login a user.
- `POST /auth/logout`: Logout a user and delete the session key.

### Tasks
- `GET /task/all`: Fetch all tasks for the authenticated user.
- `DELETE /task/delete`: Delete a specified task.
- `POST /task/add`: Add a new task to the database.

## Improvements
- Store the user ID in the JWT payload instead of the user email.
- Use a guard to check if there is data in the cookies before transferring the request to the route handler.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/contawo/Nest_JS_Backend_Task_Application
   ```
2. Navigate to the project directory:
   ```bash
   cd Nest_JS_Backend_Task_Application
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
MONGODB_URL=mongodb://localhost:27017/nest_tasks
AUTH_SECRET=secret_key
APP_PORT=8000
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Usage
1. Make sure that you have Redis installed in your device and start the Redis server:
   ```bash
   redis-server
   ```
2. Run the application:
   ```bash
   npm run start:dev
   ```

The server will be running on `http://localhost:8000`.

## Technologies Used
- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)
- [Argon2](https://www.npmjs.com/package/argon2)
- [JWT](https://jwt.io/)

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

If you encounter any issues or have questions, feel free to open an issue on the [GitHub repository](https://github.com/contawo/Nest_JS_Backend_Task_Application).
