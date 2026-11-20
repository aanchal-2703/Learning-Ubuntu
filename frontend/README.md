# Pulse frontend

React single page app built with Vite. The API base URL is configured in `local.env` for local development and can be overridden with `VITE_API_URL` in a deployment environment.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal. The app calls the API at `https://learning-ubuntu.onrender.com` by default.

## Build

```bash
npm run build
npm run preview
```

## Deploy the frontend to Vercel

Create a separate Vercel project from this repository and set its **Root Directory** to `frontend`. Vercel detects Vite. Use `npm run build` as the build command and `dist` as the output directory. Add the environment variable `VITE_API_URL=https://learning-ubuntu.onrender.com` for Production, Preview, and Development, then redeploy. The API URL is public configuration; do not put Supabase secret keys in this frontend.

## Backend routes used

- `GET /api/events`
- `GET /api/users`
- `GET /api/me/registrations?user_id=<uuid>`
- `POST /api/registrations`
- `POST /api/events`

The role dropdown only changes the interface mode; this app does not implement login or authentication. The user ID dropdown reads IDs and roles from `GET /api/users`.

The deployed Render backend was checked while preparing this frontend: its root responds, and both `GET /api/events` and `GET /api/users` reach the API but currently return HTTP 500 because Supabase denies access to those tables. Apply the SQL policy file below before live records, IDs, registrations, and event publishing can work from the deployed frontend.

Before the backend redeploy, apply [`../backend/public_no_auth_access.sql`](../backend/public_no_auth_access.sql) in Supabase. It grants the anonymous Data API role the limited table operations required by the no-login app.
