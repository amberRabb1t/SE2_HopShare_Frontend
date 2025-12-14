# Cypress E2E (Simplified Format)

These tests:
- Use direct `cy.visit`, `cy.contains`, `cy.get` (no custom commands).
- Do NOT stub the backend (no `cy.intercept`). They hit your running HopShare API.
- Cover 3 user flows across 4+ screens with 2 happy paths and 1 unhappy path.

Before running:
1. Start backend (ensure REACT_APP_API_BASE points to it).
2. Start frontend on baseUrl (default http://localhost:3001).
3. Ensure a valid user exists (e.g., alice@example.com / password123) for Basic Auth.

Run:
- Interactive: `npm run cypress:open`
- Headless: `npm run test:e2e`

