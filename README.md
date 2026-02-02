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
│   ├─ admin/
│   │   ├─ controllers/
│   │   │   ├─ admin.controller.js
│   │   │   └─ logs.controller.js
│   │   ├─ services/
│   │   │   └─ logs.service.js
│   │   ├─ routes/
│   │   │   └─ admin.routes.js
│   │   └─ middleware/
│   │       └─ admin.middleware.js
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
│   │
│   ├─ extract/
│   │   ├─ controllers/
│   │   │   └─ extract.controller.js
│   │   ├─ services/
│   │   │   └─ extract.service.js
│   │   └─ routes/
│   │       └─ extract.routes.js
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
│     User Auth Module   │
└───────────────────────┘
POST /api/auth/send-otp          → Send OTP to user mobile
POST /api/auth/verify-otp        → Verify OTP & issue JWT access token
POST /api/auth/refresh-token     → Refresh expired access token
POST /api/auth/logout            → Logout user (requires JWT token)

┌───────────────────────┐
│    Admin Auth Module   │
└───────────────────────┘
POST /api/auth/admin/send-otp       → Send OTP to admin mobile
POST /api/auth/admin/verify-otp     → Verify OTP & issue JWT access token
POST /api/auth/admin/refresh-token  → Refresh expired access token
POST /api/auth/admin/logout         → Logout admin (requires JWT token)

┌───────────────────────┐
│       Admin Module     │
└───────────────────────┘
POST   /api/admin/send-otp       → Send admin OTP
POST   /api/admin/verify-otp     → Verify OTP & issue JWT
POST   /api/admin/refresh-token  → Refresh access token
POST   /api/admin/logout         → Logout (requires token)
GET    /api/admin/users          → Get all users (admin only)
GET    /api/admin/riders         → Get all riders (admin only)
GET    /api/admin/vehicles       → Get all vehicles (admin only)
GET    /api/admin/trips          → Get all trips (admin only)
GET    /api/admin/dashboard      → Get dashboard stats (admin only)
GET    /api/admin/logs           → Get list of log files (admin only)
GET    /api/admin/logs/recent/:type  → Get recent logs by type (admin only)
GET    /api/admin/logs/:filename → Get logs from specific file (admin only)
DELETE /api/admin/logs/:filename → Clear log file (superadmin only)

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
POST /api/extract/insurance               → Extract insurance data from PDF (requires JWT, file upload)
POST /api/extract/rc-card                 → Extract RC card data from image (requires JWT, file upload)
POST /api/extract/number-plate            → Extract vehicle number plate from image (requires JWT, file upload)
POST /api/extract/driving-license         → Extract DL number from image (requires JWT, file upload)
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

## Logging

The application uses **Winston** for structured logging and **Morgan** for HTTP request logging. Logs are stored in the `/logs/` directory.

### Log Files

- `combined.log` - All logs (info, warn, error)
- `error.log` - Error logs only
- `http.log` - HTTP request logs
- `database.log` - Database operation logs
- `auth.log` - Authentication event logs
- `http-requests.log` - Raw HTTP request logs (Morgan)

### Log Management (Admin Only)

Admins can view and manage logs through the API:

- **GET /api/admin/logs** - List all log files with size and last modified date
- **GET /api/admin/logs/:filename** - View logs from a specific file (supports pagination with `?lines=100&offset=0`)
- **GET /api/admin/logs/recent/:type** - Get recent logs by type (e.g., `/api/admin/logs/recent/error?limit=50`)
- **DELETE /api/admin/logs/:filename** - Clear a log file (superadmin only)

All log endpoints require JWT authentication and admin role.

---

## Notes

- Each module is **self-contained** with `controllers`, `services`, `models`, `routes`.
- All **file uploads** are stored in `/uploads/` folder.
- Redis is used for OTP & JWT refresh tokens.
- Mappls API for location services.
