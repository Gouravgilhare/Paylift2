# PayLift Backend API

## Project Overview

PayLift is a ride-hailing backend server built with **Node.js**, **Express**, and **MySQL**. The system supports **users, riders, vehicles, trips, and live location tracking**. It also integrates **Redis for caching**, **JWT for authentication**, and **Mappls for maps & location services**.

---

## Folder Structure

```
paylift-backend/
│
├─ config/                     # App configurations
│   ├─ bcrypt.config.js
│   ├─ db.config.js
│   ├─ env.config.js
│   ├─ multer.config.js
│   ├─ redisClient.js
│
├─ modules/                    # Feature-based modules
│   ├─ auth/
│   │   ├─ controllers/
│   │   │   └─ auth.controller.js
│   │   ├─ services/
│   │   │   └─ auth.service.js
│   │   ├─ routes/
│   │   │   └─ auth.routes.js
│   │   └─ middleware/
│   │       └─ auth.middleware.js
│   │
│   ├─ user/
│   │   ├─ controllers/
│   │   │   └─ user.controller.js
│   │   ├─ services/
│   │   │   └─ user.service.js
│   │   ├─ models/
│   │   │   └─ user.model.js
│   │   └─ routes/
│   │       └─ user.routes.js
│   │
│   ├─ rider/
│   │   ├─ controllers/
│   │   │   └─ rider.controller.js
│   │   ├─ services/
│   │   │   └─ rider.service.js
│   │   ├─ models/
│   │   │   └─ rider.model.js
│   │   └─ routes/
│   │       └─ rider.routes.js
│   │
│   ├─ vehicle/
│   │   ├─ controllers/
│   │   │   └─ vehicle.controller.js
│   │   ├─ services/
│   │   │   └─ vehicle.service.js
│   │   ├─ models/
│   │   │   └─ vehicle.model.js
│   │   └─ routes/
│   │       └─ vehicle.routes.js
│   │
│   ├─ trips/
│   │   ├─ controllers/
│   │   │   └─ trip.controller.js
│   │   ├─ services/
│   │   │   └─ trip.service.js
│   │   ├─ models/
│   │   │   └─ trip.model.js
│   │   └─ routes/
│   │       └─ trip.routes.js
│   │
│   ├─ location/
│   │   ├─ controllers/
│   │   │   └─ location.controller.js
│   │   ├─ services/
│   │   │   └─ location.service.js
│   │   ├─ models/
│   │   │   └─ location.model.js
│   │   └─ routes/
│   │       └─ location.routes.js
│
├─ middleware/                 # Shared middlewares
│   ├─ error.middleware.js
│   └─ auth.middleware.js
│
├─ uploads/                    # Uploaded images
│   ├─ User/
│   ├─ Vehicle_number/
│   ├─ RC/
│   └─ DL/
│
├─ app.js                      # Express app initialization
├─ server.js                   # Server startup
├─ package.json
├─ dependencies.txt
└─ README.md
```

---

## Environment Variables (.env)

```
# Server
PORT=
NODE_ENV=

# Database
DB_ROOT_PASSWORD=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

# JWT & Security
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_REFRESH_SECRET=

# Other configs
CORS_ORIGIN=

# Redis
REDIS_HOST=redis
REDIS_PORT=

# Mappls
MAPPLS_CLIENT_ID=
MAPPLS_CLIENT_SECRET=
```

---

## Visual API Routes Map

```
┌───────────────────────┐
│       Auth Module      │
└───────────────────────┘
POST /api/auth/send-otp          → Send OTP
POST /api/auth/verify-otp        → Verify OTP & issue JWT
POST /api/auth/refresh-token     → Refresh access token
POST /api/auth/logout            → Logout (requires token)

┌───────────────────────┐
│       User Module      │
└───────────────────────┘
GET    /api/user/:userid                   → Get user by ID
POST   /api/user/register                  → Register new user (file upload)
PUT    /api/user/update/:userid            → Update user (file upload)
DELETE /api/user/:userid                   → Delete user

┌───────────────────────┐
│       Rider Module     │
└───────────────────────┘
GET    /api/rider/:riderid                 → Get rider by ID
GET    /api/rider/user/:userid             → Get rider by user ID
POST   /api/rider/register                 → Register rider (dl_image)
PUT    /api/rider/update/:riderid         → Update rider (dl_image)
DELETE /api/rider/delete/:riderid         → Delete rider

┌───────────────────────┐
│      Vehicle Module    │
└───────────────────────┘
POST   /api/vehicle/register               → Register vehicle (vehicle_image + rc_image)
GET    /api/vehicle/:vehicleId             → Get vehicle by ID
GET    /api/vehicle/rider/:riderId        → Get all vehicles of a rider
PUT    /api/vehicle/update/:vehicleId     → Update vehicle (vehicle_image + rc_image)
DELETE /api/vehicle/delete/:vehicleId     → Delete vehicle

┌───────────────────────┐
│       Trip Module      │
└───────────────────────┘
POST   /api/trip/register                  → User requests a trip
GET    /api/trip/:tripId                   → Get trip by ID
PUT    /api/trip/assign/:tripId           → Rider accepts trip
PUT    /api/trip/start/:tripId            → Start trip
PUT    /api/trip/update/:tripId           → Update distance/time
PUT    /api/trip/complete/:tripId         → Complete trip
PUT    /api/trip/cancel/:tripId           → Cancel trip

┌───────────────────────┐
│     Location Module    │
└───────────────────────┘
POST /api/location/live/update             → Update live location
GET  /api/location/live/:entity_type/:entity_id → Get live location
POST /api/location/history/add            → Add trip history
GET  /api/location/history/:trip_id       → Get trip history

┌───────────────────────┐
│     Extract Module     │
└───────────────────────┘
POST /api/extract/insurance               → Extract insurance data from PDF
POST /api/extract/rc-card                 → Extract RC card from image
POST /api/extract/number-plate            → Extract vehicle number plate from image
POST /api/extract/driving-license         → Extract DL number from image
```

---

## Database Tables

### User Table

```sql
CREATE TABLE user_table (
  userId INT AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  gender ENUM('Male','Female','Other') DEFAULT NULL,
  dob DATE,
  aadhar VARCHAR(15) UNIQUE,
  mobile_number VARCHAR(20) UNIQUE,
  email VARCHAR(150) UNIQUE,
  image_add VARCHAR(255),
  security_pin VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Rider Table

```sql
CREATE TABLE rider_table (
  riderId INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  driving_license VARCHAR(50) UNIQUE,
  dl_image VARCHAR(255),
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rider_user FOREIGN KEY (userId) REFERENCES user_table(userId) ON DELETE CASCADE
);
```

### Vehicle Table

```sql
CREATE TABLE vehicle_table (...);
```

### Location Tables

```sql
CREATE TABLE live_locations (...);
CREATE TABLE location_history (...);
CREATE TABLE live_locations_log (...);
```

### Trip Table

```sql
CREATE TABLE trips (...);
```

---

## Middleware

- **auth.middleware.js** → JWT verification
- **error.middleware.js** → Global error handler (`AppError` + `asyncHandler`)

---

## Config

- **bcrypt.config.js** → Password hashing & comparison
- **db.config.js** → MySQL connection pool
- **multer.config.js** → File upload handler (User, Vehicle, RC, DL)
- **redisClient.js** → Redis connection for OTP/session
- **env.config.js** → Loads `.env` variables

---

## Scripts

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

## How to Run

1. Clone repo
2. Copy `.env.example` → `.env` and fill variables
3. Install dependencies:

```bash
npm install
```

4. Start development server:

```bash
npm run dev
```

5. Production:

```bash
npm start
```

---

## Notes

- Each module is **self-contained** with `controllers`, `services`, `models`, `routes`.
- All **file uploads** are stored in `/uploads/` folder.
- Redis is used for OTP & JWT refresh tokens.
- Mappls API for location services.
