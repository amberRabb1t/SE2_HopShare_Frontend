# HopShare Frontend Architecture

Images referenced: ![image1](image1) ![image2](image2) ![image3](image3) ![image4](image4)

Layers:
1. Pages: Map to routes, orchestrate data fetching and composition.
2. Components: Presentational or small state (Modal, RatingStars, Confirm, NavBar).
3. API: Axios wrappers aligning with backend OpenAPI spec.
4. Context: Cross-cutting concerns (Auth, Toast).
5. Hooks: Reusable logic primitives (useAsync, useModal).
6. Utils: Formatting, validation schemas, constants.

Error Flow:
- Axios error -> intercepted -> thrown -> caught by page -> toast push.

Authentication:
- Basic Auth only added for mutating requests.
- Stored credentials accessible via `getAuth()` helper for interceptors.

Extending:
- Add new endpoint by creating `api/<entity>.js`.
- Add form validation schema.
- Create page component + route definition.

Testing:
- Focus on context and interceptor behaviors.

