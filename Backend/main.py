from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.gemini import router as gemini_router
from routes.elevenlabs import router as elevenlabs_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gemini_router, prefix="/api/gemini")
app.include_router(elevenlabs_router, prefix="/api/speak")

@app.get("/")
def root():
    return {"status": "Finance API is running"}