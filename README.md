# 🎬 CineBook — Movie Ticket Booking App

A full-stack MERN application for browsing movies and booking tickets.

## Tech Stack
- **Frontend**: React + Vite, React Router, Axios — deployed on **Vercel**
- **Backend**: Node.js, Express, Mongoose — deployed on **Render**
- **Database**: MongoDB Atlas

## Project Structure
```
├── backend/    # Express API
└── frontend/   # React (Vite) app
```

## Local Development

### Backend
```bash
cd backend
cp .env.example .env   # fill in your MONGO_URI
npm install
npm run dev            # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env   # set VITE_API_URL if needed
npm install
npm run dev            # runs on http://localhost:5173
```

## Seed a Movie (via API)
```bash
curl -X POST http://localhost:5000/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "description": "A thief who steals corporate secrets through dream-sharing technology.",
    "genre": "Sci-Fi",
    "duration": 148,
    "releaseDate": "2010-07-16",
    "poster": "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    "price": 14,
    "availableSeats": 80
  }'
```

## Deployment

### Backend → Render
1. Push `backend/` to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set `MONGO_URI` in environment variables
4. Build: `npm install` | Start: `node server.js`

### Frontend → Vercel
1. Push `frontend/` to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set `VITE_API_URL` to your Render backend URL
4. Deploy — Vercel auto-detects Vite
