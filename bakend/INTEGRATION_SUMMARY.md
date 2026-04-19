# Integration Summary - All Files Working Together

## 📁 Files Overview

### Backend Files (Node.js)
- `src/server.ts` - Main Express server with all API routes
- `src/routes/images.ts` - Image upload/viewing endpoints
- `src/config.ts` - Environment configuration
- `package.json` - Node.js dependencies

### Backend Files (Python)
- `server.py` - Python Flask server for ESP32 image uploads
- `requirements.txt` - Python dependencies

### Hardware Files
- `esp32 camera code.txt` - ESP32 camera Arduino code

### Documentation Files
- `README.md` - Full backend documentation
- `SETUP.md` - Setup instructions
- `INTEGRATION.md` - Integration guide
- `ESP32_SETUP.md` - ESP32 setup guide
- `QUICK_START.md` - Quick start guide
- `INTEGRATION_SUMMARY.md` - This file

### Startup Scripts
- `start-servers.bat` - Windows script to start both servers
- `start-servers.sh` - Linux/Mac script to start both servers

## 🔄 How Everything Works Together

```
┌─────────────────┐
│   ESP32 Camera  │
│  (Hardware)     │
└────────┬─────────┘
         │
         │ HTTP POST (image/jpeg)
         │
         ▼
┌─────────────────────────────────┐
│   Python Server (Port 5000)     │
│   - Receives image              │
│   - Saves to photos/ folder     │
│   - Forwards to Node.js (opt)   │
└────────┬────────────────────────┘
         │
         │ Forward (if enabled)
         │
         ▼
┌─────────────────────────────────┐
│   Node.js Backend (Port 4000)   │
│   - Receives image              │
│   - Saves to photos/ folder     │
│   - Stores in database          │
│   - Provides API endpoints      │
└────────┬────────────────────────┘
         │
         │ API Calls
         │
         ▼
┌─────────────────────────────────┐
│   Frontend Website (Port 3000)  │
│   - Displays image gallery      │
│   - User authentication         │
│   - Admin management            │
└─────────────────────────────────┘
```

## 🎯 Integration Points

### 1. ESP32 → Python Server
- ESP32 sends POST request to `/upload`
- Python server receives binary image data
- Saves locally and optionally forwards to Node.js

### 2. Python Server → Node.js Backend
- Python server forwards images to `/api/images/upload`
- Both servers share the same `photos/` directory
- Node.js handles authentication and database

### 3. Node.js Backend → Frontend
- Frontend calls `/api/images` to list images
- Frontend calls `/api/images/:filename` to view images
- Requires user authentication (JWT token)

### 4. Shared Resources
- Both servers use `backend/photos/` directory
- Same image files accessible from both servers
- Frontend can access images from either server

## 🚀 Quick Start

### Option 1: Use Startup Scripts
```bash
# Windows
start-servers.bat

# Mac/Linux
./start-servers.sh
```

### Option 2: Manual Start
```bash
# Terminal 1 - Node.js
cd swm/backend
npm run dev

# Terminal 2 - Python
cd swm/backend
python server.py

# Terminal 3 - Frontend
cd swm/frontend
npm run dev
```

## 🔧 Configuration

### Python Server Environment Variables
```bash
# Forward images to Node.js (default: true)
FORWARD_TO_NODEJS=true

# Node.js backend URL
NODEJS_BACKEND_URL=http://localhost:4000
```

### Node.js Backend Environment Variables
```env
PORT=4000
NODE_ENV=development
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

### ESP32 Code
Update the upload URL:
```cpp
// Option 1: Direct to Node.js
const char* uploadUrl = "http://SERVER_IP:4000/api/images/upload";

// Option 2: Through Python server
const char* uploadUrl = "http://SERVER_IP:5000/upload";
```

## ✅ Features

- ✅ ESP32 camera uploads images
- ✅ Python server receives and processes images
- ✅ Node.js backend stores and manages images
- ✅ Frontend displays image gallery
- ✅ User authentication for image access
- ✅ Admin can delete images
- ✅ Both servers can work independently or together
- ✅ Shared photo directory for compatibility

## 📝 API Endpoints

### Python Server
- `POST /upload` - Upload image from ESP32
- `GET /last` - Get latest image
- `GET /health` - Health check
- `GET /images` - List all images
- `GET /images/:filename` - Get specific image

### Node.js Backend
- `POST /api/images/upload` - Upload image
- `GET /api/images` - List all images (auth required)
- `GET /api/images/latest` - Get latest image (auth required)
- `GET /api/images/:filename` - Get specific image (auth required)
- `DELETE /api/images/:filename` - Delete image (admin only)

## 🎓 Next Steps

1. **Update ESP32 Code:**
   - See `ESP32_SETUP.md` for detailed instructions
   - Update WiFi credentials
   - Update server URL

2. **Configure Servers:**
   - Set up `.env` file for Node.js
   - Configure Python server environment variables
   - Start both servers

3. **Test Integration:**
   - Upload code to ESP32
   - Check server logs for incoming images
   - View images on frontend website

4. **Deploy:**
   - Set up production environment
   - Configure proper security
   - Set up SSL/HTTPS for external access

## 🆘 Troubleshooting

See individual documentation files:
- `QUICK_START.md` - Common issues and solutions
- `INTEGRATION.md` - Integration troubleshooting
- `ESP32_SETUP.md` - ESP32 connection issues

## 📚 Documentation Files

- `README.md` - Complete backend documentation
- `SETUP.md` - Detailed setup guide
- `QUICK_START.md` - Quick start instructions
- `INTEGRATION.md` - Integration guide
- `ESP32_SETUP.md` - ESP32 camera setup
- `INTEGRATION_SUMMARY.md` - This file

All files are now integrated and working together! 🎉

