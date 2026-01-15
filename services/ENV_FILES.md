# Environment Files Management

This document explains how to manage multiple environment files in the NestJS microservices.

## Environment File Loading Order

The application loads environment files in the following order (later files override earlier ones):

1. `.env` - Base configuration (shared across all environments)
2. `.env.{APP_ENV}` or `.env.{NODE_ENV}` - Environment-specific overrides
   - Examples: `.env.dev`, `.env.qa`, `.env.production`, `.env.staging`
3. `.env.local` - Local overrides (gitignored, highest priority)
4. `.env.{APP_ENV}.local` - Environment-specific local overrides (gitignored)

## Setting the Environment

You can set the environment in two ways:

### Option 1: Using APP_ENV (Recommended)
```bash
APP_ENV=dev npm run start:dev
APP_ENV=qa npm run start:dev
APP_ENV=production npm run start:prod
```

### Option 2: Using NODE_ENV
```bash
NODE_ENV=development npm run start:dev
NODE_ENV=staging npm run start:dev
NODE_ENV=production npm run start:prod
```

**Priority**: `APP_ENV` takes precedence over `NODE_ENV` if both are set.

## Environment File Examples

### Base Configuration (.env)
Contains default values shared across all environments:
```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
```

### Development (.env.dev)
Development-specific overrides:
```env
APP_ENV=dev
DB_NAME=myapp_dev
DB_PASSWORD=dev_password
```

### QA (.env.qa)
QA environment configuration:
```env
APP_ENV=qa
DB_HOST=qa-db.example.com
DB_NAME=myapp_qa
```

### Production (.env.production)
Production environment configuration:
```env
APP_ENV=production
DB_HOST=prod-db.example.com
DB_NAME=myapp_prod
DB_PASSWORD=secure_production_password
```

### Local Overrides (.env.local)
Personal local overrides (not committed to git):
```env
DB_PASSWORD=my_local_password
DEBUG=true
```

## Setup Instructions

1. **Copy example files**:
   ```bash
   cd services/product-order-service
   cp .env.example .env
   cp .env.dev.example .env.dev
   ```

2. **Update values** in `.env` and environment-specific files

3. **Create `.env.local`** for personal overrides (optional, gitignored)

4. **Set environment** when running:
   ```bash
   # Development
   APP_ENV=dev npm run start:dev
   
   # QA
   APP_ENV=qa npm run start:dev
   
   # Production
   APP_ENV=production npm run start:prod
   ```

## Supported Environments

- `dev` / `development` - Development environment
- `qa` - QA/Testing environment
- `staging` - Staging environment
- `production` - Production environment
- `test` - Test environment

## Best Practices

1. **Never commit sensitive data**: Use `.env.local` for secrets
2. **Use example files**: Keep `.env.example` files updated with structure
3. **Environment-specific files**: Create separate files for each environment
4. **Local overrides**: Use `.env.local` for personal development settings
5. **Variable expansion**: You can use `${VAR}` syntax in .env files (enabled by `expandVariables: true`)

## Example: Variable Expansion

```env
# .env
BASE_URL=http://localhost:3001
API_URL=${BASE_URL}/api

# .env.production
BASE_URL=https://api.example.com
# API_URL will automatically be https://api.example.com/api
```

## Troubleshooting

- **File not loading**: Check that the file exists and is in the service root directory
- **Wrong values**: Remember that later files override earlier ones
- **Missing variables**: Ensure all required variables are in at least one env file
- **Validation errors**: Check `env.validation.ts` for required fields

