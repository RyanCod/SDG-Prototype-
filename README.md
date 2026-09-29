# EcoTwin K-12: Digital Twin SDG 13 Hackathon Prototype

A fully functional software prototype that simulates IoT hardware, stores data, visualizes it in real-time, and integrates an AI tutor to teach K-12 students about climate action (SDG 13).

## Architecture

1. **Hardware Simulator**: A Python script (`simulator.py`) simulating Arduino sensor data (AC Energy Usage, Temp, Humidity).
2. **Backend**: A FastAPI server (`main.py`) with a SQLite database (`digital_twin.db`) acting as the middleware.
3. **Frontend**: A React/Vite dashboard (`App.jsx`) with real-time visualization and an AI Tutor panel.

## How to Run

You will need three terminal windows to run the full stack simultaneously.

### 1. Start the Backend

```bash
cd "yourfilelocation\backend"
pip install -r requirements.txt
python main.py
```
*The backend will run on `http://localhost:8000`. It will automatically create the `digital_twin.db` database.*

### 2. Start the Hardware Simulator

```bash
cd "yourfilelocation\simulator"
pip install -r requirements.txt
python simulator.py
```
*The simulator will start sending realistic, fluctuating IoT data to the backend every 5 seconds.*

### 3. Start the Frontend Dashboard

```bash
cd "yourfilelocation\frontend"
npm install
npm run dev
```
*Open the provided local URL (usually `http://localhost:5173`) in your browser to view the Digital Twin dashboard.*

## Features Implemented
- **Premium Design**: Dark mode glassmorphism UI with vibrant colors (blue, green, amber, red).
- **Live Telemetry**: Real-time line charts using Recharts rendering live data from the backend.
- **AI Tutor Engine**: Backend mock for an AI API that analyzes data trends and generates K-12 friendly insights.
- **Micro-Carbon Credits**: A gamified counter that increments when energy usage is kept low.
