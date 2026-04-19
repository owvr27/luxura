# ESP32 Camera Setup Guide for Luxora Environmental

## Quick Setup

Update your ESP32 code to connect to the backend server.

## Option 1: Connect to Node.js Backend (Recommended)

The Node.js backend handles everything including authentication and image management.

### For Local Network:
```cpp
// Update this line in your ESP32 code:
const char* uploadUrl = "http://YOUR_SERVER_IP:4000/api/images/upload";
```

Replace `YOUR_SERVER_IP` with your computer's local IP (e.g., `192.168.1.100`).

### For External Access (ngrok):
1. Install ngrok: https://ngrok.com/
2. Start tunnel: `ngrok http 4000`
3. Update ESP32 code:
```cpp
const char* uploadUrl = "https://YOUR_NGROK_URL/api/images/upload";
```

### Updated ESP32 Code (Node.js):
```cpp
// Remove SSL if using HTTP
WiFiClient client;  // Use WiFiClient instead of WiFiClientSecure
HTTPClient http;
http.begin(client, uploadUrl);

// Remove Authorization header (not needed)
http.addHeader("Content-Type", "image/jpeg");

int response = http.POST(fb->buf, fb->len);
```

## Option 2: Connect to Python Server

The Python server can work standalone or forward to Node.js.

### For Local Network:
```cpp
const char* uploadUrl = "http://YOUR_SERVER_IP:5000/upload";
```

### Updated ESP32 Code (Python):
```cpp
WiFiClient client;
HTTPClient http;
http.begin(client, uploadUrl);

// Remove Authorization header
http.addHeader("Content-Type", "image/jpeg");

int response = http.POST(fb->buf, fb->len);
```

## Complete ESP32 Code Template

Here's a complete template you can use:

```cpp
#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h>

// ===== WIFI CONFIGURATION =====
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// ===== SERVER CONFIGURATION =====
// Option 1: Node.js Backend (Recommended)
const char* uploadUrl = "http://YOUR_SERVER_IP:4000/api/images/upload";

// Option 2: Python Server
// const char* uploadUrl = "http://YOUR_SERVER_IP:5000/upload";

// ===== CAMERA PINS (ESP32 WROVER KIT) =====
#define PWDN_GPIO_NUM     -1
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      21
#define SIOD_GPIO_NUM      26
#define SIOC_GPIO_NUM      27
#define Y9_GPIO_NUM        35
#define Y8_GPIO_NUM        34
#define Y7_GPIO_NUM        39
#define Y6_GPIO_NUM        36
#define Y5_GPIO_NUM        19
#define Y4_GPIO_NUM        18
#define Y3_GPIO_NUM         5
#define Y2_GPIO_NUM         4
#define VSYNC_GPIO_NUM     25
#define HREF_GPIO_NUM      23
#define PCLK_GPIO_NUM      22

void setup() {
  Serial.begin(115200);
  Serial.println("🚀 Luxora Environmental - ESP32 Camera");
  Serial.println("Booting...");

  // ===== CAMERA CONFIG =====
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_QVGA;
  config.jpeg_quality = 12;
  config.fb_count = 1;

  if (esp_camera_init(&config) != ESP_OK) {
    Serial.println("❌ Camera init failed!");
    return;
  }
  Serial.println("✅ Camera started.");

  // ===== WIFI =====
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(400);
  }
  Serial.println("\n✅ WiFi connected");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  Serial.println("📸 Capturing image...");
  camera_fb_t *fb = esp_camera_fb_get();

  if (!fb) {
    Serial.println("❌ Capture failed");
    delay(2000);
    return;
  }

  Serial.printf("Image size: %d bytes\n", fb->len);

  // ===== HTTP REQUEST =====
  WiFiClient client;
  HTTPClient http;
  
  if (!http.begin(client, uploadUrl)) {
    Serial.println("❌ Failed to connect to server");
    esp_camera_fb_return(fb);
    delay(5000);
    return;
  }

  http.addHeader("Content-Type", "image/jpeg");

  // Send POST request
  int httpResponseCode = http.POST(fb->buf, fb->len);

  Serial.print("Server Response: ");
  Serial.println(httpResponseCode);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Response: " + response);
    Serial.println("✅ Image uploaded successfully!");
  } else {
    Serial.println("❌ Failed to upload image");
    Serial.print("Error: ");
    Serial.println(http.errorToString(httpResponseCode));
  }

  http.end();
  esp_camera_fb_return(fb);

  delay(5000); // Wait 5 seconds before next photo
}
```

## Finding Your Server IP Address

### Windows:
```cmd
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

### Mac/Linux:
```bash
ifconfig
# or
ip addr
```

## Testing

1. Upload the code to your ESP32
2. Open Serial Monitor (115200 baud)
3. Watch for connection messages
4. Check the backend server logs for incoming images
5. View images on the website at `/images` page

## Troubleshooting

### ESP32 Can't Connect
- Verify WiFi credentials are correct
- Check server IP address is correct
- Ensure server is running
- Check firewall settings

### Images Not Appearing
- Check server logs for errors
- Verify photos directory exists
- Check CORS settings
- Ensure authentication token is valid (for viewing)

### SSL/HTTPS Issues
- Use HTTP for local network (faster, simpler)
- For HTTPS, ensure proper certificates
- Consider using ngrok for external access

## Next Steps

1. Update WiFi credentials in ESP32 code
2. Update server URL to match your setup
3. Upload code to ESP32
4. Start backend servers
5. View images on the website!

