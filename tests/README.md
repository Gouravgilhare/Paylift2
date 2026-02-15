# Paylift API Testing Guide

This project contains automated and manual tests for the Paylift backend API. The tests cover authentication, user management, rider and vehicle management, trips, location tracking, vehicle pricing, maps, and admin dashboards.

---

## Table of Contents

- [Installation](#installation)
- [Running Tests](#running-tests)
  - [Automated Tests (Jest)](#automated-tests-jest)
  - [Manual Testing (Postman)](#manual-testing-postman)

- [Test Structure](#test-structure)
- [Expected Status Codes](#expected-status-codes)
- [Test Coverage Diagram](#test-coverage-diagram)
- [Notes](#notes)

---

## Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd <repo-directory>
```

2. Install dependencies:

```bash
npm ci
```

3. Configure environment variables:

```bash
cp .env.example .env
# Update .env with your server config
```

---

## Running Tests

### Automated Tests (Jest)

Run all tests:

```bash
npm test
```

Watch mode (re-run on changes):

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

---

### Manual Testing (Postman)

1. Import `postman-collection.json` into Postman.
2. Set environment variable:

```
baseUrl = http://localhost:6000
```

3. Run requests sequentially:
   - Start with **Auth** endpoints (OTP flow).
   - Continue with **User**, **Rider**, **Vehicle**, **Trip**, **Location**, **Vehicle Pricing**, **Maps**, and **Admin** endpoints.

---

## Test Structure

### 🔐 Auth Routes

- **User:** `/api/auth/send-otp`, `/api/auth/verify-otp`, `/api/auth/refresh-token`, `/api/auth/logout`
- **Admin:** `/api/auth/admin/send-otp`, `/api/auth/admin/verify-otp`, `/api/auth/admin/refresh-token`, `/api/auth/admin/logout`

### 👤 User Routes

- CRUD operations: `/api/user/register`, `/api/user/update/:userid`, `/api/user/:userid`

### 🏍️ Rider Routes

- Manage riders: `/api/rider/register`, `/api/rider/update/:riderid`, `/api/rider/:riderid`, `/api/rider/user/:userid`

### 🚗 Vehicle Routes

- Manage vehicles: `/api/vehicle/register`, `/api/vehicle/update/:vehicleId`, `/api/vehicle/:vehicleId`, `/api/vehicle/rider/:riderId`

### 🛣️ Trip Routes

- Trip management: `/api/trip/register`, `/api/trip/:tripId`, `/api/trip/assign/:tripId`, `/api/trip/start/:tripId`, `/api/trip/update/:tripId`, `/api/trip/complete/:tripId`, `/api/trip/cancel/:tripId`

### 📍 Location Routes

- Live & history tracking: `/api/location/live/update`, `/api/location/live/:entity_type/:entity_id`, `/api/location/history/add`, `/api/location/history/:trip_id`

### 📄 Extract Routes

- Placeholder tests: `/api/extract/insurance`, `/api/extract/rc-card`, `/api/extract/number-plate`, `/api/extract/driving-license`

### 💰 Vehicle Pricing Routes

- Manage pricing: `/api/vehicles/pricing/create`, `/api/vehicles/pricing/all`, `/api/vehicles/pricing/id/:id`, `/api/vehicles/pricing/category/:category`, `/api/vehicles/pricing/update/id/:id`, `/api/vehicles/pricing/update/category/:category`, `/api/vehicles/pricing/stats`, `/api/vehicles/pricing/delete/:id`

### 🗺️ Maps Routes

- Routing & places: `/api/maps/route`, `/api/maps/distance-matrix`, `/api/maps/places/autocomplete`, `/api/maps/places/details`

### 👑 Admin Routes

- Dashboard & analytics: `/api/admin/users`, `/api/admin/riders`, `/api/admin/vehicles`, `/api/admin/trips`, `/api/admin/dashboard`

---

## Expected Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Server Error

---

## Test Coverage Diagram

```
                          ┌───────────────┐
                          │   AUTH        │
                          │ (User/Admin)  │
                          └───────┬───────┘
                                  │
          ┌───────────────────────┴───────────────────────┐
          │                                               │
  ┌───────▼───────┐                               ┌───────▼───────┐
  │ USER MODULE   │                               │ ADMIN MODULE  │
  │ (CRUD)        │                               │ (Dashboard &  │
  │ /user/*       │                               │ analytics)    │
  └───────┬───────┘                               └───────────────┘
          │
          │
  ┌───────▼────────┐
  │ RIDER MODULE   │
  │ /rider/*       │
  └───────┬────────┘
          │
  ┌───────▼────────┐
  │ VEHICLE MODULE │
  │ /vehicle/*     │
  └───────┬────────┘
          │
  ┌───────▼────────┐
  │ TRIP MODULE    │
  │ /trip/*        │
  └───────┬────────┘
          │
  ┌───────▼────────┐
  │ LOCATION MODULE│
  │ /location/*    │
  └───────┬────────┘
          │
  ┌───────▼────────┐
  │ VEHICLE PRICING│
  │ /vehicles/pricing/* │
  └───────┬────────┘
          │
  ┌───────▼────────┐
  │ MAPS MODULE    │
  │ /maps/*        │
  └───────────────┘
```

### How to Read the Diagram

- **AUTH** is required for all protected routes.
- **USER** feeds into **RIDER** (a rider must be a registered user).
- **RIDER** feeds into **VEHICLE** (vehicles belong to riders).
- **TRIP** depends on **USER**, **RIDER**, and **VEHICLE**.
- **LOCATION** tracks live trips and history.
- **VEHICLE PRICING** and **MAPS MODULE** are independent but used by TRIP.
- **ADMIN MODULE** can access data across all modules.

---

## Notes

- All protected routes require `Authorization: Bearer <token>` header.
- Test data uses mock OTP: `1234`.
- Adjust `baseUrl` for your server environment.
- Some extract routes are skipped due to missing fixtures.
- Admin token is separate from user token and must be used for admin routes.
