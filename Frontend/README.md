# React + Vite

## Frontend

This project uses React with Vite for the frontend. 

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Santosh1479/EV_USER
    ```
2. Navigate to the frontend directory:
    ```sh
    cd your-repo/frontend
    ```
3. Install dependencies:
    ```sh
    npm install
    ```
4. Start the development server:
    ```sh
    npm run dev
    ```

### Build

To create a production build, run:
```sh
npm run build
```

## Backend

The backend is built with Node.js and Express.

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Santosh1479/EV_USER
    ```
2. Navigate to the backend directory:
    ```sh
    cd your-repo/backend
    ```
3. Install dependencies:
    ```sh
    npm install
    ```
4. Start the server:
    ```sh
    npm start
    ```

### API Endpoints

#### User Authentication

- **POST /api/auth/register**
  - Registers a new user.
  - Request body:
     ```json
     {
        "username": "string",
        "password": "string"
     }
     ```
  - Response:
     ```json
     {
        "message": "User registered successfully"
     }
     ```

- **POST /api/auth/login**
  - Logs in a user.
  - Request body:
     ```json
     {
        "username": "string",
        "password": "string"
     }
     ```
  - Response:
     ```json
     {
        "token": "string"
     }
     ```

#### User Data

- **GET /api/users**
  - Retrieves a list of users.
  - Response:
     ```json
     [
        {
          "id": "number",
          "username": "string"
        }
     ]
     ```

- **GET /api/users/:id**
  - Retrieves a user by ID.
  - Response:
     ```json
     {
        "id": "number",
        "username": "string"
     }
     ```

- **PUT /api/users/:id**
  - Updates a user by ID.
  - Request body:
     ```json
     {
        "username": "string",
        "password": "string"
     }
     ```
  - Response:
     ```json
     {
        "message": "User updated successfully"
     }
     ```

- **DELETE /api/users/:id**
  - Deletes a user by ID.
  - Response:
     ```json
     {
        "message": "User deleted successfully"
     }
     ```

### Environment Variables

Create a `.env` file in the backend directory and add the following variables:
```
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

### Testing

To run tests, use:
```sh
npm test
```
