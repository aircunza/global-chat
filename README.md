# Global Chat API

## Overview

The **Global Chat API** provides real-time communication features using **WebSocket** and **Socket.io**. This API supports user registration, login, and real-time chat functionality, including the ability to create rooms, send messages, and manage users. It uses **JWT authentication** for securing routes.

⚠️ **Important**:

- All routes are protected using an `accessToken` sent as an `HttpOnly` cookie, which must be included in every authenticated request, except for `/login` and `/sign-up` which are publicly accessible.
- Chat events (such as joining rooms, sending messages, etc.) are implemented with **WebSocket** and **Socket.io** and cannot be tested directly with Swagger. To test these events, you will need to run the application and interact with the WebSocket server using the provided commands in the README.

---

## 📹 Demo

Watch the app in action! Below are demo videos showcasing the main functionalities of the Global Chat App:

- 🔐 [Sign-Up Demo](#) — Register a new user
- 🔑 [Login Demo](#) — Authenticate and enter the platform
- 🏠 [Create Room Demo](#) — Create a new chat room
- 💬 [Chat Demo](#) — Real-time messaging between users

---

## Features

### User Authentication and Management (REST API)

- **Sign-Up**: Register a new user.
- **Login**: Authenticate the user and get an `accessToken` for subsequent requests.
- **Logout**: Log the user out and clear the session.
- **Session Verification**: Verify if a user is still authenticated.
- **User Management**: Get a list of users, and create, get, and update user data.

### Real-Time Chat (Socket.io Events)

- **Join a Room**: Join an existing chat room.
- **Send a Message**: Send a message to a room.
- **Create a Room**: Create a new chat room.
- **Delete a Room**: Delete an existing room.
- **Get Available Rooms**: Get a list of available chat rooms.
- **Disconnect from Chat**: Disconnect from a room or from all rooms.

---

## 🗄️ Data Storage

- **Auth and User Data**: Stored in PostgreSQL databases for development and testing.
- **Chat Data**: Stored **only in memory**. All messages and rooms are temporary and lost after a server restart.

---

## 🧪 Testing WebSocket Events

Since chat functionality is built using WebSocket (via **Socket.io**), you cannot test these events directly via Swagger. To test chat functionality:

1. Run the application (frontend and backend).
2. Use a WebSocket testing tool like [Postman](https://www.postman.com/) or [Socket.io client](https://socket.io/docs/v4/client-api/) to connect.
3. Or test from the included React client application.

---

## 🚀 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/aircunza/global-chat.git
tcd global-chat-api
```

### 2. Start All Services with Docker Compose

#### a. Navigate to the backend folder:

```bash
cd server
```

#### b. Start the databases:

```bash
docker compose up -d
```

This command launches PostgreSQL for both development and testing environments and PgAdmin.

---

### 3. Run the Backend (Express Server)

Make sure you're inside the `server/` directory:

```bash
npm install
npm run dev
```

To run tests:

```bash
npm run test         # Run all tests
npm run test:unit    # Unit tests
npm run test:int     # Integration tests
npm run test:e2e     # End-to-end tests
```

---

### 4. Run the Frontend (React + Vite)

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173).

---

## 📁 Environment Variables Examples

### Backend `.env.dev`

```env
PORT_API=3001
PG_DB=pg
PG_USER=userdb
PG_PASSWORD=1234*
PG_HOST=localhost  # or postgres_dev if inside Docker
PG_PORT=5432
JWT_SECRET=your_jwt_secret
URL_CLIENT1=http://localhost:5173
```

### Backend `.env.test`

```env
PORT_API=3002
PG_DB=pg
PG_USER=userdb
PG_PASSWORD=1234*
PG_HOST=localhost  # or postgres_test if inside Docker
PG_PORT=5433
JWT_SECRET=your_jwt_secret
```

### Frontend `.env`

```env
VITE_API=http://localhost:3001
```

---

## 📦 Technologies

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Real-time:** Socket.io
- **Database:** PostgreSQL
- **Containerization:** Docker + Docker Compose
- **Testing:** Jest

---

## ✅ Prerequisites

- Node.js (v18+)
- Docker and Docker Compose
- Git

---

## 📄 License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International](https://creativecommons.org/licenses/by-nc/4.0/) License.

You are free to use, copy, and modify the code for personal and educational purposes only. Commercial use is not permitted. Proper attribution must be given by including a link to the original repository.
