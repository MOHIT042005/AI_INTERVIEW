# MongoDB Setup

## 1. Start MongoDB

Use either a local MongoDB server or MongoDB Atlas. Example local URI:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/ai_interview
```

## 2. Configure environment

Create `.env` in the project root:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/ai_interview
JWT_SECRET=replace-with-a-long-random-string
CLIENT_URL=http://localhost:5173
PORT=5000
VITE_API_URL=/api
```

## 3. Install dependencies

```bash
npm install
```

## 4. Run the app

Terminal 1:

```bash
npm run server
```

Terminal 2:

```bash
npm run dev
```

## Notes

- User profiles are stored in the `users` collection.
- Interview history is stored in the `interviews` collection.
- Password reset currently records a reset request token in MongoDB. It does not send email yet.