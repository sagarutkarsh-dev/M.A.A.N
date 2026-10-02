from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.core.config import settings
from app.core.database import init_db
from app.api.v1.api import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure upload directories exist and DB tables are created
    upload_path = Path(settings.UPLOAD_DIR)
    upload_path.mkdir(parents=True, exist_ok=True)
    await init_db()
    yield
    # Shutdown logic if needed

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Statutory Regulatory Operating System for the Legal Metrology Act, 2009 & General Rules, 2011.",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local hackathon & mobile development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads static directory for photo retrieval
uploads_path = Path(settings.UPLOAD_DIR)
uploads_path.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_path)), name="uploads")

# Include API routers (both at /api/v1 and root for direct client access)
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(api_router)


@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": "M.A.A.N. FastAPI Core",
        "version": settings.VERSION,
        "database": settings.DATABASE_URL.split("://")[0],
    }

@app.get("/", tags=["System"])
async def root():
    return {
        "title": "M.A.A.N. (मान) - Metrological Assurance, Authentication & Network",
        "docs": "/docs",
        "health": "/health",
        "api_v1": settings.API_V1_STR,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
