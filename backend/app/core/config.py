from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "M.A.A.N. Legal Metrology Regulatory Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    # Defaults to SQLite for immediate zero-config development, with full PostgreSQL/PostGIS support
    DATABASE_URL: str = f"sqlite+aiosqlite:///{BASE_DIR}/maan.db"
    
    # Uploads
    UPLOAD_DIR: str = str(BASE_DIR / "uploads")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        case_sensitive=True,
        extra="allow"
    )

settings = Settings()
