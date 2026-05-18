# ⚡ Smart Leads Dashboard

> A production-quality MERN stack SaaS application for lead management with role-based access control, advanced filtering, and CSV export.

---

## 📸 Screenshots

> Register · Login · Dashboard · Lead Details

---

## 🧰 Tech Stack

| Layer      | Technologies                                                           |
| ---------- | ---------------------------------------------------------------------- |
| Frontend   | React 18, TypeScript, Vite, TailwindCSS, React Router DOM, Axios      |
| State      | Zustand (auth), TanStack Query (server state)                          |
| Forms      | React Hook Form + Zod validation                                       |
| UI         | Lucide React icons, React Hot Toast                                    |
| Backend    | Node.js, Express.js, TypeScript, Mongoose                              |
| Auth       | JWT (jsonwebtoken), bcryptjs password hashing                          |
| Security   | helmet, cors, dotenv, express-async-errors                             |
| Validation | Zod (both frontend & backend)                                          |
| Database   | MongoDB / MongoDB Atlas                                                |
| DevOps     | Docker, Docker Compose, Vercel (frontend), Render/Railway (backend)    |

---

## ✨ Features

### Authentication
- ✅ JWT-based login & registration
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Token stored in localStorage, auto-attached via Axios interceptor
- ✅ Global 401 handler with automatic redirect
- ✅ Protected & Public route guards

### RBAC (Role-Based Access Control)
| Feature        | Admin | Sales |
| -------------- | :---: | :---: |
| View Leads     | ✅    | ✅    |
| Create Leads   | ✅    | ✅    |
| Update Leads   | ✅    | ✅    |
| Delete Leads   | ✅    | ❌    |
| Export CSV     | ✅    | ❌    |

### Leads Management
- ✅ Full CRUD (Create, Read, Update, Delete)
- ✅ Lead fields: name, email, status, source, createdBy, timestamps
- ✅ Status: `new` | `contacted` | `qualified` | `lost`
- ✅ Source: `website` | `instagram` | `referral`

### Advanced Filtering
- ✅ Filter by status
- ✅ Filter by source
- ✅ Debounced search (500ms) on name/email
- ✅ Sort by latest/oldest
- ✅ All filters composable simultaneously
- ✅ Dynamic MongoDB query building

### Pagination
- ✅ Server-side pagination (10 per page)
- ✅ Smart ellipsis pagination UI
- ✅ Full pagination metadata in API response

### Additional
- ✅ CSV Export (admin-only, filter-aware)
- ✅ Statistics cards (total, qualified, contacted, lost)
- ✅ Loading states, empty states, error states
- ✅ Responsive design (mobile + desktop)
- ✅ Toast notifications
- ✅ Collapsible sidebar with mobile drawer
- ✅ Lead detail page

---

## 📁 Folder Structure

```
smart-lead-dashboard/
├── backend/
│   └── src/
│       ├── config/          # DB connection, env validation
│       ├── controllers/     # HTTP handlers (thin layer)
│       ├── middlewares/     # auth, validate, errorHandler
│       ├── models/          # Mongoose schemas
│       ├── routes/          # Express routers
│       ├── services/        # Business logic
│       ├── types/           # TypeScript interfaces
│       ├── utils/           # response helpers, jwt utils
│       ├── validations/     # Zod schemas
│       ├── app.ts           # Express app factory
│       └── server.ts        # Entry point + graceful shutdown
│
├── frontend/
│   └── src/
│       ├── api/             # Axios instance + API services
│       ├── components/
│       │   ├── dashboard/   # StatCard, FiltersBar, LeadsTable
│       │   ├── forms/       # LeadFormModal, ConfirmDeleteModal
│       │   └── ui/          # Button, Input, Select, Modal, Badge...
│       ├── constants/       # App-wide constants & color maps
│       ├── hooks/           # useDebounce, useCsvExport
│       ├── layouts/         # Sidebar, TopNavbar, DashboardLayout
│       ├── pages/           # Login, Register, Dashboard, LeadDetails
│       ├── routes/          # ProtectedRoute, PublicRoute
│       ├── store/           # Zustand auth store
│       └── types/           # TypeScript interfaces
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🔌 API Documentation

### Auth Routes

| Method | Endpoint             | Auth | Description     |
| ------ | -------------------- | :--: | --------------- |
| POST   | /api/auth/register   | ❌   | Register user   |
| POST   | /api/auth/login      | ❌   | Login user      |
| GET    | /api/auth/me         | ✅   | Get current user|

### Lead Routes

| Method | Endpoint                   | Auth  | Role  | Description       |
| ------ | -------------------------- | :---: | :---: | ----------------- |
| GET    | /api/leads                 | ✅    | All   | Get all leads     |
| GET    | /api/leads/stats           | ✅    | All   | Get stats         |
| GET    | /api/leads/export/csv      | ✅    | Admin | Export CSV        |
| GET    | /api/leads/:id             | ✅    | All   | Get single lead   |
| POST   | /api/leads                 | ✅    | All   | Create lead       |
| PUT    | /api/leads/:id             | ✅    | All   | Update lead       |
| DELETE | /api/leads/:id             | ✅    | Admin | Delete lead       |

### Query Parameters (GET /api/leads)

| Param   | Type                                       | Default  |
| ------- | ------------------------------------------ | -------- |
| page    | number                                     | 1        |
| limit   | number (max 100)                           | 10       |
| status  | new \| contacted \| qualified \| lost      | —        |
| source  | website \| instagram \| referral           | —        |
| search  | string                                     | —        |
| sort    | latest \| oldest                           | latest   |

### Standard API Response Format

```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalRecords": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas URI)
- npm

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGODB_URI and JWT_SECRET
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`  
Backend runs at `http://localhost:5000`

---

## 🐳 Docker Setup

```bash
# Build and run all services
docker-compose up --build

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

Services:
- **Frontend** → `http://localhost:80`
- **Backend** → `http://localhost:5000`
- **MongoDB** → `localhost:27017`

---

## 🌐 Environment Variables

### Backend (`.env`)

| Variable       | Description                          | Example                        |
| -------------- | ------------------------------------ | ------------------------------ |
| PORT           | Server port                          | 5000                           |
| NODE_ENV       | Environment                          | development / production       |
| MONGODB_URI    | MongoDB connection string            | mongodb+srv://...              |
| JWT_SECRET     | JWT signing secret (min 32 chars)    | your-super-secret-key          |
| JWT_EXPIRES_IN | Token expiry                         | 7d                             |
| FRONTEND_URL   | Allowed CORS origin                  | http://localhost:5173           |

### Frontend (`.env`)

| Variable     | Description        | Example                                    |
| ------------ | ------------------ | ------------------------------------------ |
| VITE_API_URL | Backend API URL    | /api (dev) or https://api.example.com/api  |

---

## ☁️ Deployment

### Frontend → Vercel
1. Import the `frontend/` folder into Vercel
2. Set `VITE_API_URL` to your backend URL in Vercel environment variables
3. Deploy

### Backend → Render / Railway
1. Connect your GitHub repo
2. Set root directory to `backend/`
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add all environment variables from `.env.example`

### Database → MongoDB Atlas
1. Create a free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Whitelist all IPs (`0.0.0.0/0`) or your server IP
3. Copy connection string to `MONGODB_URI`

---

## 🏗️ Architecture Decisions

- **Service layer**: Business logic lives in `services/`, controllers are thin HTTP handlers
- **Zod everywhere**: Same validation library on both frontend and backend
- **Zustand + TanStack Query**: Zustand owns auth/UI state; TanStack Query owns all server state
- **Dynamic filter building**: MongoDB queries built programmatically using spread — no string concatenation
- **`Promise.all` for pagination**: Count and data fetched in parallel for performance
- **Multi-stage Docker**: TS compiled in build stage, only JS + node_modules in production image

---

## 📝 Git Commit Style

```
feat: setup backend typescript server
feat: implement jwt authentication  
feat: add lead CRUD APIs
feat: implement advanced filtering with pagination
feat: add dashboard UI with stats cards
feat: integrate debounced search
feat: add CSV export for admin role
feat: add Docker setup with compose
fix: resolve auth middleware typing
style: improve responsive layout
```
