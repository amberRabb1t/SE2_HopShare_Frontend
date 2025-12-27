# User Flows Mapping

Manage Car:
- My Cars page lists cars.
- Add Car modal -> validate -> POST /users/{userID}/cars -> success toast -> refresh in local state.
- Edit Car -> PUT /users/{userID}/cars/{carID}
- Delete Car -> Confirm -> DELETE.

Manage Route:
- My Routes page lists routes (GET /routes).
- Create Route modal -> POST /routes.
- Edit Route -> PUT /routes/{id}.
- Delete -> DELETE /routes/{id}.

Manage Request:
- My Requests page lists requests (GET /requests).
- Create/Edit/Delete analogous to routes.

Manage Reviews:
- Reviews page lists about-me (GET with myReviews=false) and my reviews (myReviews=true).
- Write Review -> POST.
- Edit -> PUT.
- Delete -> DELETE.

Report User:
- User Profile page -> File Report modal -> POST /reports.

All flows display feedback (toast) aligned with activity diagrams decision nodes (success vs missing mandatory info).

