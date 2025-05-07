# Deploying Kubra Market Admin to Render

This guide walks you through deploying the Kubra Market Admin application to Render.com with a PostgreSQL database.

## Prerequisites

1. A [Render.com](https://render.com) account
2. Your Kubra Market Admin code pushed to a Git repository (GitHub, GitLab, etc.)

## Step 1: Create a PostgreSQL Database on Render

1. Log in to your [Render Dashboard](https://dashboard.render.com/)
2. Click **New** and select **PostgreSQL**
3. Fill in the database details:
   - **Name**: `kubra-market-db` (or your preferred name)
   - **Database**: `kubra_market`
   - **User**: Leave the default
   - **Region**: Choose the region closest to your users
   - **PostgreSQL Version**: 14 or higher
   - **Instance Type**: Free tier is fine for development
4. Click **Create Database**
5. After creation, go to the database dashboard and find the **Internal Database URL** in the "Connections" section
6. Copy this URL - this is your `DATABASE_URL`

## Step 2: Deploy Your Web Service

1. In your Render dashboard, click **New** and select **Web Service**
2. Connect your Git repository
3. Configure the service:
   - **Name**: `kubra-market-admin` (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `./render-build.sh`
   - **Start Command**: `NODE_ENV=production node dist/index.js`
   - **Instance Type**: Free tier is fine for development/testing

4. Add the following environment variables:
   - `DATABASE_URL`: Paste the Internal Database URL from Step 1
   - `NODE_ENV`: `production`
   - `SESSION_SECRET`: Generate a random string (can use a password generator)
   - `RUN_MIGRATIONS`: `true` (for the first deployment, you can remove later)

5. Click **Create Web Service**

> **IMPORTANT**: If you encounter the error "Cannot find package '@vitejs/plugin-react'", make sure to move it from devDependencies to dependencies in your package.json before deploying.

## Step 3: Initialize Your Database

After your first successful deployment, you'll need to run database migrations:

1. Go to your web service in the Render dashboard
2. Navigate to the **Shell** tab
3. Run the following command to initialize your database schema:
   ```
   npx drizzle-kit push
   ```

## Step 4: Verify Deployment

1. Once deployment is complete, click the URL for your web service
2. You should see the Kubra Market Admin login page
3. Log in with:
   - Username: `admin`
   - Password: `admin123`

> **Note**: For security in production, you should change the default admin password after first login.

## Troubleshooting Common Issues

### Missing Dependencies
If you see errors like "Cannot find package '@vitejs/plugin-react'", ensure your package.json has all needed dependencies listed in both `dependencies` and `devDependencies`.

### Database Connection Issues
If you have trouble connecting to the database:
1. Verify the `DATABASE_URL` environment variable is set correctly
2. Check that you're using the internal connection URL, not the external one
3. Ensure your service is in the same region as your database

### Build Errors
If you encounter build errors:
1. Check the build logs in your Render dashboard
2. Ensure your local build works with `npm run build`
3. Consider adding specific Node.js version requirements in your package.json:
   ```json
   "engines": {
     "node": ">=16.0.0"
   }
   ```

## Updating Your Deployment

When you push changes to your repository, Render will automatically rebuild and deploy your application.