# Backend & API Foundations

A simple, high-level guide to how APIs work, how backend services communicate, and how we keep them secure and reliable.

## 1. What Problem Does an API Solve?

**Problem:** Different programs need to exchange data and request work from each other.

**Solution:** An API (Application Programming Interface) defines how one program can communicate with another.

An API contract explains:
- What endpoint or method is available.
- What request data is expected.
- What response data will be returned.
- What authentication, permissions, and errors apply.

```text
Client  --->  API  --->  Application / Data
        request       response
```

## 2. Full API Request–Response Lifecycle

**Problem:** A request must travel from the browser to the correct backend code, reach the required data, and return a response.

**Solution:** The request passes through several layers. Not every application uses every layer.

### Request path

1. **User action:** The user clicks a button or submits a form.
2. **Frontend:** JavaScript uses `fetch()` or Axios to create an HTTP request.
3. **Browser checks:** The browser applies security rules such as CSP and CORS. Some cross-origin requests need an `OPTIONS` preflight request.
4. **DNS:** Finds the IP address for the domain.
5. **TCP:** Establishes a network connection (for HTTP/1.1 or HTTP/2 over TCP).
6. **TLS / HTTPS:** Verifies the server certificate and encrypts communication.
7. **CDN / WAF (optional):** May serve cached content or block suspicious traffic.
8. **Load balancer (optional):** Distributes requests across application servers.
9. **Reverse proxy / API Gateway (optional):** Receives and forwards requests; may handle routing, TLS, authentication, and rate limits.
10. **Application server:** Runs backend code.
11. **Route:** Matches the HTTP method and URL to a handler.
12. **Middleware:** Runs shared checks such as logging, CORS, authentication, and rate limiting.
13. **Controller:** Handles HTTP input and coordinates the response.
14. **Service:** Runs business rules.
15. **Repository / ORM:** Reads or writes data in the database.
16. **Database / Cache:** Returns the required data.

### Response path

1. The service returns data to the controller.
2. The backend creates a response with a status code, headers, and body (often JSON).
3. The response travels back through the proxy / gateway and network.
4. `fetch()` receives the response; `response.json()` parses a JSON body.
5. The frontend updates its state and renders the new UI.

```text
Browser -> DNS -> TCP -> TLS -> Edge / Proxy -> App
                                             -> Middleware
                                             -> Route
                                             -> Controller
                                             -> Service
                                             -> Repository -> Database

Browser <- Response <- Proxy / Network <- App <- Data
```

**Remember:** The API is the interface/contract. The request is the message sent through it. The backend processes it and returns a response.

## 3. Backend Architecture

**Problem:** One application may need to handle many requests, store data, and perform slow tasks.

**Solution:** Split responsibilities into components.

```text
Clients
   |
Load Balancer / API Gateway
   |
Application Servers
   |             \
Database + Cache  Queue -> Workers
```

Inside an application server:

| Layer | Main job |
|---|---|
| Route | Maps URL + method to code |
| Middleware | Shared checks before/after a handler |
| Controller | Handles HTTP request and response |
| Service | Contains business logic |
| Repository / ORM | Communicates with the database |

- **Load balancer:** Spreads traffic across servers.
- **API Gateway:** A common entry point for routing and policies.
- **Monolith:** One codebase/deployment; simpler to start with.
- **Microservices:** Multiple services with separate responsibilities; more independent scaling but more complexity.
- **Serverless:** Functions run on demand in a managed environment.

## 4. REST, GraphQL, and gRPC

**Problem:** Different applications have different needs for requesting data and communicating.

**Solution:** Choose an API approach that fits the use case.

### REST

REST is an architectural style based on resources and HTTP methods.

- A **resource** is data the API exposes, such as users, orders, or products. It may map to a database table, but it is not necessarily the same thing.
- Use nouns in URLs; use HTTP methods for actions.
- Commonly sends JSON over HTTP.
- Stateless: each request carries the information needed to process it.

```http
GET    /users/42
GET    /users/42/orders
POST   /orders
PATCH  /users/42
DELETE /users/42
```

| Method | Common purpose |
|---|---|
| GET | Read |
| POST | Create or perform an action |
| PUT | Replace a resource |
| PATCH | Update part of a resource |
| DELETE | Remove |

### GraphQL

**Problem:** REST may return more fields than a screen needs (over-fetching), or require several requests to build one screen (under-fetching).

**Solution:** GraphQL lets the client ask for the exact fields it needs, usually through one endpoint such as `POST /graphql`.

- Schema defines available types and fields.
- Query reads data.
- Mutation changes data.
- Subscription supports real-time updates.
- Watch for expensive queries and N+1 database queries.

### gRPC

**Problem:** Backend services need efficient, typed communication, often across different programming languages.

**Solution:** gRPC lets one service call a method on another service using HTTP/2 and Protocol Buffers.

- `.proto` file defines the service, RPC methods, and message structures (the contract).
- `protoc` generates client and server code (stubs).
- Protobuf serializes messages into a compact binary format.
- gRPC supports unary and streaming calls.
- It is commonly used between backend services. Browser clients usually need gRPC-Web and a suitable proxy.

Example contract:

```protobuf
syntax = "proto3";

service UserService {
  rpc GetUser (GetUserRequest) returns (User);
}

message GetUserRequest {
  int32 id = 1;
}

message User {
  int32 id = 1;
  string name = 2;
}
```

### Quick comparison

| Approach | What it is | Contract / schema | Common use |
|---|---|---|---|
| REST | Architectural style | OpenAPI is commonly used (optional) | Public APIs, CRUD |
| GraphQL | Query language + runtime | GraphQL schema (SDL) | Flexible data for different clients |
| gRPC | RPC framework | `.proto` file | Internal service-to-service calls, streaming |

## 5. API Contracts: OpenAPI, GraphQL Schema, and `.proto`

**Problem:** Frontend and backend developers may disagree about endpoints, fields, or response formats.

**Solution:** Define a shared contract so both sides know what to build.

- **OpenAPI:** YAML/JSON description of a REST API: paths, methods, parameters, request/response schemas, and errors.
- **GraphQL SDL:** Defines GraphQL types, queries, mutations, and fields.
- **`.proto`:** Defines gRPC services, methods, and messages.
- **AsyncAPI:** Describes event-driven APIs and message channels.

Contract-first workflow:

1. Write the contract.
2. Review it with API consumers.
3. Generate docs, mocks, types, or tests where possible.
4. Implement the API.

OpenAPI is API documentation/contract, not the whole project plan or the API implementation itself.

## 6. Middleware

**Problem:** Every route may need common work such as logging, authentication, or rate limiting.

**Solution:** Use middleware functions in a request pipeline.

Common middleware:
- Request logging and request ID.
- CORS handling.
- Authentication.
- Rate limiting.
- Body parsing and validation.
- Error handling.

Middleware can continue to the next layer, change the request/response, or stop the request with an error. Order matters: authenticate before checking permissions; rate-limit before expensive work.

## 7. Authentication vs Authorization

**Problem:** The server must know who is making a request and whether that person can perform the requested action.

**Solution:** Use two separate checks.

- **Authentication (AuthN):** Who are you? Verifies identity. Failure commonly returns `401`.
- **Authorization (AuthZ):** What are you allowed to do? Checks permissions. Failure commonly returns `403`.

Common authorization models:
- **RBAC:** Permissions are based on roles (admin, editor, viewer).
- **ABAC:** Permissions are based on attributes and rules.
- **Ownership:** A user can access their own resource, not another user's resource.

Always enforce permissions on the server. Hiding a button in the frontend is not security.

## 8. Session Cookies, JWT, Access Tokens, and Refresh Tokens

### Session-based authentication

**Problem:** The server needs to remember a logged-in user across requests.

**Solution:** The server stores session data and sends the browser a session ID in a cookie.

1. User logs in.
2. Server creates a session and stores its data.
3. Server sends a cookie containing the session ID.
4. Browser automatically sends the cookie on matching requests.
5. Server uses the ID to find the session.

### JWT-based authentication

**Problem:** Services need a token that can carry signed claims and be verified without looking up a server-side session for every request.

**Solution:** The server creates and signs a JWT. The client stores it and sends it with protected API requests. The server verifies the signature and claims.

A JWT is usually signed, not encrypted. Its payload can be decoded, so do not put secrets in it.

### Access and refresh tokens

- **Access token:** Short-lived; sent with protected API requests.
- **Refresh token:** Longer-lived; sent only to the authorization server to obtain new tokens.

Typical flow:

1. User logs in; server issues access and refresh tokens.
2. Client sends the access token with API requests.
3. If the access token expires, the API may return `401`.
4. Client sends the refresh token to the token endpoint.
5. Server validates it and issues a new access token (often rotates the refresh token too).
6. Client retries the original API request.

A `401`-then-refresh flow is common, but an app can refresh proactively too.

### Cookie vs token

- A **cookie** is a browser storage/transport mechanism.
- A **session ID** or **token** is a value that may be stored in a cookie.
- In a common browser setup, a refresh token is stored in an `HttpOnly; Secure; SameSite` cookie. Access-token storage depends on the app's design; memory is one option.

## 9. OAuth 2.0 and Google Login (OIDC)

### What problem does OAuth solve?

**Problem:** An app needs limited access to a user's data, but the user should not give that app their Google password.

**Solution:** OAuth 2.0 lets the user grant limited access using tokens and scopes.

Main roles:
- **Resource Owner:** The user who owns the data.
- **Client:** The app requesting access.
- **Authorization Server:** Google; handles authorization and issues tokens.
- **Resource Server:** The API that holds the data, such as Google Drive API.

OAuth is for delegated authorization. **OpenID Connect (OIDC)** adds user identity/login on top of OAuth 2.0.

### Google Authorization Code + PKCE flow

1. Register the app with Google and configure its redirect URI and requested scopes.
2. User clicks **Sign in with Google** or **Connect Google**.
3. App creates a random `state` and a PKCE `code_verifier`; it stores them safely. It creates a `code_challenge` from the verifier.
4. Browser is redirected to Google's authorization page with `client_id`, `redirect_uri`, `scope`, `state`, and `code_challenge`.
5. User signs in to Google (if needed) and approves the requested permissions.
6. Google redirects the browser back to the app with a one-time authorization `code` and the `state`.
7. App checks that returned `state` matches the saved value.
8. App backend sends the code and `code_verifier` to Google's token endpoint. A confidential server-side app also authenticates with its client credentials. The secret must not be exposed in frontend code.
9. Google returns tokens. The access token is used for Google APIs. If OIDC was requested (for example, `openid email profile`), Google also returns an ID token.
10. App verifies the ID token signature and claims (`iss`, `aud`, `exp`). It identifies the user by the stable `sub` claim.
11. If Google API access is needed, the app sends the access token to that API.
12. Your app creates its own login session (or its own app token) and sends its own session cookie to the browser. Google tokens can remain on the server in a server-side design.

Important:
- `state` protects the callback flow against CSRF.
- PKCE helps stop a stolen authorization code from being used by someone who does not have the verifier.
- **ID token:** tells the app who the user is; do not send it to an API as an access token.
- **Access token:** grants access to the API and requested scopes.

## 10. Rate Limiting and Token Bucket

**Problem:** Too many requests can overload the API, enable brute-force attacks, or increase service costs.

**Solution:** Rate limiting restricts how many requests a client can make in a time period.

Common algorithms:
- **Fixed window:** A counter resets after each time window.
- **Sliding window:** Counts requests over a rolling time period.
- **Token bucket:** A bucket holds request credits (tokens). Each request uses one credit; credits refill over time up to a maximum capacity.

Here, a token is a request credit, **not** a JWT or authentication token.

When the limit is reached, return `429 Too Many Requests`, often with a `Retry-After` header. Redis can store shared counters when multiple app servers are running.

## 11. Queue and Worker

**Problem:** Some tasks are slow (sending email, generating reports, resizing images). If the API waits for them, the user waits too.

**Solution:** Put the task in a queue and let a background worker process it.

- **Queue:** Holds jobs waiting to be processed.
- **Worker:** A separate background program/process that takes jobs from the queue and executes them. A worker is not a person.

Example: after an order is saved, the API adds an email job to the queue and returns a response. A worker later takes the job and sends the email.

```text
User -> API -> Save order -> Add email job -> Return response
                              |
                              v
                         Job Queue -> Worker -> Send email
```

Queues improve response time for the user; they do not make the background work disappear. Jobs still need retries, monitoring, and failure handling.

## 12. Idempotency

**Problem:** A network timeout may cause a client to retry a request even though the server already completed it. For a payment, this could charge the user twice.

**Solution:** Use an idempotency key for operations that must not run twice.

1. Client creates a unique key for one action.
2. Client sends it with the request.
3. Server stores the key and the result.
4. If the same key is received again, the server returns the saved result instead of repeating the operation.
5. Reusing the same key with a different request body should be rejected.

```http
POST /payments
Idempotency-Key: 7c1e9a52-2f0b-4d1e-9c4a
```

**Idempotency means repeated requests have the same final effect as one request.** It is especially important for payments, orders, and retryable jobs.


## 14. API Versioning and Breaking Changes

**Problem:** Existing clients may stop working if an API changes in an incompatible way.

**Solution:** Make compatible changes when possible; create a new major version for breaking changes.

- Usually safe: add a new endpoint, add an optional request field, or add a response field.
- Breaking: remove/rename a field, change its type, make an optional field required, or change authentication/error behavior.
- Common versioning: `/api/v1/orders`, `/api/v2/orders`.
- Deprecate old versions with notice, documentation, usage monitoring, and a sunset date.
