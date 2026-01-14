# Zoura Backend

A NestJS backend application with PostgreSQL, Redis, and modular monolith architecture.

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: TypeORM
- **Language**: TypeScript

## Project Structure

```
src/
├── config/              # Configuration files
│   └── database.config.ts
├── modules/             # Feature modules (modular monolith)
│   ├── auth/           # Authentication module
│   ├── commerce/       # Commerce module
│   └── social/         # Social module
├── app.module.ts       # Root module
├── app.controller.ts   # Root controller
├── app.service.ts      # Root service
└── main.ts            # Application entry point
```

## Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose
- npm or yarn

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and update as needed:

```bash
cp .env.example .env
```

Environment variables:
- `NODE_ENV`: Application environment (development/production)
- `PORT`: Application port (default: 8080)
- `DB_HOST`: PostgreSQL host (default: localhost)
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_USERNAME`: Database user (default: admin)
- `DB_PASSWORD`: Database password (default: root)
- `DB_DATABASE`: Database name (default: zoura_db)
- `REDIS_HOST`: Redis host (default: localhost)
- `REDIS_PORT`: Redis port (default: 6379)

### 3. Start Docker Services

Start PostgreSQL and Redis using Docker Compose:

```bash
docker-compose up -d
```

Verify services are running:

```bash
docker ps
```

Check logs:

```bash
docker-compose logs -f
```

### 4. Run the Application

Development mode with hot reload:

```bash
npm run start:dev
```

Production mode:

```bash
npm run build
npm run start:prod
```

## API Endpoints

### Health Check
- **GET** `/` - Application and database health status

### Module Endpoints
- **GET** `/auth` - Auth module status
- **GET** `/commerce` - Commerce module status
- **GET** `/social` - Social module status

## Docker Commands

Start services:
```bash
docker-compose up -d
```

Stop services:
```bash
docker-compose down
```

View logs:
```bash
docker-compose logs -f
```

Restart services:
```bash
docker-compose restart
```

Remove volumes (clean slate):
```bash
docker-compose down -v
```

## Database

The application uses TypeORM with PostgreSQL. Database synchronization is enabled in development mode.

Connect to PostgreSQL:
```bash
docker exec -it zoura_postgres psql -U admin -d zoura_db
```

## Development

### Adding a New Module

1. Create module structure:
```bash
nest g module modules/new-module
nest g controller modules/new-module
nest g service modules/new-module
```

2. Import the module in `app.module.ts`

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## License

Private - Zoura Project

