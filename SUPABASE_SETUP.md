# Supabase Authentication Setup Guide

## Quick Setup Steps:

### 1. Create Supabase Account
- Go to https://app.supabase.com
- Sign up with email or GitHub
- Create a new project
- Choose a name, password, and region

### 2. Get Your Credentials
- Navigate to **Project Settings > API keys**
- Copy:
  - **URL** (under "Project URL")
  - **anon public** key (under "Project API keys")

### 3. Create .env.local File
In your project root (`AI_INTERVIEW/`), create a file named `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Disable Email Confirmation (For Development)
By default, Supabase requires email confirmation for new signups. For development/testing, you can disable this:

1. Go to Supabase Dashboard > Authentication > Settings
2. Scroll down to "Email Confirmations"
3. Toggle OFF "Enable email confirmations"
4. Click "Save"

**Note:** For production, keep email confirmation enabled for security.

### 5. Create Database Tables (Required For Dashboard And Interview Features)
The dashboard and interview pages require both the `profiles` and `interviews` tables:

1. Go to Supabase Dashboard > SQL Editor
2. Run this query:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE  USING (auth.uid() = id);

-- Create interviews table for storing interview sessions
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  type TEXT NOT NULL, -- 'technical', 'behavioral', 'system_design', etc.
  score INTEGER, -- 0-100
  feedback TEXT,
  duration INTEGER, -- in minutes
  answer_log JSONB, -- stores submitted answers for richer result review
  highlights JSONB, -- stores generated coaching takeaways
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Enable RLS for interviews
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own interviews
CREATE POLICY "Users can read their own interviews"
  ON interviews FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own interviews
CREATE POLICY "Users can insert their own interviews"
  ON interviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own interviews
CREATE POLICY "Users can update their own interviews"
  ON interviews FOR UPDATE
  USING (auth.uid() = user_id);
```

### 5. Test the Application
```bash
npm run dev
```

Then visit:
- Homepage: http://localhost:5173
- Signup: http://localhost:5173/signup
- Login: http://localhost:5173/login
- Dashboard: http://localhost:5173/dashboard (requires login)
- Results: http://localhost:5173/results (requires interview completion or an id query)
- Profile: http://localhost:5173/profile (requires login)

### Updating Existing Projects
If your `interviews` table already exists, run this migration so saved result details can be reopened later:

```sql
ALTER TABLE interviews
  ADD COLUMN IF NOT EXISTS answer_log JSONB,
  ADD COLUMN IF NOT EXISTS highlights JSONB;
```

## Features Included

✅ **User Authentication**
- Email/Password signup and login
- Secure password storage
- Session management

✅ **Protected Routes**
- Dashboard only accessible after login
- Auto-redirect to login if unauthorized

✅ **User Profile**
- Store full name and email
- Display user info in navbar and dashboard

✅ **Logout Functionality**
- Session cleanup
- Redirect to home

## File Structure

```
src/
├── config/
│   └── supabase.js          # Supabase client setup
├── context/
│   └── AuthContext.jsx      # Auth state management
├── pages/
│   ├── Home.jsx             # Homepage (existing)
│   ├── Login.jsx            # Login page
│   ├── Signup.jsx           # Sign up page
│   └── Dashboard.jsx        # User dashboard (protected)
├── components/
│   ├── Navbar.jsx           # Updated with auth features
│   ├── ProtectedRoute.jsx   # Protected route wrapper
│   └── ... other components
└── App.jsx                  # Updated with routing
```

## Adding More Features

### 1. Store Interview Attempts
```sql
CREATE TABLE interview_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT,
  score INT,
  duration INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Store User Settings
```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_language TEXT,
  theme TEXT,
  notifications_enabled BOOLEAN
);
```

## Troubleshooting

### Real AI evaluation with Ollama
To enable free local AI scoring for interviews:

1. Install Ollama from https://ollama.com/download
2. Pull a local model:
```bash
ollama pull gemma3:1b
```
3. Optional: create `.env.local` entry to choose a different local model:
```bash
VITE_OLLAMA_MODEL=gemma3:1b
```
4. Restart the Vite dev server after changing `.env.local`
5. Keep Ollama running while you use the app

The app talks to Ollama through the Vite dev proxy at `/api/ollama`, which forwards to `http://127.0.0.1:11434`.

### "Not getting credentials" error
- Confirm you created `.env.local` file (not `.env`)
- Restart dev server after adding credentials
- Check URL and key are correct from Supabase

### "Signup successful but can't login"
- Check if confirmation email is required
- Go to Supabase > Authentication > Email Templates
- Check if "Confirm email" is enabled

### Routes not working
- Ensure React Router is installed: `npm list react-router-dom`
- Check App.jsx imports are correct
- Restart dev server

## Next Steps

1. Add password reset functionality
2. Add user profile update page
3. Add interview question database
4. Add submission and scoring logic
5. Add social authentication (Google, GitHub)
6. Add email notifications

## Support

For Supabase help: https://supabase.com/docs
For React Router help: https://reactrouter.com
