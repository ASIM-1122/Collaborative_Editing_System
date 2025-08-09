# Collaborative Editing System

This project is a full-stack collaborative document editing system, featuring user authentication, document creation, editing, and real-time collaboration capabilities. The system is divided into three main components:

- **User Services** (`userServices/`): Handles user registration, login, authentication, and token management.
- **Document Services** (`documentServices/`): Manages document CRUD operations, collaboration, and access control.
- **Front End** (`frontEnd/`): A React-based web application for users to interact with the system.

---

## Features

- User registration and login with JWT authentication
- Secure password hashing using bcrypt
- Create, edit, and delete documents
- Add collaborators to documents
- Public/private document visibility
- Redux state management on the frontend
- RESTful API structure
- CORS and cookie-based authentication for secure cross-origin requests

---

## Folder Structure

```
Collaborative_Editing_System/
│
├── userServices/         # User authentication microservice (Node.js, Express, MongoDB)
├── documentServices/     # Document management microservice (Node.js, Express, MongoDB)
└── frontEnd/             # React frontend (Vite, Redux Toolkit, Tailwind CSS)
```

---

## Getting Started

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd Collaborative_Editing_System
```

### 2. Environment Variables

- Copy `.env.example` to `.env` in both `userServices/` and `documentServices/` and fill in your MongoDB and JWT secret keys.

### 3. Install Dependencies

```sh
# User Services
cd userServices
npm install

# Document Services
cd ../documentServices
npm install

# Frontend
cd ../frontEnd
npm install
```

### 4. Start the Backend Services

Open two terminals:

```sh
# Terminal 1: User Services
cd userServices
npm start

# Terminal 2: Document Services
cd documentServices
npm start
```

### 5. Start the Frontend

```sh
cd frontEnd
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173).

---

## API Endpoints

### User Services (`http://localhost:5000/users`)
- `POST /register` - Register a new user
- `POST /login` - Login and receive JWT token
- `POST /logout` - Logout and blacklist token
- `GET /profile` - Get user profile (requires authentication)

### Document Services (`http://localhost:3000/document`)
- `POST /create` - Create a new document (requires authentication)
- `PUT /updateDocument/:documentID` - Update a document (owner/collaborator only)
- `DELETE /delete/:id` - Delete a document (owner only)
- `POST /addCollaborator/:documentID` - Add a collaborator (owner only)

---

## Frontend Usage

- Register or login to access your dashboard.
- Create new documents, edit existing ones, or collaborate on shared documents.
- Profile and authentication state are managed via Redux and cookies/localStorage.

---

## Technologies Used

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **Frontend:** React, Redux Toolkit, Axios, Tailwind CSS, Vite
- **Other:** dotenv, cookie-parser, CORS, EJS (for server views)

---

## Contribution

Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

---

## License

This project is licensed under the ISC License.

---

## Author

Asim Nazir
