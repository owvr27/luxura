# Quick Start Guide - Luxora Environmental Backend

## 🚀 Start Everything at Once

### Windows:
```bash
# Double-click or run:
start-servers.bat
```

### Mac/Linux:
```bash
chmod +x start-servers.sh
./start-servers.sh
```

This will start both:
- Node.js Backend on port 4000
- Python Image Server on port 5000

## 📋 Manual Setup

### 1. Install Dependencies

**Node.js Backend:**
```bash
npm install
```

**Python Server:**
```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Create `.env` file in `backend/` directory:
```env
PORT=4000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:3000
```

### 3. Set Up Database
```bash
npm run prisma:gen
npm run prisma:migrate
```

### 4. Start Servers

**Terminal 1 - Node.js Backend:**
```bash
npm run dev
```

**Terminal 2 - Python Server:**
```bash
python server.py
```

## 🔧 Python Server Configuration

The Python server can work in two modes:

### Mode 1: Forward to Node.js (Default)
Set environment variable:
```bash
FORWARD_TO_NODEJS=true
NODEJS_BACKEND_URL=http://localhost:4000
```

Images will be:
- Saved locally in `photos/` folder
- Forwarded to Node.js backend
- Available on both servers

### Mode 2: Standalone
Set environment variable:
```bash
FORWARD_TO_NODEJS=false
```

Images will be:
- Saved locally in `photos/` folder
- Available only on Python server

## 📸 ESP32 Camera Setup

1. Update ESP32 code with your server URL
2. See `ESP32_SETUP.md` for detailed instructions
3. Upload code to ESP32
4. Images will appear on the website!

## ✅ Verify Installation

1. **Check Node.js Backend:**
   - Open: http://localhost:4000
   - Should see API information

2. **Check Python Server:**
   - Open: http://localhost:5000/health
   - Should see health status

3. **Check Frontend:**
   - Open: http://localhost:3000
   - Log in and go to "الصور" (Images) page

## 🎯 What Works Together

- ✅ ESP32 camera uploads images
- ✅ Python server receives and forwards images
- ✅ Node.js backend stores images in database
- ✅ Frontend displays images in gallery
- ✅ Users can view/manage images
- ✅ Admin can delete images

## 📚 Documentation

- `README.md` - Full documentation
- `SETUP.md` - Detailed setup instructions
- `INTEGRATION.md` - Integration guide
- `ESP32_SETUP.md` - ESP32 camera setup

## 🆘 Troubleshooting

### Port Already in Use
- Change port in `.env` (Node.js) or `server.py` (Python)
- Update frontend `NEXT_PUBLIC_API_URL` if needed

### Images Not Appearing
- Check both servers are running
- Verify `photos/` directory exists
- Check server logs for errors
- Ensure authentication token is valid

### ESP32 Can't Connect
- Verify server IP address
- Check firewall settings
- Ensure servers are running
- Check WiFi connection on ESP32

