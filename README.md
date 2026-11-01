# TaskFlow – AI-Powered Task Manager

TaskFlow is a full-stack task management application developed using React.js, Node.js, Express.js, and MongoDB. It helps users organize, manage, and track their tasks efficiently, with AI-powered task description generation and priority suggestions.

## About the Project

The main objective of TaskFlow is to provide a centralized platform where users can manage their daily tasks.

The application includes user authentication, task management, caching, event-driven programming, Docker containerization, CI automation, and AI integration.

## Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

### Additional Technologies
- NodeCache
- EventEmitter
- Docker
- Docker Compose
- GitHub Actions
- Jest
- Supertest
- Groq AI API

## Features

### 1. User Authentication
- User registration and login.
- Password hashing using bcrypt.
- JWT-based authentication.
- Protected routes.

### 2. Task Management
- Create new tasks.
- View task lists.
- Update task information.
- Delete tasks.
- Manage task priorities.

### 3. AI-Powered Task Generation
- Generate task descriptions using AI.
- Suggest task priority based on the task title.
- Edit generated descriptions.
- Accept or ignore suggested priorities.
- Powered by Groq AI.

### 4. Performance Optimization
- Implemented NodeCache for caching task data.
- Cache expiration using TTL.
- Cache invalidation after task modifications.
- Cache status tracking using response headers.

### 5. Event-Driven Programming
- Implemented Node.js EventEmitter.
- Task creation and deletion events.
- Asynchronous event listeners.
- Error handling for event listeners.

### 6. Docker Containerization
- Separate Dockerfiles for frontend and backend.
- Docker Compose configuration.
- MongoDB, backend, and frontend services.

### 7. Continuous Integration
- GitHub Actions workflow.
- Automated backend tests.
- Automated frontend production build.
- Jest and Supertest for backend testing.

### 8. React Performance Optimization
- React.lazy for lazy loading.
- Suspense for loading components.
- Route-based code splitting.

## Project Structure

```text
task-manager-p6/
│
├── backend/
│   ├── events/
│   │   └── taskEvents.js
│   ├── services/
│   │   └── geminiService.js
│   ├── tests/
│   │   └── server.test.js
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
│
├── frontend/
│   └── template/
│       ├── src/
│       ├── public/
│       ├── Dockerfile
│       ├── nginx.conf
│       └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
└── README.md
```

*Some additional files and folders may be present in the repository.*

## Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB
- Git

### 1. Clone the repository

```bash
git clone https://github.com/DhyaniPatel07/task-manager-p6.git
```

### 2. Open the project folder

```bash
cd task-manager-p6
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
PORT=5000
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
```

Replace the secret and API key with your own values. Never upload your `.env` file or API key to GitHub.

Start the backend:

```bash
node server.js
```

Backend runs on:

```text
http://localhost:5000
```

### 4. Frontend Setup

Open another terminal:

```bash
cd frontend/template
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173
```

## Running with Docker

Make sure Docker Desktop is running, then execute these commands from the root project folder:

```bash
docker compose up --build -d
```

To check running containers:

```bash
docker compose ps
```

To stop the containers:

```bash
docker compose down
```

## Testing

Run backend tests from the backend folder:

```bash
npm test
```

The GitHub Actions workflow also runs backend tests and checks the frontend production build.

## AI Integration

TaskFlow uses the Groq API to generate task descriptions and suggest task priorities.

The user enters a task title, and the AI generates a suitable description and priority suggestion. The user can review and edit the description and accept or ignore the suggested priority before saving the task.

## Learning Outcomes

- Developing a full-stack application.
- Implementing authentication using JWT and bcrypt.
- Connecting React with a Node.js and Express backend.
- Managing application data using MongoDB.
- Implementing caching using NodeCache.
- Understanding event-driven programming using EventEmitter.
- Containerizing applications using Docker.
- Automating testing and builds using GitHub Actions.
- Integrating AI APIs into a web application.
- Using Git and GitHub for version control.

## GitHub Repository

[TaskFlow – Task Manager Repository](https://github.com/DhyaniPatel07/task-manager-p6)



Developed as part of Web Development Framework practical work and project implementation.
