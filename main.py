from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Mount the static directory
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    
    if not google_maps_api_key:
        raise ValueError("Google Maps API key not found in .env file")
    
    print(f"API Key: {google_maps_api_key[:5]}...") # Print first 5 characters of the key
    
    return templates.TemplateResponse("index.html", {"request": request, "google_maps_api_key": google_maps_api_key})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)