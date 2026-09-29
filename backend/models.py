from sqlalchemy import Column, Integer, Float, String, DateTime
from database import Base
import datetime

class SensorData(Base):
    __tablename__ = "sensor_data"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(String, index=True)
    temperature = Column(Float)
    humidity = Column(Float)
    energy_kwh = Column(Float)
