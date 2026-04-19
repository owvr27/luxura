# Backend Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create Environment File

Create a `.env` file in the `backend` directory with the following content:

```env
PORT=4000
NODE_ENV=development
JWT_SECRET=change-this-to-a-random-32-character-string-in-production
CORS_ORIGIN=http://localhost:3000
```

### Generate a Secure JWT Secret

Run this command to generate a secure random JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET` value.

## Step 3: Set Up Database

```bash
# Generate Prisma client
npm run prisma:gen

# Run database migrations
npm run prisma:migrate
```

## Step 4: Start the Server

### Development Mode (with hot reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm run build
npm start
```

## Step 5: Verify Installation

1. Open your browser and go to: `http://localhost:4000`
2. You should see the API information JSON
3. Check health: `http://localhost:4000/health`

## Connecting Frontend

Make sure your frontend `.env.local` file (in `swm/frontend/`) contains:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Troubleshooting

### Error: JWT_SECRET is not set
- Make sure you created the `.env` file
- Check that `JWT_SECRET` is set in the file

### Error: Port already in use
- Change the `PORT` in your `.env` file to a different port (e.g., 4001)
- Update `NEXT_PUBLIC_API_URL` in frontend to match

### CORS Errors
- Ensure `CORS_ORIGIN` in backend `.env` matches your frontend URL
- Default is `http://localhost:3000` for Next.js

### Database Errors
- Run `npm run prisma:gen` to regenerate Prisma client
- Run `npm run prisma:migrate` to apply migrations

