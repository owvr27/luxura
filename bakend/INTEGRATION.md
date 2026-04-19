# ESP32 Camera & Image Integration Guide

This guide explains how to integrate the ESP32 camera with the Luxora Environmental backend.

## Architecture

```
ESP32 Camera → Node.js Backend (Port 4000) → Frontend Website
```

The ESP32 camera sends images directly to the Node.js backend, which stores them and makes them available to the frontend.

## Backend Setup

The Node.js backend now includes image upload endpoints:

- `POST /api/images/upload` - Upload image from ESP32 (no auth required)
- `GET /api/images` - List all images (requires authentication)
- `GET /api/images/latest` - Get latest image (requires authentication)
- `GET /api/images/:filename` - Get specific image (requires authentication)
- `DELETE /api/images/:filename` - Delete image (admin only)

Images are stored in the `backend/photos/` directory.

## ESP32 Code Configuration

Update your ESP32 code to point to the Node.js backend:

### Option 1: Direct Connection (Same Network)

```cpp
// Update this line in your ESP32 code:
const char* uploadUrl = "http://YOUR_SERVER_IP:4000/api/images/upload";
```

Replace `YOUR_SERVER_IP` with your computer's local IP address (e.g., `192.168.1.100`).

### Option 2: Using ngrok (External Access)

1. Install ngrok: https://ngrok.com/
2. Start ngrok tunnel:
   ```bash
   ngrok http 4000
   ```
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. Update ESP32 code:
   ```cpp
   const char* uploadUrl = "https://abc123.ngrok.io/api/images/upload";
   ```

### Updated ESP32 Code

Here's the key part to update in your ESP32 code:

```cpp
// ===== UPLOAD URL =====
// Point to your Node.js backend
const char* uploadUrl = "http://YOUR_SERVER_IP:4000/api/images/upload";

// In the loop() function, update the HTTP request:
HTTPClient http;
http.begin(uploadUrl);  // No need for SSL if using HTTP

// Remove the Authorization header (not needed for Node.js backend)
// http.addHeader("Authorization", authHeaderValue);  // Remove this line

http.addHeader("Content-Type", "image/jpeg");

// Send POST request
int response = http.POST(fb->buf, fb->len);
```

## Python Server (Alternative/Backup)

The Python Flask server (`server.py`) can still be used as a backup or for testing:

1. Install Flask:
   ```bash
   pip install flask
   ```

2. Run the Python server:
   ```bash
   python server.py
   ```

3. The Python server runs on port 5000 and provides:
   - `POST /upload` - Upload image
   - `GET /last` - Get latest image

**Note:** The Node.js backend is the recommended solution as it integrates with the main API and authentication system.

## Frontend Access

1. Log in to the website
2. Navigate to "الصور" (Images) in the navigation menu
3. View all uploaded images from ESP32 cameras

## Testing

### Test Image Upload (using curl)

```bash
# Upload a test image
curl -X POST http://localhost:4000/api/images/upload \
  -H "Content-Type: image/jpeg" \
  --data-binary @test-image.jpg
```

### Test Image List (requires authentication)

```bash
# Get your token from login
TOKEN="your-jwt-token-here"

# List all images
curl http://localhost:4000/api/images \
  -H "Authorization: Bearer $TOKEN"
```

## Troubleshooting

### ESP32 Can't Connect
- Check that the backend server is running on port 4000
- Verify the IP address/URL is correct
- Check firewall settings
- For HTTPS, ensure the ESP32 has proper SSL certificates

### Images Not Appearing
- Check backend logs for upload errors
- Verify the `photos/` directory exists and is writable
- Check authentication token is valid
- Verify CORS settings allow your frontend origin

### Python Server Conflicts
- Make sure only one server is running on a port
- Node.js backend uses port 4000
- Python server uses port 5000
- Update ESP32 code to point to the correct server

## Security Notes

- Image upload endpoint (`/api/images/upload`) is currently open (no auth)
- Consider adding API key authentication for ESP32 devices
- Image viewing endpoints require user authentication
- Admin can delete images through the API

