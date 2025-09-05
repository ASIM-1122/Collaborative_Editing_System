# Collaborative Editing System

A full-stack, microservices-based platform for real-time document collaboration, user authentication, and version management.

---

## Architecture

- **User Services** (`userServices/`): Handles user registration, login, authentication, and token management.
- **Document Services** (`documentServices/`): Manages document CRUD, collaboration requests, and real-time editing via Socket.IO.
- **Front End** (`frontEnd/`): React + Redux web app for users to interact with documents and collaboration features.

---

## Features

- JWT-based authentication and secure password hashing (bcrypt)
- Create, edit, and delete documents
- Add collaborators and manage access
- Public/private document visibility
- Collaboration requests (owner approval required)
- Real-time editing with Socket.IO
- Redux state management on frontend
- RESTful APIs with CORS and cookie support

---

## Folder Structure

```
Collaborative-Editing-System/
│
├── userServices/         # User authentication microservice (Node.js, Express, MongoDB)
├── documentServices/     # Document management microservice (Node.js, Express, MongoDB, Socket.IO)
└── frontEnd/             # React frontend (Vite, Redux Toolkit, Tailwind CSS)
```

---

## Getting Started

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd Collaborative-Editing-System
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

Frontend runs at [http://localhost:5173](http://localhost:5173).

---

## API Endpoints

### User Services (`http://localhost:5000/users`)
- `POST /register` — Register a new user
- `POST /login` — Login and receive JWT token
- `POST /logout` — Logout and blacklist token
- `GET /profile` — Get user profile (requires authentication)
- `GET /:id` — Get user by ID
- `POST /bulk` — Bulk fetch users by IDs

### Document Services (`http://localhost:3000/document`)
- `POST /create` — Create a new document (auth required)
- `GET /fetchUserDocuments` — Get documents for logged-in user
- `GET /fetchAllDocuments` — Get all public documents
- `GET /fetchDocumentById/:id` — Get document by ID (auth required)
- `POST /addCollaborator/:documentID` — Add collaborator (owner only)
- `PUT /updateDocument/:documentID` — Update document (owner/collaborator only)
- `DELETE /delete/:id` — Delete document (owner only)

### Collaboration Requests (`http://localhost:3000/document-requests`)
- `POST /requestCollaborator/:documentID` — Request to collaborate (non-owner)
- `GET /requests` — Get pending requests for owner
- `POST /requests/:requestId/accept` — Accept request (owner only)
- `POST /requests/:requestId/decline` — Decline request (owner only)

---

## Real-Time Collaboration

- Socket.IO server runs in `documentServices`
- Events:
  - `join-document` — Join document room
  - `send-changes` — Broadcast live typing changes
  - `save-document` — Save document content
  - Collaboration request/accept/decline notifications

---

## Frontend Usage

- Register or login to access dashboard
- Create, edit, and collaborate on documents
- Send/accept collaboration requests
- Real-time editing and version history

---

## Technologies Used

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Socket.IO
- **Frontend:** React, Redux Toolkit, Axios, Tailwind CSS, Vite
- **Other:** dotenv, cookie-parser, CORS, EJS (for server views)

---

## Contribution

Fork and submit pull requests. For major changes, open an issue first.

---

## License

ISC License

---

## Author

Asim Nazir
