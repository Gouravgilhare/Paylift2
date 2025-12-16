# API Testing Guide

## Running Tests

### 1. Jest (Automated)

Run all tests:

```bash
npm test
```

Watch mode (auto-rerun on changes):

```bash
npm run test:watch
```

Coverage report:

```bash
npm run test:coverage
```

### 2. Postman (Manual)

1. Import `postman-collection.json` into Postman
2. Set environment variable: `baseUrl=http://localhost:3000`
3. Run requests sequentially (auth first, then other endpoints)

## Test Structure

- **Auth Routes**: User & Admin authentication (OTP flow)
- **User Routes**: CRUD operations for users
- **Rider Routes**: Rider registration & management
- **Vehicle Routes**: Vehicle registration & management
- **Trip Routes**: Trip creation, assignment, completion
- **Location Routes**: Live location & history tracking
- **Admin Routes**: Dashboard & analytics

## Expected Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Server Error

## Notes

- All protected routes require `Authorization: Bearer <token>` header
- Test data uses mock OTP `1234`
- Replace `baseUrl` with your server address
