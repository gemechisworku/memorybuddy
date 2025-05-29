# MemoryBuddy

A simple note-taking web application built with Next.js, Supabase, and Tailwind CSS.

## Features

- User authentication with email/password and Google sign-in
- Create, edit, delete, and view notes
- Responsive design
- Real-time updates
- Secure data storage with Supabase

## Prerequisites

- Node.js 16.x or later
- npm or yarn
- A Supabase account and project

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd memorybuddy
```

2. Install dependencies:
```bash
npm install
```

3. Create a Supabase project and set up the database:

- Create a new project on [Supabase](https://supabase.com)
- In the SQL editor, create the notes table:

```sql
create table notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table notes enable row level security;

-- Create policy to allow users to only see their own notes
create policy "Users can only access their own notes" on notes
  for all using (auth.uid() = user_id);
```

4. Create a `.env.local` file in the root directory with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Configure Google OAuth (optional):
- Go to the Google Cloud Console and create OAuth credentials
- Add the credentials to your Supabase project authentication settings

6. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage

1. Sign up or log in using email/password or Google authentication
2. Create new notes using the form at the top of the page
3. View your notes in the grid below
4. Edit or delete notes using the buttons on each note card
5. Log out using the button in the header

## License

MIT
