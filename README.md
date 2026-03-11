# 📚 LMS Backend

REST API server for the Learning Management System, built with **Express.js** and **TypeScript**.

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Runtime      | Node.js + TypeScript                |
| Framework    | Express 5                           |
| Database     | MySQL (via Knex.js query builder)   |
| Auth         | JWT (access + refresh tokens), bcrypt |
| Validation   | Zod                                 |
| Testing      | Jest + ts-jest                       |

## Project Structure

```
src/
├── server.ts            # Entry point — starts the HTTP server
├── app.ts               # Express app setup (middleware, routes)
├── config/              # Database & app configuration
├── middleware/           # Auth middleware (JWT verification)
├── modules/             # Feature modules (domain-driven)
│   ├── auth/            # Login, register, token refresh
│   ├── chat/            # Chat / messaging
│   ├── health/          # Health-check endpoint
│   ├── progress/        # User progress tracking
│   ├── sections/        # Course sections
│   ├── subjects/        # Subjects / courses
│   ├── users/           # User management
│   └── videos/          # Video content
├── types/               # Shared TypeScript types
├── utils/               # Helper utilities
└── __tests__/           # Unit tests
migrations/              # Knex database migrations
knexfile.ts              # Knex configuration
seed.ts                  # Database seeding script
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MySQL** database (local or cloud — e.g. Aiven)

### Installation

```bash
npm install
```

### Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable             | Description                         |
| -------------------- | ----------------------------------- |
| `PORT`               | Server port (default `5000`)        |
| `NODE_ENV`           | `development` or `production`       |
| `DB_HOST`            | MySQL host                          |
| `DB_PORT`            | MySQL port (default `3306`)         |
| `DB_USER`            | MySQL username                      |
| `DB_PASSWORD`        | MySQL password                      |
| `DB_NAME`            | Database name                       |
| `JWT_ACCESS_SECRET`  | Secret for access tokens            |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens           |
| `CORS_ORIGIN`        | Allowed frontend origin URL         |

### Database Setup

Run migrations to create the schema:

```bash
npm run migrate
```

Optionally seed the database:

```bash
npx ts-node seed.ts
```

### Running

```bash
# Development (with hot-reload)
npm run dev

# Production
npm run build
npm start
```

### Testing

```bash
npm test
```

## API Modules

| Module       | Base Route       | Description                    |
| ------------ | ---------------- | ------------------------------ |
| Auth         | `/api/auth`      | Register, login, token refresh |
| Users        | `/api/users`     | User profiles & management     |
| Subjects     | `/api/subjects`  | Course / subject CRUD          |
| Sections     | `/api/sections`  | Course sections                |
| Videos       | `/api/videos`    | Video content                  |
| Progress     | `/api/progress`  | Track learning progress        |
| Chat         | `/api/chat`      | Chat / AI chatbot              |
| Health       | `/api/health`    | Server health check            |

## Deployment

The backend is designed to be deployed on **Render** (or any Node.js host).

```bash
npm run build   # Compile TypeScript → dist/
npm start       # Run compiled output
```
