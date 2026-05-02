# ProjectFlow

ProjectFlow is a full stack team project management platform with JWT authentication, admin/member role-based access, project and task CRUD, team management, dashboard analytics, notifications, activity logs, profile image uploads, task attachments, and a drag-and-drop Kanban board.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router DOM, Axios, React Hot Toast, Recharts, @hello-pangea/dnd, Context API
- Backend: Node.js, Express.js, JWT, bcryptjs, express-validator, Multer
- Database: MongoDB Atlas with Mongoose
- Deployment: Railway

## Features

- Signup/login/logout with JWT stored in `localStorage`
- Admin role: create/edit/delete projects, manage members, create/assign/delete tasks, view team stats
- Member role: view assigned projects/tasks, update own task status, update profile
- Dynamic dashboard cards for projects, tasks, completion, pending, overdue, and completion rate
- Pie, bar, and line charts for task status, priority, and productivity
- Search, filtering, sorting-ready APIs, and pagination
- Kanban board with Pending, In Progress, and Completed columns
- Notifications for task assignment/completion and project updates
- Activity timeline for project and task actions
- Profile image upload and task attachment backend support
- Responsive SaaS dashboard layout

## Project Structure

```text
backend/
  config/ controllers/ middleware/ models/ routes/ utils/ validators/ uploads/
  server.js package.json .env.example railway.json
frontend/
  src/components src/context src/hooks src/layouts src/pages src/services
  package.json vite.config.js tailwind.config.js .env.example railway.json
```

## Local Setup

Install Node.js 20 or newer first.

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:5000` by default.

## Environment Variables

Backend `.env`:

```text
PORT=5000
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/projectflow
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

Frontend `.env`:

```text
VITE_API_URL=http://localhost:5000/api
```

## API Documentation

Auth:

- `POST /api/auth/register` `{ name, email, password, confirmPassword, role }`
- `POST /api/auth/login` `{ email, password }`
- `GET /api/auth/me`

Projects:

- `POST /api/projects` Admin only
- `GET /api/projects?search=&status=&page=&limit=`
- `GET /api/projects/:id`
- `PUT /api/projects/:id` Admin only
- `DELETE /api/projects/:id` Admin only
- `PUT /api/projects/:id/members` Admin only, body `{ members: [userId] }`

Tasks:

- `POST /api/tasks` Admin only
- `GET /api/tasks?search=&status=&priority=&project=&assignedTo=&page=&limit=`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id` Admin only
- `PATCH /api/tasks/:id/status` `{ status }`

Users, dashboard, notifications:

- `GET /api/users`
- `GET /api/users/stats` Admin only
- `PUT /api/users/profile`
- `DELETE /api/users/:id` Admin only
- `GET /api/dashboard`
- `GET /api/notifications`
- `PATCH /api/notifications/read`

Protected endpoints require:

```text
Authorization: Bearer <token>
```

## Railway Deployment

Deploy backend and frontend as separate Railway services.

Backend:

1. Create a new Railway service from the repository.
2. Set the root directory to `backend`.
3. Add `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and optional `PORT`.
4. Railway will run `npm start`.

Frontend:

1. Create a second Railway service from the same repository.
2. Set the root directory to `frontend`.
3. Add `VITE_API_URL=https://your-backend.railway.app/api`.
4. Railway will run `npm run preview -- --port $PORT`.

After both services are deployed, update backend `CLIENT_URL` to the Railway frontend URL.

## Final Deliverables

- Live frontend URL: deploy the `frontend` Railway service and use its generated domain.
- Live backend URL: deploy the `backend` Railway service and use its generated domain.
- GitHub repository: push this folder to GitHub, then connect both Railway services to it.
- Authentication, RBAC, CRUD, analytics, responsive UI, and Railway configuration are included in this codebase.
