import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Zap, Thermometer, Droplets, Bot, Activity } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

function Dashboard({ theme }) {
  const [data, setData] = useState([]);
  const [insight, setInsight] = useState("Waiting for AI Tutor to analyze data...");
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/sensor-data/latest?limit=20`);
        const json = await res.json();
        setData(json.reverse());

        const insightRes = await fetch(`${API_BASE}/ai-tutor/insights`);
        const insightJson = await insightRes.json();
        setInsight(insightJson.insight);

        if (json.length > 0) {
          const avgEnergy = json.reduce((sum, d) => sum + d.energy_kwh, 0) / json.length;
          if (avgEnergy < 12) {
            setCredits(prev => prev + 0.1);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const latestData = data.length > 0 ? data[data.length - 1] : { energy_kwh: 0, temperature: 0, humidity: 0 };

  const isLight = theme === 'light';
  
  const chartColors = {
    energy: isLight ? '#D97757' : '#fbbf24',
    temp: isLight ? '#9C3848' : '#f87171',
    text: isLight ? '#6A6059' : '#94a3b8',
    grid: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'
  };

  return (
    <div className="dashboard-grid">
      <div className="glass-panel">
        <div className="panel-header">
          <Activity size={24} color="var(--accent-primary)" />
          Classroom Environmental Telemetry
        </div>
        
        <div className="metrics-grid">
          <div className="metric-card energy">
            <div className="metric-title"><Zap size={16} color="var(--accent-warning)"/> Energy Usage</div>
            <div className="metric-value">{latestData.energy_kwh.toFixed(1)} <span style={{fontSize: '1rem', color: 'var(--text-muted)'}}>kWh</span></div>
          </div>
          
          <div className="metric-card temp">
            <div className="metric-title"><Thermometer size={16} color="var(--accent-danger)"/> Temperature</div>
            <div className="metric-value">{latestData.temperature.toFixed(1)} <span style={{fontSize: '1rem', color: 'var(--text-muted)'}}>°C</span></div>
          </div>
          
          <div className="metric-card humidity">
            <div className="metric-title"><Droplets size={16} color="var(--accent-primary)"/> Humidity</div>
            <div className="metric-value">{latestData.humidity.toFixed(1)} <span style={{fontSize: '1rem', color: 'var(--text-muted)'}}>%</span></div>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                stroke={chartColors.text} 
                tick={{fill: chartColors.text, fontSize: 12}}
              />
              <YAxis yAxisId="left" stroke={chartColors.text} tick={{fill: chartColors.text, fontSize: 12}} />
              <YAxis yAxisId="right" orientation="right" stroke={chartColors.text} tick={{fill: chartColors.text, fontSize: 12}} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)', 
                  border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
                labelFormatter={(label) => new Date(label).toLocaleTimeString()}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="energy_kwh" name="Energy (kWh)" stroke={chartColors.energy} strokeWidth={3} dot={false} activeDot={{r: 8}} />
              <Line yAxisId="right" type="monotone" dataKey="temperature" name="Temp (°C)" stroke={chartColors.temp} strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel ai-tutor">
        <div className="panel-header">
          <Bot size={24} color="var(--accent-secondary)" />
          AI Climate Tutor
        </div>
        
        <div className="ai-avatar-container">
          <div className="ai-avatar">🤖</div>
          <div>
            <div style={{fontWeight: 600, fontSize: '1.1rem'}}>EcoBot</div>
            <div style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Your personal climate guide</div>
          </div>
        </div>
        
        <div className="ai-message-bubble" key={insight}>
          {insight}
        </div>

        <div className="carbon-credits">
          <div className="credits-label">Earned Micro-Carbon Credits</div>
          <div className="credits-value">{credits.toFixed(1)} 🌍</div>
          <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>
            Credits earned by keeping energy usage low!
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
