# RentNest Frontend — API Integration

This document maps every frontend route and server action to the backend API endpoints
it consumes. It reflects the actual implementation in this repository.

## Base URL

All API calls are prefixed with the `NEXT_PUBLIC_BACKEND_API_URL` environment variable
(e.g. `https://rent-nest-ashy.vercel.app`).

## Authentication

- After a successful login, the frontend stores `accessToken` and `refreshToken` as
  **httpOnly cookies** (`maxAge`: 1 day / 7 days).
- Protected server actions read `accessToken` from the cookie store and forward it to
  the backend as a `Cookie: accessToken=<token>` header.
- When an authenticated call returns `statusCode: 401`, the frontend calls
  `POST /api/auth/refresh` (using the `refreshToken` cookie) and retries the request
  once with the fresh token (`service/getMe.ts`, `service/refresh.ts`,
  `app/(publicGroup)/_actions/rentalActions.ts`).

---

## Route → Backend API Mapping

| Frontend Route | Page / Feature | Backend API Consumption |
|----------------|----------------|-------------------------|
| `/` | Home page with featured properties | `GET /api/properties` |
| `/rentals` | Browse & filter properties | `GET /api/properties` (query params), `GET /api/categories` |
| `/rentals/[id]` | Property details & "Request to Rent" CTA | `GET /api/properties/:id`, `GET /api/reviews/property/:id`, `GET /api/auth/me` |
| `/login` | Login form | `GET /api/auth/login` (JSON body) |
| `/register` | Role selection & registration form | `POST /api/auth/register` |
| `/dashboard` | Tenant overview, request history & payments | `GET /api/auth/me`, `GET /api/rentals`, `GET /api/payments` |
| `/dashboard/profile` | Profile page | `GET /api/auth/me` |
| `/landlord-dashboard` | Landlord overview, property list & incoming requests | `GET /api/auth/me`, `GET /api/landlord/properties`, `GET /api/landlord/requests`, `GET /api/categories`, `GET /api/reviews/property/:id` |
| `/admin-dashboard` | Admin overview, user management & moderation | `GET /api/auth/me`, `GET /api/admin/users`, `PATCH /api/admin/users/:id`, `GET /api/admin/properties`, `GET /api/admin/rentals`, `POST /api/admin/create-category` |
| `/payment` | Payment outcome UI (`?success=true|false`) | Frontend-only (driven by URL params; no backend call) |

---

## Backend Endpoint Reference

### Auth
| Method | Path | Used By | Description |
|--------|------|---------|-------------|
| POST | `/api/auth/register` | `registerAction` | Register a new user (`name`, `email`, `password`, `role`) |
| GET | `/api/auth/login` | `loginAction` | Login. **The frontend sends a JSON body via a GET request** (`getWithBody` helper) and receives `{ accessToken, refreshToken }` |
| POST | `/api/auth/refresh` | `refreshAccessToken` | Exchange the `refreshToken` cookie for a fresh token pair |
| GET | `/api/auth/me` | `getMe` | Fetch the current authenticated user |

### Properties (public)
| Method | Path | Used By | Description |
|--------|------|---------|-------------|
| GET | `/api/properties` | `getProperties` | List properties with filters: `searchTerm`, `title`, `price`, `maxPrice`, `location`, `categoryName`, `sortBy`, `sortOrder` |
| GET | `/api/properties/:id` | `getPropertyById` | Fetch a single property |

### Categories
| Method | Path | Used By | Description |
|--------|------|---------|-------------|
| GET | `/api/categories` | `getCategories` | List property categories for filters/forms |

### Rental Requests
| Method | Path | Used By | Description |
|--------|------|---------|-------------|
| POST | `/api/rentals` | `createRentalRequest` | Submit a rental request for a property (`{ propertyId }`). Retries once on 401 via token refresh |
| GET | `/api/rentals` | `getRentalRequests` | List the current user's rental requests |
| GET | `/api/rentals/:id` | `getRentalRequestDetails` | Fetch a single rental request |

### Reviews
| Method | Path | Used By | Description |
|--------|------|---------|-------------|
| POST | `/api/reviews/:rentalRequestId` | `createReview` | Submit a review for a completed rental (`{ rating, comment }`) |
| GET | `/api/reviews/property/:id` | `getPropertyReviews` | List reviews for a property |

### Landlord
| Method | Path | Used By | Description |
|--------|------|---------|-------------|
| GET | `/api/landlord/properties` | `getLandlordProperties` | List the landlord's own properties |
| POST | `/api/landlord/properties` | `createLandlordProperty` | Create a property (includes `imageUrl`) |
| PUT | `/api/landlord/properties/:id` | `updateLandlordProperty` | Update a property |
| DELETE | `/api/landlord/properties/:id` | `deleteLandlordProperty` | Delete a property |
| GET | `/api/landlord/requests` | `getLandlordRequests` | List incoming rental requests |
| PATCH | `/api/landlord/requests/:id` | `updateRequestStatus` | Approve/reject a request (`{ status }`) |

### Admin
| Method | Path | Used By | Description |
|--------|------|---------|-------------|
| GET | `/api/admin/users` | `getAdminUsers` | List users (`searchTerm`, `page`, `limit`), returns `{ users, meta }` |
| PATCH | `/api/admin/users/:id` | `updateUserStatus` | Ban/unban a user (`{ status }`) |
| GET | `/api/admin/properties` | `getAllProperties` | List all properties for moderation |
| GET | `/api/admin/rentals` | `getAllRentalRequests` | List all rental requests for moderation |
| POST | `/api/admin/create-category` | `createCategory` | Create a new category (`{ name }`) |

> **Note:** Payment endpoints (`GET /api/payments`, `POST /api/payments/create/:id`)
> are implemented in the frontend code (`app/(dashboardGroup)/_actions/paymentActions.ts`)
> but are excluded from this document's primary mapping by design.

---

## Data Revalidation

After mutating actions, the frontend calls `revalidateTag(tag, "max")` so dashboards
and lists refresh on the next render:

- `landlord-properties` — after create/update/delete property
- `landlord-requests` — after approve/reject
- `admin-users` — after ban/unban
- `categories` — after category creation
- `rental-requests` — after submitting a rental request
