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
│   │   │   └─ admin.controller.js
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
│   │
│   ├─ maps/
│   │   ├─ controllers/
│   │   │   └─ maps.controller.js
│   │   ├─ services/
│   │   │   └─ maps.service.js
│   │   └─ routes/
│   │       └─ maps.routes.js
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
├─ tests/                      # Test files
│   └─ api.test.js             # Comprehensive API tests (57 tests)
│
├─ postman/                    # Postman collections
│   └─ specs/
│       └─ Paylift-2.postman_collection.json
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

# Maps API (Google Maps / Mappls)
GOOGLE_MAPS_API_KEY=
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

┌───────────────────────┐
│       Admin Module     │
└───────────────────────┘
POST   /api/admin/send-otp       → Send admin OTP
POST   /api/admin/verify-otp     → Verify admin OTP & issue JWT
GET    /api/admin/users          → Get all users (admin only)
GET    /api/admin/riders         → Get all riders (admin only)
GET    /api/admin/vehicles       → Get all vehicles (admin only)
GET    /api/admin/trips          → Get all trips (admin only)

┌───────────────────────┐
│       User Module      │
└───────────────────────┘
GET    /api/users/:userid                  → Get user by ID
POST   /api/users/register                 → Register new user (file upload: user_image)
POST   /api/users/update/:userid           → Update user (file upload)
DELETE /api/users/:userid                  → Delete user

┌───────────────────────┐
│       Rider Module     │
└───────────────────────┘
GET    /api/riders/:riderid                → Get rider by ID
POST   /api/riders/register                → Register rider (formdata)
POST   /api/riders/update/:riderid         → Update rider
GET    /api/riders/user/:userid            → Get rider by user ID
DELETE /api/riders/delete/:riderid         → Delete rider

┌───────────────────────┐
│      Vehicle Module    │
└───────────────────────┘
GET    /api/vehicles/:vehicleid            → Get vehicle by ID
POST   /api/vehicles/register              → Register vehicle (formdata)
GET    /api/vehicles/rider/:riderid        → Get all vehicles of a rider
PUT    /api/vehicles/update/:vehicleid     → Update vehicle (formdata)
DELETE /api/vehicles/delete/:vehicleid     → Delete vehicle

┌───────────────────────┐
│  Vehicle Pricing Module│
└───────────────────────┘
POST   /api/vehicles/pricing/create                    → Create vehicle pricing
GET    /api/vehicles/pricing/all                       → Get all pricing
GET    /api/vehicles/pricing/id/:id                    → Get pricing by ID
GET    /api/vehicles/pricing/category/:category        → Get pricing by category
PUT    /api/vehicles/pricing/update/id/:id             → Update pricing by ID
PUT    /api/vehicles/pricing/update/category/:category → Update pricing by category
GET    /api/vehicles/pricing/stats                     → Get pricing statistics
DELETE /api/vehicles/pricing/delete/:id                → Delete pricing

┌───────────────────────┐
│       Trip Module      │
└───────────────────────┘
GET    /api/trips/:tripid                  → Get trip by ID
POST   /api/trips/register                 → User requests a trip
PUT    /api/trips/assign/:tripid           → Assign rider and vehicle to trip
PUT    /api/trips/start/:tripid            → Start trip
PUT    /api/trips/update/:tripid           → Update trip progress
PUT    /api/trips/complete/:tripid         → Complete trip (with total_fare)
PUT    /api/trips/cancel/:tripid           → Cancel trip

┌───────────────────────┐
│     Location Module    │
└───────────────────────┘
POST /api/location/live/update                        → Update live location
GET  /api/location/live/:entity_type/:entity_id       → Get live location
POST /api/location/history/add                        → Add location history entry

┌───────────────────────┐
│     Extract Module     │
└───────────────────────┘
POST /api/extract/insurance               → Extract insurance data from PDF (requires JWT, file upload)
POST /api/extract/rc-card                 → Extract RC card data from image (requires JWT, file upload)
POST /api/extract/number-plate            → Extract vehicle number plate from image (requires JWT, file upload)
POST /api/extract/driving-license         → Extract DL number from image (requires JWT, file upload)

┌───────────────────────┐
│       Maps Module      │
└───────────────────────┘
POST /api/maps/route                      → Get route between origin and destination
POST /api/maps/distance-matrix            → Get distance matrix for multiple origins/destinations
GET  /api/maps/places/autocomplete        → Place autocomplete search (query: input)
GET  /api/maps/places/details             → Get place details (query: placeId)
```

---

## API Endpoint Examples

### Authentication

#### Send OTP

```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "mobile": "9876543210"
}
```

#### Verify OTP

```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "mobile": "9876543210",
  "otp": "123456"
}
```

#### Refresh Token

```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### User Management

#### Register User

```http
POST /api/users/register
Authorization: Bearer <token>
Content-Type: multipart/form-data

firstname: paylift_user
lastname: paylift_user_sirname
gender: male
dob: 2004-01-1
aadhar: 22222222222
mobile_number: 111111111
email: paylift.user@email.com
security_pin: 123456789
status: active
user_image: [file]
```

#### Get User by ID

```http
GET /api/users/:userid
Authorization: Bearer <token>
```

### Rider Management

#### Register Rider

```http
POST /api/riders/register
Authorization: Bearer <token>
Content-Type: multipart/form-data

userId: 2
driving_license: DL-MH-445566
```

### Vehicle Management

#### Register Vehicle

```http
POST /api/vehicles/register
Authorization: Bearer <token>
Content-Type: multipart/form-data

riderId: 8
category: bike
vehicle_type: twowheeler
vehicle_name: super splendour
vehicle_number: MP09AB1234
rc_number: RCMP09SHINE1234
owner_name: Rohit Sharma
owner_contact: 9876543210
driving_license: DLMP09887766
```

#### Update Vehicle

```http
PUT /api/vehicles/update/:vehicleid
Authorization: Bearer <token>
Content-Type: multipart/form-data

[vehicle details...]
```

### Vehicle Pricing

#### Create Pricing

```http
POST /api/vehicles/pricing/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "two_wheeler",
  "base_fare": "25",
  "per_km": "12",
  "per_minute": "2",
  "min_fare": "50",
  "cancellation_fee": "20"
}
```

#### Get Pricing by Category

```http
GET /api/vehicles/pricing/category/two_wheeler
```

#### Update Pricing

```http
PUT /api/vehicles/pricing/update/id/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "four_wheeler",
  "base_fare": "50",
  "per_km": "15",
  "per_minute": "3",
  "min_fare": "100",
  "cancellation_fee": "30"
}
```

### Trip Management

#### Assign Trip

```http
PUT /api/trips/assign/:tripid
Authorization: Bearer <token>
Content-Type: application/json

{
  "riderId": 8,
  "vehicleId": 3
}
```

#### Complete Trip

```http
PUT /api/trips/complete/:tripid
Authorization: Bearer <token>
Content-Type: application/json

{
  "total_fare": 1500
}
```

### Location Tracking

#### Update Live Location

```http
POST /api/location/live/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "entity_id": 101,
  "entity_type": "rider",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

#### Get Live Location

```http
GET /api/location/live/:entity_type/:entity_id
Authorization: Bearer <token>
```

#### Add Location History

```http
POST /api/location/history/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "trip_id": 5001,
  "rider_id": 101,
  "latitude": 12.9716000,
  "longitude": 77.5946000,
  "distance_meters": 25.4
}
```

### Document Extraction

#### Extract Insurance

```http
POST /api/extract/insurance
Authorization: Bearer <token>
Content-Type: multipart/form-data

document: [PDF file]
```

#### Extract RC Card

```http
POST /api/extract/rc-card
Authorization: Bearer <token>
Content-Type: multipart/form-data

document: [Image file]
```

#### Extract Driving License

```http
POST /api/extract/driving-license
Authorization: Bearer <token>
Content-Type: multipart/form-data

document: [Image file]
```

#### Extract Number Plate

```http
POST /api/extract/number-plate
Authorization: Bearer <token>
Content-Type: multipart/form-data

document: [Image file]
```

### Maps Integration

#### Get Route

```http
POST /api/maps/route
Content-Type: application/json

{
  "origin": { "lat": 40.7128, "lng": -74.0060 },
  "destination": { "lat": 42.3601, "lng": -71.0589 }
}
```

#### Get Distance Matrix

```http
POST /api/maps/distance-matrix
Content-Type: application/json

{
  "origins": [
    { "lat": 40.7128, "lng": -74.0060 }
  ],
  "destinations": [
    { "lat": 42.3601, "lng": -71.0589 }
  ]
}
```

#### Place Autocomplete

```http
GET /api/maps/places/autocomplete?input=fafadih
```

#### Get Place Details

```http
GET /api/maps/places/details?placeId=ChIJEchLzIbdKDoRxEX5BzaseNk
```

### Admin Endpoints

#### Admin Send OTP

```http
POST /api/admin/send-otp
Content-Type: application/json

{
  "mobile": "+91xxxxxxxxxxx",
  "email": "xxxxxxxxxx@email.com"
}
```

#### Get All Users (Admin)

```http
GET /api/admin/users
Authorization: Bearer <admin_token>
```

#### Get All Riders (Admin)

```http
GET /api/admin/riders
Authorization: Bearer <admin_token>
```

#### Get All Vehicles (Admin)

```http
GET /api/admin/vehicles
Authorization: Bearer <admin_token>
```

#### Get All Trips (Admin)

```http
GET /api/admin/trips
Authorization: Bearer <admin_token>
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

## Testing

### Running Tests

The project includes comprehensive API tests using Jest and Supertest.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

The test suite (`tests/api.test.js`) covers all API endpoints:

#### 🔐 Authentication Tests

- User Auth Routes (4 tests)
  - Send OTP
  - Verify OTP
  - Refresh Token
  - Logout
- Admin Auth Routes (4 tests)
  - Admin Send OTP
  - Admin Verify OTP
  - Admin Refresh Token
  - Admin Logout

#### 👤 User Management Tests

- User Module Routes (4 tests)
  - Get user by ID
  - Register new user
  - Update user
  - Delete user

#### 🏍️ Rider Management Tests

- Rider Module Routes (5 tests)
  - Get rider by ID
  - Get rider by user ID
  - Register rider
  - Update rider
  - Delete rider

#### 🚗 Vehicle Management Tests

- Vehicle Module Routes (5 tests)
  - Register vehicle
  - Get vehicle by ID
  - Get rider vehicles
  - Update vehicle
  - Delete vehicle
- Vehicle Pricing Module Routes (8 tests)
  - Create pricing
  - Get all pricing
  - Get pricing by ID
  - Get pricing by category
  - Update pricing by ID
  - Update pricing by category
  - Get pricing stats
  - Delete pricing

#### 🛣️ Trip Management Tests

- Trip Module Routes (7 tests)
  - Register trip
  - Get trip by ID
  - Assign trip to rider
  - Start trip
  - Update trip progress
  - Complete trip
  - Cancel trip

#### 📍 Location Tests

- Location Module Routes (4 tests)
  - Update live location
  - Get live location
  - Add location history
  - Get trip history

#### 📄 Document Extraction Tests

- Extract Module Routes (4 tests)
  - Extract insurance data
  - Extract RC card data
  - Extract number plate
  - Extract driving license

#### 🗺️ Maps Integration Tests

- Maps Module Routes (4 tests)
  - Get route
  - Get distance matrix
  - Place autocomplete
  - Get place details

#### 👑 Admin Dashboard Tests

- Admin Module Routes (5 tests)
  - Get all users
  - Get all riders
  - Get all vehicles
  - Get all trips
  - Get dashboard stats

**Total: 57 API endpoint tests**

### Test Configuration

Tests use mock tokens and accept multiple valid status codes to handle different implementation scenarios. Each test includes:

- Proper authentication headers
- Request timeout handling (5000ms)
- Expected status code validation
- Response body validation where applicable

---

## Scripts

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "jest"
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
- Google Maps API / Mappls API for location services, routing, and place search.
- Comprehensive test suite with **57 API endpoint tests** covering all modules.
- Tests use Jest and Supertest for API testing.
- The project follows **modular architecture** for better scalability and maintainability.

---

## API Documentation

For detailed API documentation and testing:

- Import the Postman collection from `postman/specs/Paylift-2.postman_collection.json`
- Run the test suite with `npm test` to validate all endpoints
- Check `tests/api.test.js` for test implementation examples

---

## Tech Stack

- **Backend Framework:** Node.js + Express.js
- **Database:** MySQL with connection pooling
- **Caching:** Redis for OTP and session management
- **Authentication:** JWT (Access + Refresh tokens)
- **File Upload:** Multer for image/document handling
- **Document Processing:** PDF and image extraction capabilities
- **Maps Integration:** Google Maps API / Mappls API
- **Testing:** Jest + Supertest
- **Security:** Bcrypt for password hashing, CORS enabled
