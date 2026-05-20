# Full Stack Intern Assignment — Checklist

Cross-reference for the **Smart Leads Dashboard** spec (React + TS + Tailwind, Node + Express + TS, MongoDB + Mongoose). Each item maps to where it is implemented in this repo.

## Stack & structure

| Requirement | Where |
|-------------|--------|
| React + TypeScript + Tailwind | `frontend/` (`vite`, `tailwind.config.js`, `src/`) |
| Node + Express + TypeScript | `backend/src/` (`server.ts`, `app.ts`, routes, controllers, services) |
| MongoDB + Mongoose | `backend/src/models/`, `config/db` usage in app bootstrap |
| Sensible folder structure | `frontend/src/{api,components,hooks,pages,layouts,store,...}`, `backend/src/{routes,controllers,services,middlewares,models,utils}` |

## Authentication

| Requirement | Where |
|-------------|--------|
| Register / login | `backend/src/routes/auth.routes.ts`, `auth.controller.ts`, `auth.service.ts`; `frontend/src/pages/LoginPage.tsx`, `RegisterPage.tsx` |
| JWT issuance & verification | `backend/src/utils/jwt.ts`, `middlewares/auth.middleware.ts` |
| Password hashing (bcrypt) | `backend/src/models/User.ts` (pre-save hash, `comparePassword`) |
| Protected routes (API) | `auth.middleware` on lead/user routes |
| Protected routes (UI) | `frontend/src/components/auth/ProtectedRoute.tsx`, router in `App.tsx` |
| Validation / error handling | Backend validators + centralized error middleware; frontend form validation (e.g. Zod/Yup as used in forms) |

## Leads (CRUD + fields)

| Requirement | Where |
|-------------|--------|
| Fields: name, email, status, source, timestamps | `backend/src/models/Lead.ts`, `frontend/src/types/index.ts` |
| Create / read / update / delete | `backend/src/controllers/lead.controller.ts`, `lead.service.ts`, `lead.routes.ts`; `frontend/src/api/leads.api.ts`, `LeadFormModal`, table actions |
| List + single lead view | `DashboardPage`, `LeadsTable`; `frontend/src/pages/LeadDetailsPage.tsx`, `GET /leads/:id` |

## Filtering & sorting

| Requirement | Where |
|-------------|--------|
| Filter by status + source | `FiltersBar`, `lead.service` query builder |
| Search (name/email), debounced | `SearchBar`, `useDebounce`, `DEBOUNCE_DELAY` in `constants` |
| Sort latest / oldest | `FiltersBar` / filters state; backend `sort` param |
| Filters compose | Query passes all active params together (`leadsApi.getLeads`, service `find` filter object) |

## Pagination

| Requirement | Where |
|-------------|--------|
| Backend pagination (10 per page) | `DEFAULT_PAGE_SIZE` / `limit: 10`, skip/limit in `lead.service`, `pagination` on API responses |
| Frontend pagination UI | `Pagination.tsx`, `DashboardPage` |

## UI / UX

| Requirement | Where |
|-------------|--------|
| Responsive layout | `DashboardLayout`, `Sidebar`, `TopNavbar`, dashboard panels, Tailwind breakpoints |
| Reusable components | `components/ui`, `components/dashboard`, `components/forms` |
| Loading / empty / error states | `LeadsTable`, `QueryErrorState`, skeletons in charts/panels |
| Form validation | Register/login/lead modals + shared patterns |
| **Charts (assignment “professional” polish)** | `DashboardCharts.tsx` (Recharts: status bar, source donut), stats from `GET /leads/stats` |
| **Pipeline coach (chat-style UX)** | `PipelineCoachChat.tsx` — client-side, context-aware tips from current stats/filters |
| **Recent / in-view leads** | `RecentLeadsPanel.tsx` — quick access to leads on the current page |

## API design

| Requirement | Where |
|-------------|--------|
| RESTful routes & status codes | `lead.routes.ts`, `auth.routes.ts`, controllers |
| Consistent response envelope | `ApiResponse` type, shared success/error shape |
| Centralized errors | Backend error middleware + typed errors where applicable |

## Mandatory extras

| Requirement | Where |
|-------------|--------|
| Debounced search | `useDebounce`, wired in `DashboardPage` |
| CSV export (admin) | `GET /leads/export/csv`, `useCsvExport`, admin-only button on dashboard |
| RBAC (admin vs sales) | `User.role`, route middleware (`requireRole`), UI gating for delete/export |
| Docker | Root `Dockerfile`, `frontend/Dockerfile`, `backend/Dockerfile`, `docker-compose` (if present) |

## Bonus

| Requirement | Where |
|-------------|--------|
| Dark mode | Theme toggle + Tailwind `dark` classes (e.g. layout, `index.css`) |

## Docs & submission helpers

| Item | Where |
|------|--------|
| README setup | `README.md` |
| Environment example | `.env.example` (root / backend as applicable) |
| API overview | `README.md` or dedicated docs file if listed there |

---

If anything drifts from the PDF wording, treat the **implemented behavior in the paths above** as the source of truth and update this file when the codebase changes.
