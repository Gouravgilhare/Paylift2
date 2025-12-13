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

## Key Modules

### 1️⃣ Auth Module

- **Routes**: `modules/auth/routes/auth.routes.js`
- **Controller**: `modules/auth/controllers/auth.controller.js`
- **Service**: `modules/auth/services/auth.service.js`
- **Middleware**: `modules/auth/middleware/auth.middleware.js`
- **Features**:
  - Send OTP
  - Verify OTP and issue JWT (access & refresh token)
  - Token refresh

### 2️⃣ User Module

- **Routes**: `modules/user/routes/user.routes.js`
- **Controller**: `modules/user/controllers/user.controller.js`
- **Service**: `modules/user/services/user.service.js`
- **Model**: `modules/user/models/user.model.js`
- **Features**:
  - Register user
  - Update user (with image upload)
  - Get user by ID
  - Delete user

### 3️⃣ Rider Module

- **Routes**: `modules/rider/routes/rider.routes.js`
- **Controller**: `modules/rider/controllers/rider.controller.js`
- **Service**: `modules/rider/services/rider.service.js`
- **Model**: `modules/rider/models/rider.model.js`
- **Features**:
  - Create/Update Rider profile
  - Get Rider details
  - Rider activation status

### 4️⃣ Vehicle Module

- **Routes**: `modules/vehicle/routes/vehicle.routes.js`
- **Controller**: `modules/vehicle/controllers/vehicle.controller.js`
- **Service**: `modules/vehicle/services/vehicle.service.js`
- **Model**: `modules/vehicle/models/vehicle.model.js`
- **Features**:
  - Register vehicle
  - Update vehicle info
  - Vehicle activation status
  - Image upload (RC, vehicle image)

### 5️⃣ Trip Module

- **Routes**: `modules/trips/routes/trip.routes.js`
- **Controller**: `modules/trips/controllers/trip.controller.js`
- **Service**: `modules/trips/services/trip.service.js`
- **Model**: `modules/trips/models/trip.model.js`
- **Features**:
  - Trip request & assignment
  - Update trip status (`requested`, `accepted`, `ongoing`, `completed`, `cancelled`)
  - Calculate fare
  - Track payment status

### 6️⃣ Location Module

- **Routes**: `modules/location/routes/location.routes.js`
- **Controller**: `modules/location/controllers/location.controller.js`
- **Service**: `modules/location/services/location.service.js`
- **Model**: `modules/location/models/location.model.js`
- **Features**:
  - Live location updates for users/riders
  - Location history
  - Log old vs new positions

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
