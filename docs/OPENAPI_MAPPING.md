# OpenAPI Endpoint Coverage

Images referenced: ![image1](image1) ![image2](image2) ![image3](image3) ![image4](image4)

Covered Endpoints:
- Routes: GET /routes, POST /routes, PUT /routes/:routeID, DELETE /routes/:routeID
- Requests: GET /requests, POST /requests, PUT /requests/:requestID, DELETE /requests/:requestID
- Cars: GET /users/:userID/cars, POST /users/:userID/cars, PUT /users/:userID/cars/:carID, DELETE ...
- Reviews: GET /users/:userID/reviews, POST /users/:userID/reviews, PUT /users/:userID/reviews/:reviewID, DELETE ...
- Reports: GET /reports, POST /reports
- Users: GET /users/:userID (profile view)

Basic Auth applied to mutating endpoints via Axios request interceptor.

Schema Alignment:
- Form fields correspond to required properties from OpenAPI `components.schemas`.
- Optional properties (Comment, Description) allowed to be empty.

Fallback Behavior:
- If backend uses mock data (no Mongo), operations still succeed for demo flows.

Future Additions:
- Conversations & Messages (not implemented here) can reuse pattern with nested resource path segments.

