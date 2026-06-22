# StudyNyx 🧠

> AI-powered study platform — generate flashcards, quizzes, summaries, and chat with an AI tutor from any study material.

Built by **Nyxon** | React + Vite + Node.js + Express + MongoDB + Claude AI

---

## ✨ Features

- 📄 **Document Upload** — PDF, TXT, or paste text directly
- 🃏 **AI Flashcard Generation** — Instant flashcards with flip animation
- 📝 **AI Summary** — Brief, standard, or in-depth summaries
- 🧠 **AI Tutor** — Chat with Claude about your material
- 🎯 **AI Quiz Generator** — MCQ quizzes with explanations and scoring
- 📅 **Study Plan** — Schedule and track study sessions
- 📊 **Progress Analytics** — Streaks, scores, mastery tracking
- 🔐 **Auth** — JWT-based register/login

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier is fine)
- Anthropic API key

---

### 1. Clone & install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Fill in your .env values

# Frontend
cd ../frontend
npm install
cp .env.example .env
# Fill in VITE_API_URL
```

---

### 2. Configure `.env` (backend)

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/studynyx
JWT_SECRET=your_secret_key_here
ANTHROPIC_API_KEY=sk-ant-your_key_here
CLIENT_URL=http://localhost:5173
```

---

### 3. Configure `.env` (frontend)

```env
VITE_API_URL=http://localhost:5000/api
```

---

### 4. Run locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173**

---

## 📦 Deploying

### Backend → Render / Railway
1. Push `backend/` to GitHub
2. Set environment variables in your host dashboard
3. Start command: `npm start`

### Frontend → Vercel
1. Push `frontend/` to GitHub
2. Import to Vercel
3. Set `VITE_API_URL` to your backend URL
4. Deploy

---

## 🗂 Project Structure

```
studynyx/
├── backend/
│   ├── models/          # MongoDB schemas (User, Document, Flashcard, Quiz)
│   ├── routes/          # Express routes (auth, ai, documents, users)
│   ├── middleware/       # JWT auth middleware
│   └── server.js        # Entry point
└── frontend/
    └── src/
        ├── api/          # Axios client
        ├── context/      # Auth context
        ├── pages/        # Landing, Login, Register, Dashboard
        └── components/
            └── dashboard/ # Sidebar, Topbar, Overview, Flashcards, Quiz, Tutor, Documents, Progress, StudyPlan
```

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Custom CSS (dark theme) |
| Icons | Lucide React |
| HTTP | Axios |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| AI | Anthropic Claude (`claude-sonnet-4-6`) |
| File parsing | pdf-parse, multer |

---

## 📝 License

MIT — made with ♥ by Nyxon
