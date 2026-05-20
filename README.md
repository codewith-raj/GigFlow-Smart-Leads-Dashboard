# GigFlow Smart Leads Dashboard

> A polished MERN lead management dashboard with JWT auth, RBAC, filtering, pagination, CSV export, dark mode, and live deployment.

---

## 🚀 Live Demo

- Frontend: `https://gig-flow-smart-leads-dashboard-alpha.vercel.app/login`
- Backend: `https://gigflow-smart-leads-dashboard-ptr4.onrender.com`

---

## ✨ What this project includes

- Modern **MERN + TypeScript** architecture
- JWT-based authentication with secure password hashing
- Role-based access control for Admin and Sales users
- Lead CRUD with details, filters, and analytics
- Advanced filtering and debounced search
- Server-side pagination with metadata
- CSV export for filtered lead data
- Responsive dashboard UI with dark mode
- Docker support and deployment-ready configuration

---

## 🧰 Tech Stack

| Layer      | Technologies                                                           |
| ---------- | ---------------------------------------------------------------------- |
| Frontend   | React 18, TypeScript, Vite, TailwindCSS, React Router, Axios           |
| State      | Zustand, TanStack Query                                                 |
| Forms      | React Hook Form, Zod                                                    |
| Backend    | Node.js, Express, TypeScript, Mongoose                                 |
| Auth       | JWT, bcryptjs                                                           |
| Security   | helmet, cors, dotenv, express-async-errors                             |
| Validation | Zod (frontend + backend)                                                |
| Database   | MongoDB / MongoDB Atlas                                                 |
| Deployment | Vercel (frontend), Render (backend), Docker                            |

---

## 🚩 Key Features

### Authentication
- JWT login and registration
- Password hashing with bcrypt
- Protected routes and auth guards
- Global 401 handling with redirect to login

### Role-Based Access Control
| Feature        | Admin | Sales |
| -------------- | :---: | :---: |
| View leads     | ✅    | ✅    |
| Create leads   | ✅    | ✅    |
| Update leads   | ✅    | ✅    |
| Delete leads   | ✅    | ❌    |
| Export CSV     | ✅    | ❌    |

### Lead Management
- Full CRUD for leads
- Lead fields: `name`, `email`, `status`, `source`, `createdBy`, timestamps
- Status: `new`, `contacted`, `qualified`, `lost`
- Source: `website`, `instagram`, `referral`

### Filtering & Search
- Filter by status and source
- Debounced search on name/email
- Sort by latest or oldest
- Combined filters for richer queries

### Pagination & Export
- Server-side pagination (default 10 items per page)
- Smart pagination UI
- CSV export with active filters applied

---

## 📁 Project Structure

```
GigFlow-Smart-Leads-Dashboard/
├── backend/
│   ├── src/
│   │   ├── config/       # Env + DB setup
│   │   ├── controllers/  # HTTP handlers
│   │   ├── middlewares/  # Auth, validation, error handling
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express routers
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Helpers
│   │   └── validations/  # Zod schemas
│   └── .env.example      # Backend environment reference
├── frontend/
│   ├── src/
│   ├── public/
│   └── .env.example      # Frontend environment reference
├── api-docs/
├── docker-compose.yml
├── .env.example
├── API.md
└── README.md
```

---

## 🔌 Setup Instructions

### Prerequisites
- Node.js 20+
- npm
- MongoDB local or Atlas URI
- Optional: Docker

### Local Development

#### Backend

```bash
cd backend
cp .env.example .env
# Update backend/.env with your MongoDB URI and JWT secret
npm install
npm run dev
```

Backend default URL: `http://localhost:5000`

#### Frontend

```bash
cd frontend
cp .env.example .env
# Update frontend/.env if needed
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`

---

## 🔧 Environment Variables

This repo includes safe example environment files with placeholders only.
- Root env reference: `.env.example`
- Backend env reference: `backend/.env.example`
- Frontend env reference: `frontend/.env.example`

### Backend variables
- `PORT`
- `NODE_ENV`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `FRONTEND_URL`
- `ALLOW_ADMIN_REGISTRATION`
- `GOOGLE_CLIENT_ID`

### Frontend variables
- `VITE_API_URL`
- `VITE_GOOGLE_CLIENT_ID`

---

## 🐳 Docker Setup

```bash
docker-compose up --build
docker-compose down
```

---

## 📌 API Documentation

See [API.md](./API.md) for full API details, request payloads, and response schemas.

---

## ✅ Deployment

- Frontend: `https://gig-flow-smart-leads-dashboard-alpha.vercel.app/login`
- Backend: `https://gigflow-smart-leads-dashboard-ptr4.onrender.com`

---

## 📌 Notes

- `.env.example` files contain placeholders only and do not include secrets.
- Do not commit `.env` files with real credentials.
- Make sure backend `FRONTEND_URL` matches the deployed or local frontend URL.
