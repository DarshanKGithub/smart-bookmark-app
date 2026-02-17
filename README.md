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

## 👨‍💻 Author

Your Name : Darshan Kshetri  
LinkedIn: https://www.linkedin.com/in/darshankshetri/   
GitHub: https://github.com/DarshanKGithub

---

