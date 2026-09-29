import React, { Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Cpu } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D Model Error:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function ErrorFallback() {
  return (
    <mesh>
      <boxGeometry args={[3, 0.5, 2]} />
      <meshStandardMaterial color="var(--accent-danger)" wireframe={true} />
    </mesh>
  );
}

function ArduinoModel() {
  const { scene } = useGLTF('/arduino.glb');
  if (!scene) return null;
  return <primitive object={scene} scale={2} />;
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="var(--accent-primary)" wireframe={true} />
    </mesh>
  );
}

function HardwareHub() {
  return (
    <div className="dashboard-grid">
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="panel-header">
          <Cpu size={24} color="var(--accent-primary)" />
          Interactive 3D Hardware Model
        </div>
        <div style={{ flex: 1, minHeight: '400px', background: 'rgba(128,128,128,0.1)', borderRadius: '12px' }}>
          <ErrorBoundary fallback={
            <Canvas camera={{ position: [0, 5, 5], fov: 50 }}>
              <ambientLight intensity={1} />
              <ErrorFallback />
              <OrbitControls enableZoom={true} autoRotate={true} autoRotateSpeed={2} />
            </Canvas>
          }>
            <Suspense fallback={
              <Canvas camera={{ position: [0, 5, 5], fov: 50 }}>
                 <ambientLight intensity={1} />
                 <Loader />
                 <OrbitControls enableZoom={true} autoRotate={true} autoRotateSpeed={2} />
              </Canvas>
            }>
              <Canvas camera={{ position: [0, 5, 5], fov: 50 }}>
                <ambientLight intensity={1} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                <ArduinoModel />
                <OrbitControls enableZoom={true} autoRotate={true} autoRotateSpeed={2} />
              </Canvas>
            </Suspense>
          </ErrorBoundary>
        </div>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Drag to rotate. Scroll to zoom.
        </p>
      </div>

      <div className="glass-panel">
        <div className="panel-header">
          Arduino Setup Guide
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          Follow these simple steps to wire your temperature and humidity sensor (DHT11) to the Arduino UNO!
        </p>
        
        <ul className="setup-guide-list">
          <li className="setup-step">
            <div className="step-title">Connect Power (VCC)</div>
            <div className="step-desc">Connect the positive pin on the sensor to the <strong>5V</strong> pin on your Arduino using a red jumper wire.</div>
          </li>
          <li className="setup-step">
            <div className="step-title">Connect Ground (GND)</div>
            <div className="step-desc">Connect the negative pin on the sensor to any <strong>GND</strong> pin on your Arduino using a black jumper wire.</div>
          </li>
          <li className="setup-step">
            <div className="step-title">Connect Data Signal</div>
            <div className="step-desc">Connect the data pin to digital pin <strong>D2</strong> on the Arduino. This is where the magic happens!</div>
          </li>
          <li className="setup-step">
            <div className="step-title">Upload the Code</div>
            <div className="step-desc">Plug the Arduino into your computer via USB and upload the provided IoT sketch to start streaming data.</div>
          </li>
        </ul>

        <div className="code-block-wrapper">
<pre><code>{`#include <DHT.h>
#define DHTPIN 2     
#define DHTTYPE DHT11   
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  Serial.println("EcoTwin Node Initialized.");
}

void loop() {
  delay(5000);
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from sensor!");
    return;
  }
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.print(" °C  |  Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");
}`}</code></pre>
        </div>
      </div>
    </div>
  );
}

export default HardwareHub;
