# Qab Elias School — MVP

## Local dev

1. Install deps: `npm install`
2. Create a Firebase project and enable Auth (email/password) and Firestore.
3. Add environment variables (see `.env.local` example).
4. Run: `npm run dev` and open http://localhost:3000

## Deploy (Vercel)

1. Push repo to GitHub.
2. Import to Vercel and set env vars in Vercel dashboard.
3. Deploy.

## Notes

- Create admin users by:
  1. Creating the user via Sign Up in the app.
  2. In Firestore console, create a document in `users` collection with the user's uid and field `role: "admin"`.
