# 🔖 Realtime Bookmark Manager

A modern full-stack bookmark manager built with **Next.js 14 + Supabase** featuring:

- 🔐 Google OAuth Authentication
- 🛡 Row Level Security (RLS)
- ⚡ Realtime updates
- 🚀 Optimistic UI
- 🌟 Modern responsive UI
- 🔄 Secure session middleware

Live demo: (add your Vercel link here)

---

## ✨ Features

### 🔐 Authentication
- Google OAuth login via Supabase
- Server-side session validation
- Middleware protected routes
- Secure logout

### 🛡 Security
- Row Level Security (RLS) enabled
- Users can only access their own bookmarks
- No client-side trust

### ⚡ Realtime
- Supabase Realtime subscription
- New bookmarks sync instantly
- Deletes sync across sessions

### 🚀 Optimistic UI
- Bookmarks appear instantly on add
- Instant removal on delete
- Smooth UX without waiting for server

### 🎨 Modern UI
- Glass-style dashboard
- Soft gradient background
- Animated hover effects
- Responsive design

---

## 🧠 Tech Stack

| Layer        | Technology |
|--------------|------------|
| Frontend     | Next.js 14 (App Router) |
| Backend      | Supabase |
| Database     | PostgreSQL |
| Auth         | Supabase OAuth |
| Realtime     | Supabase Realtime |
| Styling      | Tailwind CSS |
| Deployment   | Vercel |

---

## 🗂 Project Structure

```
app/
  ├── login/
  ├── auth/
  │   ├── callback/
  │   └── signout/
  ├── page.tsx
components/
  ├── BookmarkForm.tsx
  ├── BookmarkList.tsx
lib/
  ├── supabase/
middleware.ts
```

---

## 🛠 Setup Instructions

### 1️⃣ Clone the repo

```bash
git clone https://github.com/DarshanKGithub/smart-bookmark-app
cd smart-bookmark-app
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create environment variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

### 4️⃣ Setup Supabase

Create table:

```sql
create table bookmarks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  url text not null,
  user_id uuid references auth.users on delete cascade,
  created_at timestamp default now()
);
```

Enable **Row Level Security** and add policies:

```sql
-- Enable RLS
alter table bookmarks enable row level security;

-- Select policy
create policy "Users can view their bookmarks"
on bookmarks
for select
using (auth.uid() = user_id);

-- Insert policy
create policy "Users can insert their bookmarks"
on bookmarks
for insert
with check (auth.uid() = user_id);

-- Delete policy
create policy "Users can delete their bookmarks"
on bookmarks
for delete
using (auth.uid() = user_id);
```

---

## 🔄 How Realtime Works

- Client subscribes to `bookmarks` table
- Listens for INSERT + DELETE events
- Updates UI instantly
- Combined with Optimistic UI for ultra-smooth UX

---

## 🔒 Why RLS Matters

Instead of filtering bookmarks client-side:

```js
.where('user_id', user.id)
```

We enforce security at the database level:

```sql
auth.uid() = user_id
```

This prevents:
- Data leaks
- Malicious queries
- Cross-user access

Production-grade security.

---

## 🚀 Deployment

Deploy easily to **Vercel**:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

---

## 📈 What Makes This Stand Out

- Uses Next.js App Router properly
- Implements server-side auth
- Uses middleware protection
- Applies real database security (RLS)
- Realtime + Optimistic UI combined
- Clean architecture

This is not just CRUD.
It demonstrates production patterns.

---

## 🧩 Challenges Faced & How I Solved Them

### 1️⃣ OAuth Login Working but No Redirect

**Problem:**  
After successful Google login, the app stayed on the login page instead of redirecting to the dashboard.

**Cause:**  
The session was being created, but middleware wasn’t properly validating and refreshing the auth session on the server side.

**Solution:**  
- Implemented Supabase server client inside `middleware.ts`
- Used `supabase.auth.getUser()` to validate the session
- Properly redirected authenticated users away from `/login`

**What I Learned:**  
Client-side auth is not enough in production apps. Server-side session validation is critical for security and proper routing.

---

### 2️⃣ Row Level Security (RLS) Blocking Queries

**Problem:**  
Insert and select queries were failing even though the table existed.

**Cause:**  
RLS was enabled, but policies were either missing or incorrect.

**Solution:**  
- Enabled RLS explicitly
- Added `SELECT`, `INSERT`, and `DELETE` policies
- Used `auth.uid() = user_id` to enforce ownership

**What I Learned:**  
Security must be enforced at the database layer, not only in frontend filters.

---

### 3️⃣ OAuth Working Locally but Failing in Production

**Problem:**  
Google login worked on localhost but failed after deploying to Vercel.

**Cause:**  
Supabase redirect URLs were not updated with the production domain.

**Solution:**  
- Added production URL to Supabase → Authentication → URL Configuration
- Set correct redirect path: `/auth/callback`

**What I Learned:**  
OAuth requires strict domain configuration. Environment parity matters.

---

### 4️⃣ Realtime Not Updating UI

**Problem:**  
Database was updating but UI wasn’t reflecting changes instantly.

**Cause:**  
Supabase realtime subscription wasn’t properly subscribed to INSERT and DELETE events.

**Solution:**  
- Subscribed using `.channel()` and `postgres_changes`
- Updated state inside callback
- Cleaned up subscription on unmount

**What I Learned:**  
Realtime systems require careful subscription handling and cleanup to avoid memory leaks.

---

### 5️⃣ Slow UX During Inserts

**Problem:**  
Users had to wait for the database response before seeing new bookmarks.

**Cause:**  
UI was waiting for server confirmation before updating state.

**Solution:**  
Implemented **Optimistic UI**:
- Temporarily added bookmark to local state
- Synced with database in background
- Rolled back on error

**What I Learned:**  
Perceived performance is as important as actual performance.

---

## 📚 Key Takeaways

This project reinforced:

- Importance of server-side authentication
- Database-level security with RLS
- Handling OAuth in production
- Managing realtime subscriptions
- Designing smooth user experience with optimistic updates
- Structuring a full-stack app with proper separation of concerns

---



## 👨‍💻 Author

Your Name : Darshan Kshetri  
LinkedIn: https://www.linkedin.com/in/darshankshetri/   
GitHub: https://github.com/DarshanKGithub

---

