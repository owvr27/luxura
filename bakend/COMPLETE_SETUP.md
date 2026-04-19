# Complete Setup Guide - Fix Network Errors

## 🎯 Step-by-Step Setup (Do This First!)

### Step 1: Install Node.js Dependencies

```bash
cd swm/backend
npm install
```

### Step 2: Create .env File

Create `swm/backend/.env` file with this content:

```env
# Database (SQLite - no installation needed!)
DATABASE_URL="file:./prisma/dev.db"

# Server
PORT=4000
NODE_ENV=development

# JWT Secret (generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=change-this-to-a-random-32-character-string

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Set Up Database

```bash
cd swm/backend

# Generate Prisma client
npm run prisma:gen

# Create database tables
npm run prisma:migrate

# Create admin user (optional)
npm run seed
```

### Step 4: Create Frontend .env File

Create `swm/frontend/.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Step 5: Start Backend Server

```bash
cd swm/backend
npm run dev
```

You should see:
```
🚀 Luxora Environmental API Server
📦 Version: 1.0.0
🌍 Environment: development
🔗 Server running on http://localhost:4000
```

### Step 6: Start Frontend (in another terminal)

```bash
cd swm/frontend
npm run dev
```

### Step 7: Test Connection

1. Open browser: http://localhost:4000
   - Should see API information JSON

2. Open browser: http://localhost:3000
   - Should see the website

3. Try logging in:
   - Email: `admin@luxora.com`
   - Password: `admin123`

## ✅ Verification Checklist

- [ ] Backend server running on port 4000
- [ ] Frontend server running on port 3000
- [ ] Can access http://localhost:4000
- [ ] Can access http://localhost:3000
- [ ] No network errors in browser console
- [ ] Can log in with admin credentials

## 🔧 If Still Getting Network Errors

### Check 1: Backend is Running
```bash
# In backend directory
npm run dev
# Should see server starting message
```

### Check 2: Frontend .env.local exists
```bash
# File should exist at:
swm/frontend/.env.local

# With content:
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Check 3: Ports are Available
```bash
# Windows - Check if port 4000 is in use
netstat -ano | findstr :4000

# If something is using it, change PORT in backend/.env
```

### Check 4: Database is Set Up
```bash
cd swm/backend
# Check if database file exists
dir prisma\dev.db

# If not, run:
npm run prisma:gen
npm run prisma:migrate
```

### Check 5: Browser Console
- Open DevTools (F12)
- Check Console tab for specific errors
- Check Network tab for failed requests

## 🆘 Common Fixes

### Fix 1: "Cannot connect to server"
- Make sure backend is running: `npm run dev` in backend folder
- Check port 4000 is not blocked by firewall

### Fix 2: "CORS error"
- Check `CORS_ORIGIN=http://localhost:3000` in backend `.env`
- Restart backend server after changing .env

### Fix 3: "Database error"
- Run: `npm run prisma:gen` and `npm run prisma:migrate`
- Check `.env` has `DATABASE_URL="file:./prisma/dev.db"`

### Fix 4: "JWT_SECRET is not set"
- Add `JWT_SECRET=your-secret-key` to backend `.env`
- Generate one: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## 📝 Quick Reference

**Backend commands:**
```bash
cd swm/backend
npm install          # Install dependencies
npm run prisma:gen   # Generate Prisma client
npm run prisma:migrate  # Create database
npm run seed         # Create admin user
npm run dev          # Start server
```

**Frontend commands:**
```bash
cd swm/frontend
npm install          # Install dependencies
npm run dev          # Start server
```

**Default Admin:**
- Email: `admin@luxora.com`
- Password: `admin123`

## 🎉 You're Done!

Once all steps are complete, you should be able to:
- Access the website at http://localhost:3000
- Log in with admin credentials
- Use all features without network errors

