# Kreslo Ofis - Setup Instructions

## 1. Supabase Setup

1.  Create a new project at [supabase.com](https://supabase.com).
2.  Go to the **SQL Editor** in the Supabase Dashboard.
3.  Open `supabase/migrations/20240101_init.sql` from this repository.
4.  Copy the contents and run it in the SQL Editor to create the database schema and RLS policies.
5.  Go to **Storage** and create a new public bucket named `product-images`.
6.  Go to **Project Settings -> API**.
7.  Copy the `URL` and `anon public key`.

## 2. Environment Variables

1.  Rename `.env.local.example` to `.env.local` (or create it if missing).
2.  Fill in the Supabase URL and Key.

## 3. Create Admin User

1.  Go to **Authentication -> Users** in Supabase Dashboard.
2.  Invite a user (e.g., your email).
3.  (Optional) Disable "Enable Signups" in **Authentication -> Providers -> Email** if you want to restrict access.

## 4. Run the Project

- Install dependencies: `npm install`
- Start development server: `npm run dev`

Visit `http://localhost:3000/admin` to log in and manage products.
