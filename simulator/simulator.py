import time
import random
import requests
import json
from datetime import datetime

# The URL of the backend API
API_URL = "http://localhost:8000/api/sensor-data"

def generate_sensor_data():
    """Generates realistic-looking fluctuating data for a school's trial wing."""
    # Base values
    base_temp = 22.0
    base_humidity = 45.0
    base_energy = 10.5
    
    # Add some random noise
    temp = base_temp + random.uniform(-2.0, 3.0)
    humidity = base_humidity + random.uniform(-10.0, 15.0)
    
    # Energy spikes occasionally (e.g. AC turning on)
    if random.random() > 0.8:
        energy = base_energy + random.uniform(5.0, 15.0) # Spike
    else:
        energy = base_energy + random.uniform(-1.0, 2.0)
        
    return {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "temperature": round(temp, 2),
        "humidity": round(humidity, 2),
        "energy_kwh": round(energy, 2)
    }

def main():
    print("Starting Hardware Simulator (Digital Twin K-12 Project)")
    print(f"Sending data to {API_URL} every 5 seconds...\n")
    
    while True:
        data = generate_sensor_data()
        try:
            response = requests.post(API_URL, json=data)
            if response.status_code == 200 or response.status_code == 201:
                print(f"[SUCCESS] Sent: {json.dumps(data)}")
            else:
                print(f"[ERROR] Failed to send data. Status Code: {response.status_code}")
                print(f"Response: {response.text}")
        except requests.exceptions.ConnectionError:
            print(f"[WARNING] Connection refused. Is the backend running at {API_URL}?")
        except Exception as e:
            print(f"[ERROR] An unexpected error occurred: {e}")
            
        time.sleep(5)

if __name__ == "__main__":
    main()
