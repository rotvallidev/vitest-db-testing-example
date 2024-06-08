# Vitest db testing example

Article: [https://rotvalli.dev/articles/testing-with-postgres-template-and-vitest](https://rotvalli.dev/articles/testing-with-postgres-template-and-vitest)

## How to Run Tests

### Prerequisites

Before you begin, make sure you have the following installed:

- Docker
- Node.js

### Start Up the Database

To set up the PostgreSQL database, follow these steps:

1. Open your terminal.

2. `docker run --name test-db -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres:16.3`

### Install depencencies

```bash
npm ci
```

### Run Tests

Now that the database is up and running, execute your tests with the necessary environment variables:

```bash
POSTGRES_PASSWORD=docker npm run test
```
