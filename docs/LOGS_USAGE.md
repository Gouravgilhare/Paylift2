# Logs Management Feature - Usage Guide

This document provides examples of how to use the new logs management endpoints.

## Authentication Required

All logs endpoints require:
- JWT token in Authorization header
- Admin or superadmin role

## API Endpoints

### 1. Get List of Log Files

Get a list of all available log files with metadata.

```bash
GET /api/admin/logs
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Log files retrieved successfully",
  "data": [
    {
      "name": "combined.log",
      "size": 45231,
      "modified": "2024-01-15T10:30:00.000Z"
    },
    {
      "name": "error.log",
      "size": 12456,
      "modified": "2024-01-15T10:25:00.000Z"
    }
  ]
}
```

### 2. Get Logs from Specific File

Read logs from a specific log file with pagination.

```bash
GET /api/admin/logs/combined.log?lines=100&offset=0
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `lines` (optional): Number of log lines to retrieve (default: 100)
- `offset` (optional): Number of lines to skip from the end (default: 0)

**Response:**
```json
{
  "success": true,
  "message": "Logs retrieved successfully",
  "data": {
    "logs": [
      "{\"level\":\"info\",\"message\":\"User logged in\",\"timestamp\":\"2024-01-15 10:30:00\"}",
      "{\"level\":\"info\",\"message\":\"Trip created\",\"timestamp\":\"2024-01-15 10:29:00\"}"
    ],
    "total": 1523,
    "offset": 0,
    "lines": 100
  }
}
```

### 3. Get Recent Logs by Type

Get recent logs from a specific log type.

```bash
GET /api/admin/logs/recent/error?limit=50
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `limit` (optional): Number of recent logs to retrieve (default: 50)

**Supported Types:**
- `combined` - All logs
- `error` - Error logs only
- `http` - HTTP request logs
- `database` - Database operation logs
- `auth` - Authentication logs

**Response:**
```json
{
  "success": true,
  "message": "Recent error logs retrieved successfully",
  "data": {
    "logs": [
      "{\"level\":\"error\",\"message\":\"Database connection failed\",\"timestamp\":\"2024-01-15 10:30:00\"}",
      "{\"level\":\"error\",\"message\":\"Invalid token\",\"timestamp\":\"2024-01-15 10:25:00\"}"
    ],
    "total": 45,
    "offset": 0,
    "lines": 45
  }
}
```

### 4. Clear Log File (Superadmin Only)

Clear the contents of a specific log file.

```bash
DELETE /api/admin/logs/combined.log
Authorization: Bearer <superadmin-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Log file combined.log cleared",
  "data": {
    "success": true,
    "message": "Log file combined.log cleared"
  }
}
```

**Note:** This endpoint requires superadmin role. Regular admins will get a 403 Forbidden response.

## Error Responses

### Unauthorized (401)
```json
{
  "success": false,
  "message": "No token provided"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Forbidden: Admins only"
}
```

### File Not Found (500)
```json
{
  "success": false,
  "message": "Failed to read log file: Log file nonexistent.log not found"
}
```

## Log File Types

The application generates the following log files:

| File | Description |
|------|-------------|
| `combined.log` | All logs (info, warn, error) |
| `error.log` | Error logs only |
| `http.log` | HTTP request logs |
| `database.log` | Database operation logs |
| `auth.log` | Authentication event logs |
| `http-requests.log` | Raw HTTP request logs (Morgan) |

## Security Features

1. **Path Traversal Protection**: The service prevents accessing files outside the logs directory
2. **Role-Based Access**: Only admins can view logs, only superadmins can clear them
3. **JWT Authentication**: All endpoints require valid JWT token
4. **No Sensitive Data**: Logs are sanitized to avoid exposing sensitive information

## Example Usage with cURL

```bash
# Login as admin first
curl -X POST http://localhost:3000/api/admin/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile_number": "1234567890", "otp": "123456"}'

# Use the token from login response
TOKEN="your-jwt-token-here"

# Get list of log files
curl http://localhost:3000/api/admin/logs \
  -H "Authorization: Bearer $TOKEN"

# Get recent error logs
curl "http://localhost:3000/api/admin/logs/recent/error?limit=20" \
  -H "Authorization: Bearer $TOKEN"

# Get logs from specific file
curl "http://localhost:3000/api/admin/logs/combined.log?lines=50&offset=0" \
  -H "Authorization: Bearer $TOKEN"

# Clear log file (superadmin only)
curl -X DELETE http://localhost:3000/api/admin/logs/test.log \
  -H "Authorization: Bearer $TOKEN"
```

## Implementation Details

### Service Layer
- `modules/admin/services/logs.service.js` - Core logging functionality
- Handles file operations with error handling
- Implements pagination for large log files

### Controller Layer
- `modules/admin/controllers/logs.controller.js` - Request handling
- Validates user roles
- Formats responses

### Routes
- `modules/admin/routes/admin.routes.js` - Endpoint definitions
- Protected by JWT middleware
- Admin-only access control

## Testing

Run the logs test suite:

```bash
npm test -- logs.test.js
```

The test suite includes:
- Authentication tests
- File listing tests
- Log reading tests
- Log clearing tests (superadmin)
