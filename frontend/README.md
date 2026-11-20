# Pulse frontend

React single page app built with Vite. The API base URL is configured in `local.env` for local development and can be overridden with `VITE_API_URL` in a deployment environment.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal. The app calls the API at `https://backend-pied-one-94.vercel.app` by default.

## Build

```bash
npm run build
npm run preview
```

## Deploy the frontend to Vercel

Create a separate Vercel project from this repository and set its **Root Directory** to `frontend`. Vercel detects Vite. Use `npm run build` as the build command and `dist` as the output directory. Add the environment variable `VITE_API_URL=https://backend-pied-one-94.vercel.app` for Production, Preview, and Development, then redeploy. The API URL is public configuration; do not put Supabase secret keys in this frontend.

## Backend routes used

- `GET /api/events`
- `GET /api/users`
- `GET /api/me/registrations?user_id=<uuid>`
- `POST /api/registrations`
- `POST /api/events`

The role dropdown only changes the interface mode; this app does not implement login or authentication. The user ID dropdown reads IDs and roles from `GET /api/users`.

The deployed backend URL was checked while preparing this frontend: its root responds, but `GET /api/events` currently returns HTTP 500 and `GET /api/users` returns HTTP 404. The local Flask backend includes these API routes, so redeploy the updated backend and configure its Supabase environment variables before live records, IDs, registrations, and event publishing can work from the deployed frontend.

Before the backend redeploy, apply [`../backend/public_no_auth_access.sql`](../backend/public_no_auth_access.sql) in Supabase. It grants the anonymous Data API role the limited table operations required by the no-login app.
