from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class LocationLog(Base):
    __tablename__ = "location_logs"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(DateTime)
    ip_address = Column(String)
    server_timestamp = Column(DateTime)

Base.metadata.create_all(bind=engine)

class LocationData(BaseModel):
    latitude: float
    longitude: float
    timestamp: str # Expecting ISO 8601 formatted string

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    return templates.TemplateResponse("index.html", {"request": request, "google_maps_api_key": google_maps_api_key})

@app.post("/log-location")
async def log_location(location_data: LocationData, request: Request):
    client_ip = request.client.host
    current_time = datetime.now()

    try:
        parsed_timestamp = datetime.fromisoformat(location_data.timestamp)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid timestamp format. Expected ISO 8601.")
    
    db = SessionLocal()
    try:
        new_log = LocationLog(
            latitude=location_data.latitude,
            longitude=location_data.longitude,
            # timestamp=datetime.fromisoformat(location_data.timestamp),
            timestamp=parsed_timestamp,
            ip_address=client_ip,
            server_timestamp=current_time
        )
        db.add(new_log)
        db.commit()
    finally:
        db.close()
    
    return JSONResponse(content={"message": "Location logged successfully"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
