from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models
import database
import json
import random

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Digital Twin SDG 13 API")

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models for request/response validation
class SensorDataCreate(BaseModel):
    timestamp: str
    temperature: float
    humidity: float
    energy_kwh: float

class SensorDataResponse(SensorDataCreate):
    id: int
    class Config:
        from_attributes = True

@app.post("/api/sensor-data", response_model=SensorDataResponse)
def create_sensor_data(data: SensorDataCreate, db: Session = Depends(get_db)):
    db_data = models.SensorData(**data.dict())
    db.add(db_data)
    db.commit()
    db.refresh(db_data)
    return db_data

@app.get("/api/sensor-data/latest", response_model=list[SensorDataResponse])
def get_latest_data(limit: int = 10, db: Session = Depends(get_db)):
    return db.query(models.SensorData).order_by(models.SensorData.id.desc()).limit(limit).all()

@app.get("/api/ai-tutor/insights")
def get_ai_insights(db: Session = Depends(get_db)):
    # Get latest data to analyze
    latest = db.query(models.SensorData).order_by(models.SensorData.id.desc()).limit(5).all()
    if not latest:
        return {"insight": "We don't have enough data yet to provide insights. Waiting for sensors to boot up..."}
    
    # Calculate some basic metrics
    avg_energy = sum([d.energy_kwh for d in latest]) / len(latest)
    
    # Mock AI response logic for prototype
    # In a real app, you would pass this data to Gemini or another LLM API
    insights = [
        f"Wow! The average energy use over the last few moments was {avg_energy:.2f} kWh.",
        "Did you know? Lowering the AC by just 1 degree can save up to 3% in energy!",
        "If you turn off the AC when not needed, you could earn 5 Micro-Carbon Credits today!",
        "It's a bit warm today. Consider opening windows instead of running the AC to reduce emissions."
    ]
    
    if avg_energy > 15:
        insight = "🚨 High Energy Alert! The AC is working overtime. Let's see if we can raise the temperature setting to save energy."
    elif avg_energy > 10:
        insight = "The energy usage is moderate. " + random.choice(insights)
    else:
        insight = "Great job! The energy usage is very low right now. You're being a true climate hero! 🌍"
        
    return {
        "insight": insight,
        "metrics_analyzed": len(latest)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
