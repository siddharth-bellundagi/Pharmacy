Cloud Deployment Guide (Vercel + Render / Railway)

Overview
- Frontend: Deploy to Vercel (static site built by Vite)
- Backend: Deploy to Render (or Railway/Heroku) as a Node web service
- Database: MongoDB Atlas (already configured in this project)

Pre-requisites
- GitHub account (or Git provider) and repository for this project
- Vercel account (https://vercel.com)
- Render (https://render.com) or Railway/Heroku account
- MongoDB Atlas cluster and connection string (MONGODB_URI)

1) Push your repo to GitHub
- From your local project root:

```powershell
git init
git add .
git commit -m "Initial commit"
# create a repo on GitHub then:
git remote add origin https://github.com/<your-user>/<repo>.git
git push -u origin main
```

2) Deploy frontend to Vercel
- In Vercel dashboard -> New Project -> Import Git Repository
- Select this repository and pick the root project (this repo contains both frontend and backend in separate folders). Use this project for the frontend.
- Configure build settings:
  - Framework Preset: "Other"
  - Build Command: `npm run build`
  - Output Directory: `dist`
- Add environment variable for API base URL:
  - `VITE_API_BASE_URL` = `https://<your-backend-host>/api` (set after backend is deployed)
- Deploy. Vercel will provide a URL like `https://your-app.vercel.app`.

3) Deploy backend to Render (example)
- In Render dashboard -> New -> Web Service -> Connect GitHub repository
- For "Environment" choose: `Node`
- For "Root Directory" set to: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Set Environment Variables in Render service settings:
  - `MONGODB_URI` = `mongodb+srv://...` (your Atlas connection string)
  - `PORT` = `5000` (optional, Render provides PORT automatically)
- Deploy. Render will build and give a public URL like `https://pharmacy-backend.onrender.com`.

Note: If you prefer Railway/Heroku, the process is similar: create a Node service pointing to `/backend`, set `MONGODB_URI`, set start command to `npm start`.

4) Update frontend environment variable in Vercel
- After backend URL is available, set Vercel environment variable `VITE_API_BASE_URL` to `https://<your-backend-host>/api` and redeploy frontend.

5) CORS & Security
- Backend currently uses `cors()` to allow requests; verify `server-mongodb.js` allows production origins or use a whitelist to allow your Vercel domain.

6) Backups
- Use MongoDB Atlas built-in backup and/or regularly run `mongodump` to export data.

7) DNS / Custom Domain (optional)
- You can set custom domains for both frontend and backend in Vercel/Render dashboards and add SSL automatically.

8) Useful commands (local build/test)

```powershell
# Build frontend locally
npm run build
# Preview built site
npm run preview

# Run backend locally (from backend folder)
cd backend
npm install
npm run dev
```

9) Environment variables summary
- Frontend (Vercel): `VITE_API_BASE_URL` -> `https://<backend-host>/api`
- Backend (Render): `MONGODB_URI` -> `mongodb+srv://...`

10) Troubleshooting
- If frontend shows CORS errors, make sure backend allows the frontend origin.
- If API calls 404, verify `VITE_API_BASE_URL` ends with `/api` if your frontend app appends `/sales` or similar.

If you'd like, I can:
- Create a `render.yaml` manifest and `vercel.json` (already added `vercel.json`) for reproducible deploys.
- Prepare a small CI (GitHub Actions) to auto-deploy on push to `main`.
- Deploy the backend for you (I can provide exact steps to run or a script), but I won't be able to perform the cloud deploy without your cloud account access.

Tell me which additional automation you'd like: `render.yaml`, GitHub Actions auto-deploy, or help with configuring Vercel/Render step-by-step while you connect accounts.
