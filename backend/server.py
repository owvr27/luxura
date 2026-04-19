"""
Luxora Environmental - Python Image Server
This server can work standalone or forward images to the Node.js backend.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Configuration
PHOTOS_DIR = "photos"
NODEJS_BACKEND_URL = os.getenv("NODEJS_BACKEND_URL", "http://localhost:4000")
FORWARD_TO_NODEJS = os.getenv("FORWARD_TO_NODEJS", "true").lower() == "true"

# Create folder if not exists
if not os.path.exists(PHOTOS_DIR):
    os.makedirs(PHOTOS_DIR)
    print(f"✅ Created photos directory: {PHOTOS_DIR}")

# Store last image in memory for quick access
last_image = None
last_image_filename = None


@app.route("/upload", methods=["POST"])
def upload_image():
    """Upload image from ESP32 camera"""
    global last_image, last_image_filename

    try:
        # Get raw binary data from ESP32
        img_bytes = request.data
        
        if not img_bytes or len(img_bytes) == 0:
            return jsonify({"status": "ERROR", "error": "No image data provided"}), 400

        # Save to folder with timestamp
        filename = f"photo_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        filepath = os.path.join(PHOTOS_DIR, filename)

        # Save locally
        with open(filepath, "wb") as f:
            f.write(img_bytes)
        
        # Store in memory
        last_image = img_bytes
        last_image_filename = filename

        print(f"✅ Image saved locally: {filepath} ({len(img_bytes)} bytes)")

        # Forward to Node.js backend if enabled
        if FORWARD_TO_NODEJS:
            try:
                nodejs_url = f"{NODEJS_BACKEND_URL}/api/images/upload"
                response = requests.post(
                    nodejs_url,
                    data=img_bytes,
                    headers={"Content-Type": "image/jpeg"},
                    timeout=5
                )
                if response.status_code == 200:
                    print(f"✅ Image forwarded to Node.js backend: {nodejs_url}")
                else:
                    print(f"⚠️  Node.js backend returned status {response.status_code}")
            except requests.exceptions.RequestException as e:
                print(f"⚠️  Failed to forward to Node.js backend: {e}")
                print("   Image saved locally only")

        return jsonify({
            "status": "OK",
            "file": filename,
            "size": len(img_bytes),
            "forwarded": FORWARD_TO_NODEJS
        })
    
    except Exception as e:
        print(f"❌ Upload error: {e}")
        return jsonify({"status": "ERROR", "error": str(e)}), 500


@app.route("/last", methods=["GET"])
def get_last_image():
    """Get the latest uploaded image"""
    if last_image is None:
        return jsonify({"error": "No image yet"}), 404
    
    return last_image, 200, {"Content-Type": "image/jpeg"}


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "luxora-image-server"
    })


@app.route("/auth/register", methods=["POST"])
def register():
    """Mock registration endpoint"""
    data = request.get_json()
    print(f"Register request: {data}")
    
    return jsonify({
        "success": True,
        "message": "User registered successfully",
        "data": {
            "user": {
                "id": "1",
                "name": data.get("name", "Test User"),
                "email": data.get("email", "test@example.com"),
                "role": "user"
            },
            "token": "mock-jwt-token-12345"
        }
    })


@app.route("/auth/login", methods=["POST"])
def login():
    """Mock login endpoint"""
    data = request.get_json()
    print(f"Login request: {data}")
    
    return jsonify({
        "success": True,
        "message": "Login successful",
        "data": {
            "user": {
                "id": "1",
                "name": "Test User",
                "email": data.get("email", "test@example.com"),
                "role": "user",
                "points": 500
            },
            "token": "mock-jwt-token-12345"
        }
    })

@app.route("/rewards", methods=["GET"])
def get_rewards():
    """Mock rewards endpoint"""
    rewards = [
        {
            "id": "1",
            "title": "Coffee Shop Voucher",
            "pointsRequired": 100,
            "availability": "In Stock",
            "description": "Free coffee at participating shops"
        },
        {
            "id": "2", 
            "title": "Eco Water Bottle",
            "pointsRequired": 250,
            "availability": "In Stock",
            "description": "Reusable stainless steel bottle"
        },
        {
            "id": "3",
            "title": "Tree Planting Certificate",
            "pointsRequired": 500,
            "availability": "In Stock", 
            "description": "Contribute to reforestation"
        }
    ]
    return jsonify(rewards)

@app.route("/bins", methods=["GET"])
def get_bins():
    """Mock smart bins endpoint"""
    bins = [
        {
            "id": "BIN001",
            "name": "Luxora Bin - Riyadh Downtown",
            "location": "Riyadh, Olaya Street",
            "latitude": 24.7136,
            "longitude": 46.6753,
            "status": "active",
            "fillLevel": 65,
            "lastUpdated": "2024-04-19T01:30:00Z",
            "type": "recycling"
        },
        {
            "id": "BIN002", 
            "name": "Luxora Bin - Kingdom Tower",
            "location": "Riyadh, Kingdom Tower Area",
            "latitude": 24.7114,
            "longitude": 46.6747,
            "status": "active",
            "fillLevel": 42,
            "lastUpdated": "2024-04-19T01:25:00Z",
            "type": "recycling"
        },
        {
            "id": "BIN003",
            "name": "Luxora Bin - Granada Mall",
            "location": "Riyadh, Granada Mall",
            "latitude": 24.7246,
            "longitude": 46.6885,
            "status": "maintenance",
            "fillLevel": 89,
            "lastUpdated": "2024-04-19T01:20:00Z",
            "type": "recycling"
        }
    ]
    return jsonify(bins)

@app.route("/wallet", methods=["GET"])
def get_wallet():
    """Mock wallet endpoint"""
    return jsonify({
        "balance": 500,
        "transactions": [
            {
                "id": "TXN001",
                "type": "earned",
                "amount": 70,
                "description": "QR Scan - Plastic Recycling",
                "date": "2024-04-19T01:15:00Z"
            },
            {
                "id": "TXN002", 
                "type": "earned",
                "amount": 25,
                "description": "Daily Login Bonus",
                "date": "2024-04-18T08:00:00Z"
            }
        ]
    })

@app.route("/redeem", methods=["GET"])
def get_redeem():
    """Mock redeem endpoint"""
    return jsonify({
        "history": [
            {
                "id": "RDM001",
                "reward": "Coffee Shop Voucher",
                "points": 100,
                "date": "2024-04-15T10:30:00Z",
                "status": "completed"
            }
        ]
    })

@app.route("/dashboard", methods=["GET"])
def get_dashboard():
    """Mock dashboard endpoint"""
    return jsonify({
        "stats": {
            "totalPoints": 500,
            "itemsRecycled": 23,
            "co2Saved": 45.6,
            "treesEquivalent": 3
        },
        "recentActivity": [
            {
                "type": "scan",
                "description": "QR Code Scanned",
                "points": 70,
                "date": "2024-04-19T01:15:00Z"
            },
            {
                "type": "login",
                "description": "Daily Login",
                "points": 25,
                "date": "2024-04-18T08:00:00Z"
            }
        ]
    })


@app.route("/images", methods=["GET"])
def list_images():
    """List all uploaded images (compatible with Node.js API)"""
    try:
        if not os.path.exists(PHOTOS_DIR):
            return jsonify({"images": [], "count": 0})
        
        files = [f for f in os.listdir(PHOTOS_DIR) 
                if f.lower().endswith(('.jpg', '.jpeg'))]
        
        image_files = [
            {
                "filename": file,
                "url": f"/images/{file}",
                "uploadedAt": file.replace("photo_", "").replace(".jpg", "")
            }
            for file in sorted(files, reverse=True)  # Newest first
        ]
        
        return jsonify({
            "images": image_files,
            "count": len(image_files)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/images/<filename>", methods=["GET"])
def get_image(filename):
    """Get specific image by filename"""
    # Security: prevent directory traversal
    if ".." in filename or "/" in filename or "\\" in filename:
        return jsonify({"error": "Invalid filename"}), 400
    
    filepath = os.path.join(PHOTOS_DIR, filename)
    
    if not os.path.exists(filepath):
        return jsonify({"error": "Image not found"}), 404
    
    try:
        with open(filepath, "rb") as f:
            image_data = f.read()
        return image_data, 200, {"Content-Type": "image/jpeg"}
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("\n" + "="*50)
    print("🚀 Luxora Environmental - Python Image Server")
    print("="*50)
    print(f"📁 Photos directory: {PHOTOS_DIR}")
    print(f"🔄 Forwarding to Node.js: {FORWARD_TO_NODEJS}")
    if FORWARD_TO_NODEJS:
        print(f"🔗 Node.js URL: {NODEJS_BACKEND_URL}")
    print(f"🌐 Server running on http://0.0.0.0:5000")
    print("="*50 + "\n")
    
    app.run(host="0.0.0.0", port=5000, debug=True)
