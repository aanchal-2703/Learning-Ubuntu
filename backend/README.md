# Learning-Ubuntu
# Learning-Ubuntu

## Public no-login API

This app uses the Supabase publishable key from `SUPABASE_PUBLISHABLE_KEY`. Set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in the backend deployment environment; do not use or expose a service-role/secret key for this public app.

The frontend intentionally has no login or authentication. To let the anonymous Supabase role access the exact tables and operations used by this app, review and run [`public_no_auth_access.sql`](public_no_auth_access.sql) in the Supabase SQL Editor. It allows public reads of events and user IDs, public event creation, and reads/registration inserts; it does not grant update or delete. The role dropdown is a UI switch and is not server-side identity verification.

The deployed backend at `https://backend-pied-one-94.vercel.app` must be redeployed from this backend code to expose `GET /api/users` and `POST /api/events`. The local API currently requires the SQL grants/policies above before Supabase reads and writes succeed.
