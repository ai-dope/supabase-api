# Supabase API

A RESTful API built with Express.js that provides a simplified interface for interacting with Supabase databases. This API abstracts away the complexity of direct Supabase client usage and provides a consistent interface for common database operations.

## Features

- Table management (create, drop, check existence)
- CRUD operations (create, read, update, delete)
- Swagger documentation
- Error handling middleware
- TypeScript support
- Unit tests

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project
- Environment variables (see Configuration section)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd supabase-api
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your Supabase credentials.

## Configuration

The following environment variables are required:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
PORT=3000
API_PREFIX=/api/v1
```

## API Routes

### Table Management

#### Create Table
```http
POST /api/v1/supabase/tables
```

Request body:
```json
{
  "tableName": "users",
  "schema": {
    "id": "uuid primary key",
    "name": "text",
    "email": "text unique",
    "created_at": "timestamp with time zone default now()"
  }
}
```

#### Drop Table
```http
DELETE /api/v1/supabase/tables/:tableName
```

#### Check Table Existence
```http
GET /api/v1/supabase/tables/:tableName/exists
```

### Data Operations

#### Create/Upsert Data
```http
POST /api/v1/supabase/tables/:tableName/data
```

Request body:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Query Data
```http
GET /api/v1/supabase/tables/:tableName/data
```

#### Delete Data
```http
DELETE /api/v1/supabase/tables/:tableName/data/:id
```

## Error Handling

The API uses a consistent error response format:

```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": {} // Optional additional error details
  }
}
```

Common error codes:
- `MISSING_CREDENTIALS`: Supabase credentials not configured
- `INVALID_REQUEST`: Invalid request parameters
- `DATABASE_ERROR`: Error from Supabase
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Server error

## Development

### Running Tests
```bash
npm test
```

### Running in Development Mode
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

## API Documentation

Swagger documentation is available at:
```
http://localhost:3000/api-docs
```

## Project Structure

```
src/
├── config/           # Configuration files
├── infrastructure/   # Infrastructure layer (repositories, factories)
│   ├── factory/      # Factory implementations
│   └── repository/   # Repository implementations
├── middleware/       # Express middleware
├── presentation/     # Presentation layer (controllers, routes)
│   ├── controller/   # Controller implementations
│   └── route/        # Route definitions
└── types/           # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[MIT License](LICENSE) 