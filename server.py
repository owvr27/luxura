from flask import Flask, request, jsonify
import os
from datetime import datetime

app = Flask(__name__)

# Create folder if not exists
if not os.path.exists("photos"):
    os.makedirs("photos")

# Optional: store last image in memory
last_image = None

@app.route("/upload", methods=["POST"])
def upload_image():
    global last_image

    # raw binary data from ESP32
    img_bytes = request.data
    last_image = img_bytes   # store in memory

    # Save to folder with timestamp
    filename = f"photo_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
    filepath = os.path.join("photos", filename)

    with open(filepath, "wb") as f:
        f.write(img_bytes)

    print(f"Saved image: {filepath}")

    return jsonify({"status": "OK", "file": filename})
    

@app.route("/last")
def get_last_image():
    if last_image is None:
        return "No image yet", 404

    return last_image, 200, {"Content-Type": "image/jpeg"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)