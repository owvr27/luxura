# Admin Account Setup Guide

## Default Admin Credentials

After running the seed script, you can use these credentials:

**Email:** `admin@luxora.com`  
**Password:** `admin123`

⚠️ **IMPORTANT:** Change this password immediately in production!

## Creating Admin Account

### Option 1: Use Seed Script (Recommended)

1. Run the seed script:
   ```bash
   cd swm/backend
   npm run prisma:seed
   ```

2. This will create an admin user with:
   - Email: `admin@luxora.com`
   - Password: `admin123`
   - Role: `admin`

### Option 2: Create Admin Manually via API

1. Register a regular user first:
   ```bash
   curl -X POST http://localhost:4000/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Admin User",
       "email": "admin@luxora.com",
       "password": "your-secure-password"
     }'
   ```

2. Then update the user role to admin in the database (see Option 3)

### Option 3: Update Existing User to Admin

If you already have a user account, you can update it to admin:

1. **Using Prisma Studio (Easiest):**
   ```bash
   cd swm/backend
   npx prisma studio
   ```
   - Open the `User` table
   - Find your user
   - Change `role` from `user` to `admin`
   - Save

2. **Using SQL directly:**
   ```bash
   cd swm/backend
   sqlite3 prisma/dev.db
   ```
   Then run:
   ```sql
   UPDATE User SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

3. **Using a script:**
   Create a file `update-admin.ts`:
   ```typescript
   import prisma from './src/prisma.js';
   
   async function updateToAdmin() {
     await prisma.user.update({
       where: { email: 'your-email@example.com' },
       data: { role: 'admin' },
     });
     console.log('User updated to admin');
   }
   
   updateToAdmin();
   ```
   Run: `npx tsx update-admin.ts`

## Verifying Admin Access

1. Log in with admin credentials:
   ```bash
   curl -X POST http://localhost:4000/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@luxora.com",
       "password": "admin123"
     }'
   ```

2. Use the returned token to access admin endpoints:
   ```bash
   curl http://localhost:4000/admin/dashboard \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

3. Or log in through the frontend at `/login` page

## Admin Features

Once logged in as admin, you can:

- Access `/admin/dashboard` - View system statistics
- Manage bins via `/admin/bins`
- View all operations via `/admin/operations`
- Delete images via `/api/images/:filename` (DELETE)

## Security Best Practices

1. **Change Default Password:**
   - Log in as admin
   - Change password through your application (if implemented)
   - Or update directly in database

2. **Use Strong Passwords:**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, and symbols
   - Don't reuse passwords

3. **Limit Admin Accounts:**
   - Only create admin accounts for trusted users
   - Regularly audit admin access
   - Remove admin access when no longer needed

4. **Production Setup:**
   - Never use default credentials in production
   - Use environment variables for sensitive data
   - Enable additional security measures (2FA, etc.)

## Troubleshooting

### Can't Access Admin Dashboard

1. **Check User Role:**
   ```bash
   # Using Prisma Studio
   npx prisma studio
   # Check User table, verify role is 'admin'
   ```

2. **Verify Token:**
   - Make sure you're using the token from login
   - Token expires after 2 hours
   - Log in again to get a new token

3. **Check Middleware:**
   - Admin routes require `authRequired` and `adminOnly` middleware
   - Verify your user has `role: 'admin'` in database

### Forgot Admin Password

1. **Reset via Database:**
   ```bash
   # Generate new password hash
   node -e "const {hashPassword} = require('./dist/auth.js'); hashPassword('newpassword').then(console.log)"
   ```

2. **Update in Database:**
   ```sql
   UPDATE User SET passwordHash = 'NEW_HASH_HERE' WHERE email = 'admin@luxora.com';
   ```

3. **Or Re-run Seed:**
   ```bash
   npm run prisma:seed
   # This will reset to default password
   ```

