# Cloudflare Deployment Guide

This guide walks you through deploying your Express-like API to Cloudflare Workers and serving the frontend via Cloudflare Pages.

## Prerequisites

Before deploying, ensure you have:

1. A Cloudflare account (sign up at [cloudflare.com](https://www.cloudflare.com))
2. Node.js 18+ installed on your local machine
3. The Wrangler CLI installed: `npm install -g wrangler`

## Step-by-Step Deployment

### Step 1: Configure Your Account Information

1. Get your Cloudflare Account ID:
   - Log into the Cloudflare dashboard
   - Select your account
   - Click "Workers & Pages"
   - Note your Account ID (a long hexadecimal string)

2. Update `wrangler.toml`:
   ```toml
   account_id = "your-actual-account-id-here"
   ```

### Step 2: Authenticate with Cloudflare

Run the following command and follow the authentication prompts:

```bash
wrangler login
```

This will open your browser and allow you to authorize Wrangler to deploy to your Cloudflare account.

### Step 3: Deploy the API to Cloudflare Workers

1. Deploy your API:
   ```bash
   npm run deploy
   ```

2. After deployment, you'll receive a unique URL for your API, typically in the format:
   ```
   https://your-project-name.your-subdomain.workers.dev
   ```

3. Note this URL as you'll need it in the next step.

### Step 4: Configure the Frontend to Use Your Deployed API

1. Open `public/index.html`
2. Find the API_URL configuration section and update it with your deployed API URL:
   ```javascript
   : 'https://your-project-name.your-subdomain.workers.dev/users';  // Production
   ```

### Step 5: Deploy the Frontend to Cloudflare Pages

You have two options:

#### Option A: Using the Cloudflare Dashboard

1. Go to the Cloudflare dashboard
2. Select "Pages" from the sidebar
3. Click "Create a project"
4. Connect your GitHub/GitLab repository or upload your code
5. Configure the build settings:
   - Build command: `echo "No build needed"`
   - Build output directory: `public`
   - Root directory: `.`
6. Click "Save and deploy"

#### Option B: Using Wrangler CLI

```bash
wrangler pages deploy public
```

### Step 6: Set Up Custom Domain (Optional)

If you want to use a custom domain:

1. For the API (Workers):
   - In the Workers section of the dashboard
   - Go to your worker's settings
   - Add a route for your custom domain

2. For the frontend (Pages):
   - In the Pages section of the dashboard
   - Select your project
   - Go to "Custom domains"
   - Add your desired domain

## Testing Your Deployment

Once deployed:

1. Visit your Pages URL to see the frontend
2. Add a user to test if the API integration works
3. Verify that data persists in the in-memory store (note: data resets on worker updates)

## Important Notes

- **Data Persistence**: The current implementation uses in-memory storage. Data will be lost when the worker restarts or is updated.
- **Production Storage**: For production applications, consider upgrading to Cloudflare D1 for persistent storage.
- **API Keys**: When using external databases or services, store API keys securely using Wrangler secrets: `wrangler secret put SECRET_NAME`

## Troubleshooting

Q: My deployment failed with an authentication error
A: Make sure you ran `wrangler login` and authenticated properly

Q: API requests from my frontend return CORS errors
A: Check that CORS headers are properly configured in `src/cors.js`

Q: My frontend can't connect to the deployed API
A: Verify the API URL in `public/index.html` matches your deployed worker URL

## Updating Your Deployment

1. Make changes to your code
2. Redeploy the API: `npm run deploy`
3. If only frontend changes, redeploy Pages using the dashboard or `wrangler pages deploy public`

## Development vs Production

- **Development**: Run `npm run dev` to use the full Express/MongoDB setup locally
- **Production**: Uses Cloudflare Workers with in-memory storage