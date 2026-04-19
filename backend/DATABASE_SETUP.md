# Database Setup Guide

## ✅ Good News: No Database Installation Required!

This project uses **SQLite**, which is a file-based database. You don't need to install MySQL, PostgreSQL, or any other database server.

SQLite is built into Node.js/Prisma - no separate installation needed!

## 🚀 Quick Setup (3 Steps)

### Step 1: Create .env File

Create a `.env` file in `swm/backend/` directory:

```env
# Database URL (SQLite - file-based, no installation needed)
DATABASE_URL="file:./prisma/dev.db"

# Server Configuration
PORT=4000
NODE_ENV=development

# JWT Secret (generate one: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your-secret-key-here-change-this

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Step 2: Initialize Database

Run these commands in `swm/backend/` directory:

```bash
# Generate Prisma client (creates database connection)
npm run prisma:gen

# Create database tables (runs migrations)
npm run prisma:migrate
```

This will:
- Create the database file at `prisma/dev.db` (if it doesn't exist)
- Create all necessary tables (User, Bin, Operation, etc.)
- Set up the database schema

### Step 3: Create Admin User (Optional)

```bash
# Create default admin account
npm run seed
```

This creates:
- Email: `admin@luxora.com`
- Password: `admin123`

## ✅ Verify Database is Working

1. **Check if database file exists:**
   ```bash
   # Windows
   dir swm\backend\prisma\dev.db
   
   # Mac/Linux
   ls swm/backend/prisma/dev.db
   ```

2. **Test database connection:**
   ```bash
   cd swm/backend
   npm run dev
   ```
   If the server starts without errors, the database is working!

3. **View database (optional):**
   ```bash
   cd swm/backend
   npx prisma studio
   ```
   This opens a web interface at http://localhost:5555 to view your database.

## 🔧 Common Issues

### Issue 1: "DATABASE_URL is not set"

**Solution:**
Create `.env` file in `swm/backend/` with:
```env
DATABASE_URL="file:./prisma/dev.db"
```

### Issue 2: "Cannot find module '@prisma/client'"

**Solution:**
```bash
cd swm/backend
npm install
npm run prisma:gen
```

### Issue 3: "Migration failed"

**Solution:**
```bash
cd swm/backend
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or just run migrations again
npm run prisma:migrate
```

### Issue 4: Database file locked

**Solution:**
- Close Prisma Studio if it's open
- Stop the backend server
- Try again

## 📁 Database File Location

The database file is located at:
```
swm/backend/prisma/dev.db
```

This is a single file that contains all your data. You can:
- **Backup:** Just copy this file
- **Reset:** Delete this file and run migrations again
- **View:** Use Prisma Studio (`npx prisma studio`)

## 🎯 Complete Setup Checklist

- [ ] Created `.env` file in `swm/backend/`
- [ ] Added `DATABASE_URL="file:./prisma/dev.db"` to `.env`
- [ ] Ran `npm install` in `swm/backend/`
- [ ] Ran `npm run prisma:gen`
- [ ] Ran `npm run prisma:migrate`
- [ ] Database file `prisma/dev.db` exists
- [ ] Backend server starts without errors
- [ ] (Optional) Ran `npm run seed` to create admin user

## 💡 What is SQLite?

SQLite is:
- ✅ **File-based** - No server needed
- ✅ **Lightweight** - Perfect for development
- ✅ **Built-in** - Works with Prisma out of the box
- ✅ **Portable** - Just copy the .db file
- ✅ **Fast** - Great for small to medium applications

For production, you might want to use PostgreSQL or MySQL, but for development, SQLite is perfect!

## 🆘 Still Having Issues?

1. **Check Node.js version:**
   ```bash
   node --version
   # Should be 18 or higher
   ```

2. **Reinstall dependencies:**
   ```bash
   cd swm/backend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Prisma is installed:**
   ```bash
   npx prisma --version
   ```

4. **Verify .env file:**
   - Make sure it's in `swm/backend/.env` (not in parent directory)
   - Check there are no typos
   - Make sure DATABASE_URL is set

