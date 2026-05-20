# GigFlow Smart Leads Dashboard — API Reference

Base URL (local): `http://localhost:5000/api`

All protected routes require header: `Authorization: Bearer <token>`

## Response format

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {},
  "pagination": {}
}
```

Errors return appropriate HTTP status with `{ "success": false, "message": "..." }`.

---

## Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register (name, email, password, role?) |
| POST | `/auth/login` | No | Login (email, password) |
| POST | `/auth/google` | No | Google OAuth (credential, role?) |
| GET | `/auth/me` | Yes | Current user |
| PATCH | `/auth/profile` | Yes | Update profile |
| PATCH | `/auth/password` | Yes | Change password (local accounts) |

### PATCH `/auth/profile`

Body: `name`, `email`, `phone?`, `jobTitle?`, `company?`, `location?`, `bio?`

### PATCH `/auth/password`

Body: `currentPassword`, `newPassword`, `confirmPassword`

---

## Leads

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/leads` | Yes | All | List (paginated, filterable) |
| GET | `/leads/stats` | Yes | All | Aggregate stats |
| GET | `/leads/export/csv` | Yes | Admin | CSV export |
| GET | `/leads/:id` | Yes | All | Single lead |
| POST | `/leads` | Yes | All | Create lead |
| PUT | `/leads/:id` | Yes | All | Update lead |
| DELETE | `/leads/:id` | Yes | Admin | Delete lead |

### GET `/leads` query params

| Param | Values | Default |
|-------|--------|---------|
| page | number | 1 |
| limit | number (max 100) | 10 |
| status | new, contacted, qualified, lost | — |
| source | website, instagram, referral | — |
| search | string (name/email) | — |
| sort | latest, oldest | latest |

Filters compose (e.g. `?status=qualified&source=instagram&search=rahul&sort=latest&page=1`).

### Pagination metadata

```json
{
  "currentPage": 1,
  "totalPages": 5,
  "totalRecords": 42,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

---

## Postman

Import: `api-docs/gigflow-smart-leads-dashboard.postman_collection.json`
