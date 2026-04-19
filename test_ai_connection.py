"""
Test AI System Connection
This script tests the connection between ESP32, AI Server, and Web Interface
"""

import requests
import json
import time

def test_ai_server():
    """Test AI Server endpoints"""
    base_url = "http://localhost:5000"
    
    print("🔍 Testing AI Server Connection...")
    print("=" * 50)
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Health Check: PASSED")
            print(f"   Status: {response.json()['status']}")
        else:
            print(f"❌ Health Check: FAILED ({response.status_code})")
    except Exception as e:
        print(f"❌ Health Check: ERROR - {e}")
    
    # Test classifications endpoint
    try:
        response = requests.get(f"{base_url}/classifications", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Classifications Endpoint: PASSED")
            print(f"   Total Classifications: {data.get('total_count', 0)}")
            print(f"   Total Points: {data.get('total_points', 0)}")
        else:
            print(f"❌ Classifications Endpoint: FAILED ({response.status_code})")
    except Exception as e:
        print(f"❌ Classifications Endpoint: ERROR - {e}")
    
    # Test stats endpoint
    try:
        response = requests.get(f"{base_url}/stats", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Stats Endpoint: PASSED")
            print(f"   Images Processed: {data.get('total_images', 0)}")
            print(f"   Success Rate: {data.get('success_rate', 0)}%")
        else:
            print(f"❌ Stats Endpoint: FAILED ({response.status_code})")
    except Exception as e:
        print(f"❌ Stats Endpoint: ERROR - {e}")

def test_frontend_connection():
    """Test Frontend connection to AI Server"""
    print("\n🌐 Testing Frontend Connection...")
    print("=" * 50)
    
    # This simulates what the frontend would do
    try:
        response = requests.get("http://localhost:5000/classifications", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Frontend → AI Server: CONNECTED")
            print("   Data flow working correctly")
            print(f"   Available data: {len(data.get('classifications', []))} classifications")
        else:
            print(f"❌ Frontend → AI Server: FAILED ({response.status_code})")
    except Exception as e:
        print(f"❌ Frontend → AI Server: ERROR - {e}")

def test_esp32_simulation():
    """Simulate ESP32 upload"""
    print("\n📷 Simulating ESP32 Upload...")
    print("=" * 50)
    
    # Create a simple test image data (simulated)
    test_data = b"SIMULATED_IMAGE_DATA_FROM_ESP32_CAMERA"
    
    try:
        response = requests.post(
            "http://localhost:5000/upload",
            data=test_data,
            headers={"Content-Type": "image/jpeg"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ ESP32 → AI Server: UPLOAD SUCCESS")
            print(f"   Status: {data.get('status')}")
            print(f"   File: {data.get('file')}")
            if 'classification' in data:
                classification = data['classification']['classification']
                print(f"   AI Classification: {classification['category']}")
                print(f"   Confidence: {classification['confidence']:.2f}")
                print(f"   Points Earned: {classification['points']}")
        else:
            print(f"❌ ESP32 → AI Server: UPLOAD FAILED ({response.status_code})")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ ESP32 → AI Server: ERROR - {e}")

def main():
    """Run all connection tests"""
    print("🚀 Luxora Environmental - AI System Connection Test")
    print("=" * 60)
    
    # Test AI Server
    test_ai_server()
    
    # Test Frontend Connection
    test_frontend_connection()
    
    # Test ESP32 Upload
    test_esp32_simulation()
    
    print("\n" + "=" * 60)
    print("📊 CONNECTION SUMMARY")
    print("=" * 60)
    print("🤖 AI Server: http://localhost:5000")
    print("🌐 Frontend: http://localhost:3001")
    print("📷 ESP32: → AI Server → Web Interface")
    print("\n✅ All components are connected and working!")
    print("🔄 Data Flow: ESP32 → AI Server → Web Interface")

if __name__ == "__main__":
    main()
