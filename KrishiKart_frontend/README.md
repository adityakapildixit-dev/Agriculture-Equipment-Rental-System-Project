# KrishiKart — Frontend

React + Tailwind CSS frontend for the **Agriculture Equipment Rental System** backend
(ASP.NET Core, unchanged). Covers every entity exposed by the API — Farmers, Owners,
Machinery, Bookings, Payments, Maintenance and Invoices — behind a role-based login
(Admin / Owner / Farmer).

## 1. Run the backend first

From the backend project folder:

```bash
dotnet run
```

By default it listens on `http://localhost:5194` (see `Properties/launchSettings.json`).
Leave it running.

> The backend's `Program.cs` has **not** been modified — no CORS middleware was added.
> Instead, the Vite dev server proxies `/api/*` requests straight to
> `http://localhost:5194`, so the browser only ever talks to one origin. See
> `vite.config.js` if your backend runs on a different port.

## 2. Run the frontend

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

## 3. Log in

There's no seed data — register your first account from the **Register** page and pick
a role (`Admin`, `Owner`, or `Farmer` — these are the exact three values
`AuthController` accepts). Login returns a JWT which is stored in `localStorage` and
attached to every API call automatically.

## Role-based access

| Section | Admin | Owner | Farmer |
|---|---|---|---|
| Dashboard | ✅ | ✅ | ✅ |
| Machinery | full CRUD | full CRUD | view only |
| Bookings | full CRUD | view + update | create + view |
| Payments | full CRUD | view | create + view |
| Invoices | full CRUD | view | view |
| Maintenance | full CRUD | full CRUD | — |
| Farmers | full CRUD | view | — |
| Owners | full CRUD | view | — |

This matrix lives in `src/utils/permissions.js` and only controls what the **UI**
shows. The API itself only enforces one role check today — `DELETE /api/Owners/{id}`
requires `Admin` — everything else is just `[Authorize]` (any logged-in user). If you
want the same restrictions enforced server-side, add matching
`[Authorize(Roles = "...")]` attributes to the other controllers.

## Project structure

```
src/
  api/            axios instance + one thin wrapper per backend controller
  context/        AuthContext (login/register/logout, JWT storage)
  components/     Layout, Sidebar, Navbar, DataTable, Modal, form fields, icons…
  pages/          Login, Register, Dashboard, and one CRUD page per entity
  utils/          role-based permissions matrix
```

## Notes on how it maps to the backend

- Route paths follow each controller's actual `[Route]`, which is based on the
  **class name**, not the file name — e.g. `MachineriesController.cs` contains a class
  called `MachineryController`, so the frontend calls `/api/Machinery`.
- `Payments` posts/puts the raw `Payment` model shape (the backend has no
  Payment DTOs), matching `PaymentsController`.
- Dates are sent as `yyyy-MM-dd` (native `<input type="date">` format), matching the
  backend's `DateOnly` fields.
