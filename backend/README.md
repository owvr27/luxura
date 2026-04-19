# Luxora Environmental - Backend API

Backend API server for the Luxora Environmental waste management system.

## 🎯 System Architecture

The backend consists of two integrated servers:

1. **Node.js Backend (Port 4000)** - Main API server with authentication, database, and business logic
2. **Python Image Server (Port 5000)** - Handles ESP32 camera image uploads (can forward to Node.js)

```
ESP32 Camera → Python Server (5000) → Node.js Backend (4000) → Frontend Website
                    OR
ESP32 Camera → Node.js Backend (4000) → Frontend Website
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- SQLite (managed by Prisma)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=4000
   NODE_ENV=development

   # JWT Secret - Generate a strong random string
   # Generate one: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # CORS Configuration
   # For development, allow localhost. For production, specify your frontend domain
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run prisma:gen

   # Run migrations
   npm run prisma:migrate
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:4000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.ts          # Main server file
│   ├── config.ts          # Environment configuration
│   ├── prisma.ts          # Prisma client setup
│   ├── auth.ts            # Authentication utilities
│   ├── middleware.ts      # Express middleware
│   └── routes/            # API routes
│       ├── auth.ts        # Authentication routes
│       ├── user.ts        # User routes
│       ├── admin.ts       # Admin routes
│       ├── iot.ts         # IoT device routes
│       └── redeem.ts      # Code redemption routes
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
└── dist/                  # Compiled JavaScript (generated)
```

## 🔌 API Endpoints

### Health Check
- `GET /health` - Server health check

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### User Routes (Requires Authentication)
- `GET /me` - Get current user profile
- `GET /wallet` - Get user's points wallet and transactions
- `GET /bins` - Get all smart bins (public)
- `GET /rewards` - Get all available rewards (public)

### Redemption
- `POST /redeem` - Redeem a code for points (requires authentication)

### Admin Routes (Requires Admin Role)
- `GET /admin/dashboard` - Admin dashboard statistics
- `GET /admin/bins` - Manage bins
- `GET /admin/operations` - View all operations

### IoT Routes
- `POST /iot/operation` - Create operation from IoT device

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing (configurable)
- **Rate Limiting** - 300 requests per 15 minutes per IP
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Argon2 for password security
- **Input Validation** - Zod schema validation

## 🛠️ Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:gen` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

## 🌍 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `4000` | No |
| `NODE_ENV` | Environment (development/production) | `development` | No |
| `JWT_SECRET` | Secret key for JWT tokens | - | **Yes** |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | `http://localhost:3000` | No |

## 📝 Development

### Database Management

The project uses Prisma ORM with SQLite. To modify the database schema:

1. Edit `prisma/schema.prisma`
2. Create a migration: `npm run prisma:migrate`
3. The database file is located at `prisma/dev.db`

### Adding New Routes

1. Create a new file in `src/routes/`
2. Import and use it in `src/server.ts`
3. Add authentication middleware if needed

## 🚨 Troubleshooting

### Port Already in Use
If port 4000 is already in use, change the `PORT` in your `.env` file.

### CORS Errors
Make sure `CORS_ORIGIN` in `.env` matches your frontend URL (e.g., `http://localhost:3000`).

### Database Errors
Run `npm run prisma:gen` to regenerate the Prisma client after schema changes.

### JWT Secret Missing
Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📄 License

Part of the Luxora Environmental project.
