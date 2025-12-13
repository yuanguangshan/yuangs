# Express API on Cloudflare

This project demonstrates how to deploy an Express-like API to Cloudflare using both Workers and Pages.

## Project Structure

- `local-server.js` - Original Express server for local development
- `src/index.js` - Cloudflare Worker entry point
- `src/cors.js` - CORS headers utility
- `wrangler.toml` - Cloudflare Workers configuration
- `public/index.html` - Frontend application
- `_routes.json` - Cloudflare Pages routing configuration

## Local Development

To run the original Express server locally:

```bash
npm install
npm run dev
```

The server will start on http://localhost:3000

## Deployment Options

### Option 1: Deploy API to Cloudflare Workers

#### Prerequisites

1. Install Wrangler CLI globally:
```bash
npm install -g wrangler
```

2. Log in to your Cloudflare account:
```bash
wrangler login
```

3. Update `wrangler.toml` with your account ID:
```toml
account_id = "your-real-account-id"
```

You can find your account ID in the Cloudflare dashboard URL or with:
```bash
wrangler whoami
```

#### Deployment

Deploy your worker with:

```bash
npm run deploy
```

Or run in development mode:
```bash
npm run dev:worker
```

### Option 2: Deploy Frontend to Cloudflare Pages

#### Prerequisites

1. Have your API deployed to Cloudflare Workers
2. Update the API URL in `public/index.html` to point to your deployed API endpoint
3. Log in to Cloudflare: `wrangler login`

#### Deployment Steps

1. Create a new Pages project in the Cloudflare dashboard
2. Connect your GitHub repository or upload your files
3. Set the build configuration:
   - Build command: `echo "Just serving static files"`
   - Build output directory: `public`
   - Root directory: `.`

4. Or deploy via Wrangler:
```bash
wrangler pages deploy public
```

## API Endpoints

- `GET /users` - Get all users
- `POST /users` - Create a new user
- `PUT /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user

## Notes

This implementation uses in-memory storage for demonstration purposes. Data will be lost when the worker restarts. For persistent storage, consider using Cloudflare D1 database.

The original MongoDB connection has been replaced with an in-memory solution suitable for Workers. If you need persistent data storage, you'll need to migrate to Cloudflare D1 or another service compatible with Workers.

## Environment Setup

- Local development: Runs the original Express server with MongoDB
- Production: Runs on Cloudflare Workers with in-memory storage