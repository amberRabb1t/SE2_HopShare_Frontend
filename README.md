# HopShare React Frontend

Intuitive, easy-to-use application that facilitates carpooling in an organized manner.

Leverages:
- Mockups & activity diagrams (primary visual + flow references)
- OpenAPI backend (HopShare API)
- User stories for interaction design

Images referenced: ![image1](image1) ![image2](image2) ![image3](image3) ![image4](image4)

## Features Implemented

Screens (more than 4 required):
1. Home Dashboard (navigation to core features)
2. My Cars (list, add, edit, delete)
3. My Routes (list, create, edit, delete)
4. My Requests (list, create, edit, delete)
5. Reviews (my reviews and reviews about a user)
6. User Profile (view profile + write review + file report)
7. Login / Session management
8. Create / Edit forms (embedded modals/panels)

State & Data:
- Global Auth Context (basic auth credentials stored in memory/localStorage)
- API service layer using Axios with automatic Basic Authorization header
- Optimistic UI updates for mock mode fallback
- Form validation using React Hook Form + Yup

Backend Endpoints Consumed (≥5):
- GET/POST/PUT/DELETE /users/:userID/cars
- GET/POST/PUT/DELETE /routes
- GET/POST/PUT/DELETE /requests
- GET/POST/PUT/DELETE /users/:userID/reviews
- GET/POST /reports
- GET /users
- GET /users/:userID
(Only mutating endpoints attach Basic Auth; read endpoints remain public)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit REACT_APP_API_BASE if your backend runs elsewhere.
```

3. Run development server:
```bash
npm start
```

4. Backend Requirements:
- Ensure HopShare API is running (provided earlier).
- If using mock (no Mongo), seeded demo credentials: `bob@example.com / password123` (regular user along with `charlie@example.com / password123`)
- Input `alice@example.com / password123` for admin privileges

## Authentication

Basic Auth is applied automatically for POST/PUT/DELETE when `REACT_APP_BASIC_AUTH_ENABLED=true`.
Login stores `email` + `password` in memory & localStorage (password only if user opts in "remember").

## Project Structure

```
public/
src/
  api/          # Axios instances & resource functions
  components/   # Reusable UI atoms/molecules
  context/      # Global providers (Auth / Toast)
  hooks/        # Custom hooks
  pages/        # Screen components (mapped to routes)
  router/       # Route definitions & protected route wrapper
  styles/       # CSS modules / global styles / variables
  utils/        # Helpers, validators, constants
  App.js
  index.js
  index.css
```

## Design System

- Colors from mockups: Light Blue (#7fa9ff) background, Peach (#ffb29e) panels, Dark accents (#283044).
- Responsive using flex/grid & fluid typography.
- Mobile-first (mockups) but scales to wider screens.

## Forms & Validation

Implemented with React Hook Form + Yup:
- Car form (Seats, ServiceDate, MakeModel, LicensePlate)
- Route form (Start, End, Stops, DateAndTime, OccupiedSeats)
- Request form (Start, End, DateAndTime, optional Description)
- Review form (Rating, UserType (Driver/Passenger), Description)
- Report form (Description)

Mandatory fields enforced according to OpenAPI required arrays.

## Error Handling & UX

- Axios interceptor normalizes backend `{ success, data, error, message }` shape
- Toast system shows success/error messages
- Loading & empty states for lists
- Confirmation dialogs for destructive actions (delete)

## Scripts

- `npm start` - Dev server
- `npm build` - Production build
- `npm test` - Jest/RTL tests (basic scaffolding)
- `npm lint` - ESLint
- `npm format` - Prettier

## Extensibility

Add new resource:
1. Create `api/<resource>.js`
2. Optional type definitions in `utils/types.js`
3. Add page & route
4. Leverage existing form & layout components

## Security Notes

- Basic Auth credentials stored in memory; optional local persistence.
- For production consider OAuth/JWT and secure secret storage.
- Avoid logging sensitive information.

## Accessibility

- Semantic HTML (buttons, labels, aria-live for toasts)
- Focus states and keyboard navigation for modals/forms
- Color contrast chosen for readability

## Testing (Sample)

```bash
npm test
```

Basic tests ensure:
- AuthContext stores credentials
- API client attaches headers for protected methods
- Car list renders fetched data

## License

MIT
