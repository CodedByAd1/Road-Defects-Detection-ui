"""
Example Flask backend for Edge YOLO Road Defect Detection
This is a template to help you integrate your Edge YOLO model with the web application.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
import time
from PIL import Image
import numpy as np
import cv2
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS for development

# Mock model class - replace with your actual Edge YOLO model
class MockEdgeYOLOModel:
    def __init__(self):
        self.model_name = "edge-yolo-road-defects"
        self.version = "1.0.0"
        self.classes = ["pothole", "crack", "other"]
        
    def predict(self, image):
        """
        Mock prediction - replace this with your actual Edge YOLO inference
        """
        # Simulate processing time
        time.sleep(1)
        
        # Mock detections - replace with actual model predictions
        detections = [
            {
                "id": str(uuid.uuid4()),
                "type": "pothole",
                "confidence": 0.95,
                "bbox": {"x": 100, "y": 150, "width": 200, "height": 100},
                "severity": "high"
            },
            {
                "id": str(uuid.uuid4()),
                "type": "crack",
                "confidence": 0.87,
                "bbox": {"x": 300, "y": 200, "width": 150, "height": 50},
                "severity": "medium"
            }
        ]
        
        return detections, 0.92  # detections, model_confidence

# Initialize model
model = MockEdgeYOLOModel()

def draw_detections(image, detections):
    """
    Draw bounding boxes and labels on the image
    """
    img = image.copy()
    
    for detection in detections:
        bbox = detection["bbox"]
        x, y, w, h = bbox["x"], bbox["y"], bbox["width"], bbox["height"]
        
        # Choose color based on type
        if detection["type"] == "pothole":
            color = (0, 0, 255)  # Red for potholes
        elif detection["type"] == "crack":
            color = (0, 165, 255)  # Orange for cracks
        else:
            color = (128, 128, 128)  # Gray for others
        
        # Draw bounding box
        cv2.rectangle(img, (x, y), (x + w, y + h), color, 2)
        
        # Draw label
        label = f"{detection['type']} ({detection['confidence']:.2f})"
        cv2.putText(img, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
    
    return img

def image_to_base64(image):
    """
    Convert PIL image to base64 string
    """
    buffer = io.BytesIO()
    image.save(buffer, format='JPEG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return f"data:image/jpeg;base64,{img_str}"

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": True
    })

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get model information"""
    return jsonify({
        "model_name": model.model_name,
        "version": model.version,
        "classes": model.classes
    })

@app.route('/detect', methods=['POST'])
def detect_defects():
    """Main detection endpoint"""
    try:
        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({
                "success": False,
                "error": "No image file provided"
            }), 400
        
        file = request.files['image']
        
        # Validate file type
        if not file.content_type.startswith('image/'):
            return jsonify({
                "success": False,
                "error": "Invalid file type. Please upload an image."
            }), 415
        
        # Read and process image
        image_data = file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to OpenCV format for processing
        opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Record start time
        start_time = time.time()
        
        # Run detection (replace with your actual Edge YOLO model)
        detections, model_confidence = model.predict(opencv_image)
        
        # Calculate processing time
        processing_time = int((time.time() - start_time) * 1000)
        
        # Draw detections on image
        processed_image = draw_detections(opencv_image, detections)
        
        # Convert back to PIL and then to base64
        processed_pil = Image.fromarray(cv2.cvtColor(processed_image, cv2.COLOR_BGR2RGB))
        original_base64 = image_to_base64(image)
        processed_base64 = image_to_base64(processed_pil)
        
        # Prepare response
        response_data = {
            "originalImage": original_base64,
            "processedImage": processed_base64,
            "detections": detections,
            "processingTime": processing_time,
            "modelConfidence": model_confidence
        }
        
        return jsonify({
            "success": True,
            "data": response_data
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Detection failed: {str(e)}"
        }), 500

if __name__ == '__main__':
    print("Starting Road Defect Detection Backend...")
    print("Model loaded successfully!")
    print("API endpoints:")
    print("  - GET  /health")
    print("  - GET  /model-info")
    print("  - POST /detect")
    print("\nServer running on http://localhost:8000")
    
    app.run(host='0.0.0.0', port=8000, debug=True) 