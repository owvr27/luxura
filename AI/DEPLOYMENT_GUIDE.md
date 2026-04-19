# Waste Classification Model Deployment Guide

## Quick Deployment Summary

### Final Model Performance
- **Accuracy**: 97.0% (real TrashNet data)
- **Dataset**: 2,500+ real waste images
- **Model Size**: 115MB
- **Inference Time**: ~50ms (CPU)

## Installation & Setup

### 1. Environment Setup
```bash
# Clone or download the project
cd AI/

# Install dependencies
pip install -r requirements.txt

# Install additional dependencies for TrashNet
pip install kagglehub
```

### 2. Dataset Setup
```python
# Download TrashNet dataset
import kagglehub
path = kagglehub.dataset_download("vishwasmishra1234/trash-net")
print("Dataset downloaded to:", path)

# Run integration script
python src/data/trashnet_integration.py
```

### 3. Model Training (Optional)
```bash
# Train with TrashNet data
python src/training/trashnet_train.py

# Or use pre-trained model
# Model available at: models/best_model.h5
```

## Model Usage

### Basic Prediction
```python
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

# Load model
model = load_model('models/best_model.h5')
classes = ['metal', 'paper', 'plastic']

def predict_waste(image_path):
    """Predict waste class from image path"""
    # Load and preprocess image
    img = load_img(image_path, target_size=(224, 224))
    img_array = img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    # Make prediction
    prediction = model.predict(img_array)
    class_idx = np.argmax(prediction)
    confidence = prediction[0][class_idx] * 100
    
    return {
        'class': classes[class_idx],
        'confidence': confidence,
        'probabilities': {
            'metal': prediction[0][0] * 100,
            'paper': prediction[0][1] * 100,
            'plastic': prediction[0][2] * 100
        }
    }

# Example usage
result = predict_waste('test_image.jpg')
print(f"Predicted: {result['class']} with {result['confidence']:.1f}% confidence")
```

### Batch Processing
```python
import os
from pathlib import Path

def predict_directory(directory_path):
    """Predict all images in a directory"""
    results = []
    image_dir = Path(directory_path)
    
    for image_path in image_dir.glob("*.jpg"):
        try:
            result = predict_waste(str(image_path))
            result['filename'] = image_path.name
            results.append(result)
        except Exception as e:
            print(f"Error processing {image_path}: {e}")
    
    return results

# Example usage
results = predict_directory('test_images/')
for result in results:
    print(f"{result['filename']}: {result['class']} ({result['confidence']:.1f}%)")
```

## Production Deployment

### Web API (Flask Example)
```python
from flask import Flask, request, jsonify
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import io
from PIL import Image

app = Flask(__name__)

# Load model
model = load_model('models/best_model.h5')
classes = ['metal', 'paper', 'plastic']

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get image from request
        file = request.files['image']
        img_bytes = file.read()
        
        # Process image
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        img = img.resize((224, 224))
        img_array = img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Make prediction
        prediction = model.predict(img_array)
        class_idx = np.argmax(prediction)
        confidence = prediction[0][class_idx] * 100
        
        return jsonify({
            'class': classes[class_idx],
            'confidence': confidence,
            'probabilities': {
                'metal': float(prediction[0][0] * 100),
                'paper': float(prediction[0][1] * 100),
                'plastic': float(prediction[0][2] * 100)
            }
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  waste-classifier:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - ./models:/app/models
    environment:
      - MODEL_PATH=models/best_model.h5
```

## Performance Optimization

### GPU Acceleration
```python
# Check GPU availability
import tensorflow as tf
print("GPU Available: ", tf.config.list_physical_devices('GPU'))

# Enable GPU memory growth
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    try:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
    except RuntimeError as e:
        print(e)
```

### Model Optimization
```python
# Convert to TensorFlow Lite for mobile/edge deployment
import tensorflow as tf

converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

# Save TFLite model
with open('models/waste_classifier.tflite', 'wb') as f:
    f.write(tflite_model)
```

## Monitoring & Maintenance

### Performance Monitoring
```python
import time
import logging

def monitor_prediction(image_path):
    """Monitor prediction performance"""
    start_time = time.time()
    result = predict_waste(image_path)
    end_time = time.time()
    
    inference_time = (end_time - start_time) * 1000  # ms
    
    logging.info(f"Prediction completed in {inference_time:.1f}ms")
    logging.info(f"Class: {result['class']}, Confidence: {result['confidence']:.1f}%")
    
    return result, inference_time
```

### Model Health Check
```python
def model_health_check():
    """Check model performance with test images"""
    test_results = []
    
    # Use a few test images for health check
    test_images = ['assets/test_images/1.jpg', 'assets/test_images/2.jpg', 'assets/test_images/3.jpg']
    
    for img_path in test_images:
        try:
            result, inference_time = monitor_prediction(img_path)
            test_results.append({
                'image': img_path,
                'prediction': result['class'],
                'confidence': result['confidence'],
                'inference_time': inference_time
            })
        except Exception as e:
            logging.error(f"Health check failed for {img_path}: {e}")
    
    return test_results
```

## Troubleshooting

### Common Issues

1. **Model Loading Errors**
   ```python
   # Ensure model file exists
   import os
   if not os.path.exists('models/best_model.h5'):
       print("Model file not found. Please train the model first.")
   ```

2. **Memory Issues**
   ```python
   # Reduce batch size if memory is limited
   batch_size = 16  # Reduce from 32 if needed
   ```

3. **GPU Not Available**
   ```python
   # Force CPU usage if GPU issues
   import os
   os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
   ```

### Performance Issues

1. **Slow Inference**
   - Use GPU acceleration
   - Optimize model with TFLite
   - Reduce image resolution if acceptable

2. **Low Accuracy**
   - Ensure proper image preprocessing
   - Check image quality and lighting
   - Verify model is using correct weights

## Security Considerations

### Input Validation
```python
def validate_image(image_path):
    """Validate input image"""
    try:
        img = Image.open(image_path)
        
        # Check image format
        if img.format not in ['JPEG', 'PNG', 'JPG']:
            raise ValueError("Unsupported image format")
        
        # Check image size
        if img.size[0] < 100 or img.size[1] < 100:
            raise ValueError("Image too small")
        
        # Check file size (max 10MB)
        file_size = os.path.getsize(image_path)
        if file_size > 10 * 1024 * 1024:
            raise ValueError("File too large")
        
        return True
    
    except Exception as e:
        print(f"Image validation failed: {e}")
        return False
```

### Rate Limiting
```python
from flask import Flask
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)
limiter = Limiter(app, key_func=get_remote_address)

@app.route('/predict', methods=['POST'])
@limiter.limit("10 per minute")
def predict():
    # Your prediction code here
    pass
```

## Scaling Considerations

### Horizontal Scaling
- Load balance across multiple instances
- Use container orchestration (Kubernetes)
- Implement caching for repeated predictions

### Vertical Scaling
- Increase GPU memory for larger batch sizes
- Use more powerful CPUs for faster preprocessing
- Optimize memory usage for concurrent requests

## Maintenance Schedule

### Regular Tasks
- **Daily**: Monitor prediction accuracy and performance
- **Weekly**: Check model drift and retraining needs
- **Monthly**: Update dataset and retrain if accuracy drops
- **Quarterly**: Review and update model architecture

### Model Updates
```python
# Retraining pipeline
def retrain_model():
    """Retrain model with new data"""
    print("Starting model retraining...")
    
    # 1. Collect new training data
    # 2. Preprocess and augment data
    # 3. Train enhanced model
    # 4. Evaluate performance
    # 5. Deploy if accuracy improves
    
    # Run training pipeline
    os.system("python src/training/trashnet_train.py")
    
    print("Model retraining completed")
```

## Support & Contact

### Documentation
- **Technical Documentation**: See `reports/` directory
- **API Documentation**: See inline code comments
- **Architecture Guide**: See `README.md`

### Getting Help
1. Check this deployment guide first
2. Review the comprehensive reports in `reports/`
3. Check the code comments in `src/`
4. Test with provided examples in `assets/test_images/`

---

## Quick Start Checklist

- [ ] Install dependencies (`pip install -r requirements.txt`)
- [ ] Download TrashNet dataset (`python src/data/trashnet_integration.py`)
- [ ] Train model or use pre-trained (`python src/training/trashnet_train.py`)
- [ ] Test with sample images (`python src/evaluation/test_model.py`)
- [ ] Deploy using preferred method (API, web app, etc.)

**Your waste classification model is now ready for production deployment!**
