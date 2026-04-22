# AI Interview App

This project now uses a React frontend with an Express + MongoDB backend instead of Supabase.

## Environment

Create an `.env` file in the project root with:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/ai_interview
JWT_SECRET=replace-with-a-long-random-string
CLIENT_URL=http://localhost:5173
PORT=5000
VITE_API_URL=/api
```

## Run locally

Install dependencies:

```bash
npm install
```

Start the Mongo API:

```bash
npm run server
```

In a second terminal, start the frontend:

```bash
npm run dev
```

The frontend talks to the backend through the Vite `/api` proxy.

## Available API routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`
- `GET /api/profile`
- `PATCH /api/profile`
- `GET /api/interviews`
- `POST /api/interviews`
- `GET /api/interviews/:id`
- `PATCH /api/interviews/:id`
