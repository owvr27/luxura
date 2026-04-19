"""
Luxora Environmental - AI-Powered Image Server
This server receives images from ESP32, classifies them using AI, and serves results to web interface.
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from datetime import datetime
import base64
import sys
import traceback

# Import the AI classifier
sys.path.append('..')
try:
    from ai_classifier import classify_uploaded_image, get_all_classifications, get_total_points
except ImportError:
    print("Warning: ai_classifier not found, using mock classification")
    # Mock classification function
    def classify_uploaded_image(image_path):
        return {
            "image_path": image_path,
            "classification": {
                "category": "plastic",
                "confidence": 0.85,
                "description": "Plastic bottles and containers",
                "points": 25,
                "recyclable": True
            },
            "all_classifications": [],
            "timestamp": "2024-04-19T02:00:00",
            "success": True
        }
    
    def get_all_classifications():
        return []
    
    def get_total_points():
        return 0

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Configuration
PHOTOS_DIR = "photos"
AI_CLASSIFICATION_DIR = "classifications"

# Create directories if not exist
for directory in [PHOTOS_DIR, AI_CLASSIFICATION_DIR]:
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"✅ Created directory: {directory}")

# Store last image and classification in memory
last_image = None
last_classification = None
classification_history = []

@app.route("/upload", methods=["POST"])
def upload_and_classify_image():
    """Upload image, classify with AI, and return results"""
    global last_image, last_classification, classification_history
    
    try:
        # Get raw binary data from ESP32
        img_bytes = request.data
        
        if not img_bytes or len(img_bytes) == 0:
            return jsonify({"status": "ERROR", "error": "No image data provided"}), 400

        # Save to folder with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"photo_{timestamp}.jpg"
        filepath = os.path.join(PHOTOS_DIR, filename)

        # Save locally
        with open(filepath, "wb") as f:
            f.write(img_bytes)
        
        # Store in memory
        last_image = img_bytes
        
        print(f"✅ Image saved: {filepath} ({len(img_bytes)} bytes)")
        
        # Classify with AI
        print("🤖 Starting AI classification...")
        classification_result = classify_uploaded_image(filepath)
        
        # Save classification result
        classification_filename = f"classification_{timestamp}.json"
        classification_filepath = os.path.join(AI_CLASSIFICATION_DIR, classification_filename)
        
        with open(classification_filepath, "w") as f:
            json.dump(classification_result, f, indent=2)
        
        # Update memory
        last_classification = classification_result
        classification_history.append(classification_result)
        
        # Keep only last 50 classifications in memory
        if len(classification_history) > 50:
            classification_history = classification_history[-50:]
        
        print(f"✅ AI Classification complete: {classification_result['classification']['category']}")
        print(f"📊 Confidence: {classification_result['classification']['confidence']:.2f}")
        print(f"💎 Points earned: {classification_result['classification']['points']}")
        
        return jsonify({
            "status": "OK",
            "file": filename,
            "size": len(img_bytes),
            "classification": classification_result,
            "timestamp": datetime.now().isoformat()
        })
    
    except Exception as e:
        print(f"❌ Upload/Classification error: {e}")
        print(traceback.format_exc())
        return jsonify({
            "status": "ERROR", 
            "error": str(e)
        }), 500

@app.route("/last", methods=["GET"])
def get_last_image():
    """Get latest uploaded image"""
    if last_image is None:
        return jsonify({"error": "No image yet"}), 404
    
    return last_image, 200, {"Content-Type": "image/jpeg"}

@app.route("/last/classification", methods=["GET"])
def get_last_classification():
    """Get latest AI classification result"""
    if last_classification is None:
        return jsonify({"error": "No classification yet"}), 404
    
    return jsonify(last_classification)

@app.route("/classifications", methods=["GET"])
def get_all_classifications_endpoint():
    """Get all AI classification results"""
    try:
        # Load from memory
        if classification_history:
            return jsonify({
                "classifications": classification_history,
                "total_count": len(classification_history),
                "total_points": sum(c.get("classification", {}).get("points", 0) for c in classification_history),
                "timestamp": datetime.now().isoformat()
            })
        
        # Load from files if memory is empty
        classifications = []
        total_points = 0
        
        if os.path.exists(AI_CLASSIFICATION_DIR):
            for filename in os.listdir(AI_CLASSIFICATION_DIR):
                if filename.endswith('.json'):
                    filepath = os.path.join(AI_CLASSIFICATION_DIR, filename)
                    try:
                        with open(filepath, 'r') as f:
                            classification = json.load(f)
                            classifications.append(classification)
                            total_points += classification.get("classification", {}).get("points", 0)
                    except Exception as e:
                        print(f"Error loading classification {filename}: {e}")
        
        return jsonify({
            "classifications": classifications,
            "total_count": len(classifications),
            "total_points": total_points,
            "timestamp": datetime.now().isoformat()
        })
    
    except Exception as e:
        print(f"Error fetching classifications: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/stats", methods=["GET"])
def get_ai_stats():
    """Get AI classification statistics"""
    try:
        if not classification_history:
            return jsonify({
                "total_images": 0,
                "total_points": 0,
                "categories": {},
                "average_confidence": 0,
                "success_rate": 0
            })
        
        # Calculate statistics
        total_images = len(classification_history)
        total_points = sum(c.get("classification", {}).get("points", 0) for c in classification_history)
        
        # Category breakdown
        categories = {}
        confidences = []
        
        for classification in classification_history:
            if classification.get("success"):
                cat = classification["classification"]["category"]
                points = classification["classification"]["points"]
                conf = classification["classification"]["confidence"]
                
                categories[cat] = categories.get(cat, {"count": 0, "points": 0})
                categories[cat]["count"] += 1
                categories[cat]["points"] += points
                confidences.append(conf)
        
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0
        success_rate = sum(1 for c in classification_history if c.get("success")) / total_images * 100
        
        return jsonify({
            "total_images": total_images,
            "total_points": total_points,
            "categories": categories,
            "average_confidence": round(avg_confidence, 2),
            "success_rate": round(success_rate, 2),
            "timestamp": datetime.now().isoformat()
        })
    
    except Exception as e:
        print(f"Error calculating stats: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "luxora-ai-server",
        "features": {
            "image_upload": True,
            "ai_classification": True,
            "classification_history": True,
            "statistics": True
        },
        "timestamp": datetime.now().isoformat()
    })

@app.route("/images", methods=["GET"])
def list_images():
    """List all uploaded images"""
    try:
        if not os.path.exists(PHOTOS_DIR):
            return jsonify({"images": [], "count": 0})
        
        files = [f for f in os.listdir(PHOTOS_DIR) 
                if f.lower().endswith(('.jpg', '.jpeg'))]
        
        image_files = [
            {
                "filename": file,
                "url": f"/images/{file}",
                "uploadedAt": file.replace("photo_", "").replace(".jpg", ""),
                "classification": f"/classifications/classification_{file.replace('photo_', '').replace('.jpg', '')}.json"
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
    print("\n" + "="*60)
    print("🚀 Luxora Environmental - AI-Powered Image Server")
    print("="*60)
    print(f"📁 Photos directory: {PHOTOS_DIR}")
    print(f"🤖 AI Classifications directory: {AI_CLASSIFICATION_DIR}")
    print(f"🌐 Server running on http://0.0.0.0:5000")
    print("="*60 + "\n")
    
    app.run(host="0.0.0.0", port=5000, debug=True)
