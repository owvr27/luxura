"""
Simple AI Server for Luxora Environmental
Handles image upload, classification, and web interface
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

# Configuration
PHOTOS_DIR = "photos"
CLASSIFICATIONS_DIR = "classifications"

# Create directories
for directory in [PHOTOS_DIR, CLASSIFICATIONS_DIR]:
    if not os.path.exists(directory):
        os.makedirs(directory)

# In-memory storage
classifications = []
last_classification = None

def classify_image(image_path):
    """Mock AI classification function"""
    categories = [
        {"category": "plastic", "confidence": 0.85, "points": 25, "description": "Plastic bottles"},
        {"category": "paper", "confidence": 0.70, "points": 15, "description": "Paper and cardboard"},
        {"category": "metal", "confidence": 0.60, "points": 20, "description": "Metal cans"},
        {"category": "glass", "confidence": 0.45, "points": 18, "description": "Glass containers"},
        {"category": "organic", "confidence": 0.30, "points": 10, "description": "Organic waste"}
    ]
    
    # Select top category (mock AI result)
    top_category = categories[0]
    
    return {
        "image_path": image_path,
        "classification": top_category,
        "timestamp": datetime.now().isoformat(),
        "success": True
    }

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "simple-ai-server",
        "timestamp": datetime.now().isoformat()
    })

@app.route("/upload", methods=["POST"])
def upload_and_classify():
    """Upload image and classify it"""
    global last_classification, classifications
    
    try:
        # Get image data
        img_data = request.data
        if not img_data:
            return jsonify({"status": "ERROR", "error": "No image data"}), 400
        
        # Save image
        filename = f"photo_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        filepath = os.path.join(PHOTOS_DIR, filename)
        
        with open(filepath, "wb") as f:
            f.write(img_data)
        
        print(f"✅ Image saved: {filepath}")
        
        # Classify with AI
        classification_result = classify_image(filepath)
        
        # Store classification
        last_classification = classification_result
        classifications.append(classification_result)
        
        # Keep only last 50
        if len(classifications) > 50:
            classifications[:] = classifications[-50:]
        
        print(f"🤖 AI Classification: {classification_result['classification']['category']}")
        print(f"💎 Points earned: {classification_result['classification']['points']}")
        
        return jsonify({
            "status": "OK",
            "file": filename,
            "classification": classification_result,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"status": "ERROR", "error": str(e)}), 500

@app.route("/classifications", methods=["GET"])
def get_classifications():
    """Get all classification results"""
    total_points = sum(c.get("classification", {}).get("points", 0) for c in classifications)
    
    return jsonify({
        "classifications": classifications,
        "total_count": len(classifications),
        "total_points": total_points,
        "timestamp": datetime.now().isoformat()
    })

@app.route("/stats", methods=["GET"])
def get_stats():
    """Get statistics"""
    if not classifications:
        return jsonify({
            "total_images": 0,
            "total_points": 0,
            "categories": {},
            "average_confidence": 0,
            "success_rate": 0
        })
    
    total_images = len(classifications)
    total_points = sum(c.get("classification", {}).get("points", 0) for c in classifications)
    
    # Category breakdown
    categories = {}
    confidences = []
    
    for c in classifications:
        if c.get("success"):
            cat = c["classification"]["category"]
            points = c["classification"]["points"]
            conf = c["classification"]["confidence"]
            
            if cat not in categories:
                categories[cat] = {"count": 0, "points": 0}
            categories[cat]["count"] += 1
            categories[cat]["points"] += points
            confidences.append(conf)
    
    avg_confidence = sum(confidences) / len(confidences) if confidences else 0
    success_rate = 100  # All mock classifications succeed
    
    return jsonify({
        "total_images": total_images,
        "total_points": total_points,
        "categories": categories,
        "average_confidence": round(avg_confidence, 2),
        "success_rate": success_rate,
        "timestamp": datetime.now().isoformat()
    })

@app.route("/last/classification", methods=["GET"])
def get_last_classification():
    """Get latest classification"""
    if last_classification is None:
        return jsonify({"error": "No classification yet"}), 404
    return jsonify(last_classification)

@app.route("/auth/register", methods=["POST"])
def register():
    """Mock auth endpoint"""
    data = request.get_json()
    return jsonify({
        "success": True,
        "message": "User registered successfully",
        "data": {
            "user": {
                "id": "1",
                "name": data.get("name", "Test User"),
                "email": data.get("email", "test@example.com"),
                "role": "user",
                "points": 500
            },
            "token": "mock-jwt-token-12345"
        }
    })

@app.route("/auth/login", methods=["POST"])
def login():
    """Mock auth endpoint"""
    data = request.get_json()
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
        {"id": "1", "title": "Coffee Shop Voucher", "pointsRequired": 100, "availability": "In Stock"},
        {"id": "2", "title": "Eco Water Bottle", "pointsRequired": 250, "availability": "In Stock"},
        {"id": "3", "title": "Tree Planting Certificate", "pointsRequired": 500, "availability": "In Stock"}
    ]
    return jsonify(rewards)

if __name__ == "__main__":
    print("\n" + "="*50)
    print("🚀 Luxora Environmental - Simple AI Server")
    print("="*50)
    print(f"📁 Photos: {PHOTOS_DIR}")
    print(f"🤖 AI Classification: Active")
    print(f"🌐 Server: http://0.0.0.0:5000")
    print("="*50 + "\n")
    
    app.run(host="0.0.0.0", port=5000, debug=True)
