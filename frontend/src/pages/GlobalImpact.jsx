import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Globe, Users } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const mockFeed = [
  { id: 1, school: "EcoTwin São Paulo", action: "Shared AC optimization blueprint, dropping energy use by 15%.", time: "2 mins ago" },
  { id: 2, school: "EcoTwin Tokyo", action: "Earned 500 Carbon Credits for 7 consecutive days of low energy.", time: "15 mins ago" },
  { id: 3, school: "EcoTwin London", action: "Upgraded IoT firmware to monitor humidity and prevent mold.", time: "1 hour ago" },
  { id: 4, school: "EcoTwin New York", action: "Students published a guide on natural ventilation.", time: "3 hours ago" }
];

function GlobalImpact({ theme }) {
  const [globalCredits, setGlobalCredits] = useState(14520.5);

  const isLight = theme === 'light';

  const markers = [
    { name: "EcoTwin London", coordinates: [-0.1276, 51.5072], color: isLight ? "#3C6E71" : "#38bdf8" },
    { name: "EcoTwin Tokyo", coordinates: [139.6917, 35.6895], color: isLight ? "#4A7C59" : "#34d399" },
    { name: "EcoTwin São Paulo", coordinates: [-46.6333, -23.5505], color: isLight ? "#C08457" : "#fbbf24" },
    { name: "EcoTwin New York", coordinates: [-74.006, 40.7128], color: isLight ? "#9C3848" : "#f87171" }
  ];

  // Animate global credits to make it look alive
  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalCredits(prev => prev + (Math.random() * 2));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="global-credits-banner">
        <div className="global-banner-title">Total Network Micro-Carbon Credits</div>
        <div className="global-banner-value">{globalCredits.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
      </div>

      <div className="global-grid">
        <div className="glass-panel">
          <div className="panel-header">
            <Globe size={24} color="var(--accent-success)" />
            Live Global Network
          </div>
          <div className="map-container">
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 120 }}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isLight ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.05)"}
                      stroke={isLight ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"}
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: isLight ? "rgba(60, 110, 113, 0.2)" : "rgba(56, 189, 248, 0.1)", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>
              
              {markers.map(({ name, coordinates, color }) => (
                <Marker key={name} coordinates={coordinates}>
                  <circle r={6} fill={color} stroke={isLight ? "#F7F5F0" : "#fff"} strokeWidth={2} />
                  <text
                    textAnchor="middle"
                    y={-15}
                    style={{ fontFamily: "Inter", fill: isLight ? "#2C2621" : "#fff", fontSize: "10px", fontWeight: 500 }}
                  >
                    {name}
                  </text>
                  {/* Ripple effect */}
                  <circle r={14} fill="none" stroke={color} strokeWidth={1}>
                    <animate attributeName="r" values="6; 20" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1; 0" dur="2s" repeatCount="indefinite" />
                  </circle>
                </Marker>
              ))}
            </ComposableMap>
          </div>
        </div>

        <div className="glass-panel">
          <div className="panel-header">
            <Users size={24} color="var(--accent-secondary)" />
            Live Global Feed
          </div>
          <div className="feed-list">
            {mockFeed.map(item => (
              <div key={item.id} className="feed-item">
                <div className="feed-meta">
                  <span style={{color: 'var(--accent-primary)', fontWeight: 600}}>{item.school}</span>
                  <span>{item.time}</span>
                </div>
                <div className="feed-title">{item.action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlobalImpact;
