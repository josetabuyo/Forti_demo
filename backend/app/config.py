from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Forti API"
    environment: str = "development"
    database_url: str = "sqlite:///./forti.db"
    app_password: str = "forti2026"
    secret_key: str = "change-me-in-production"
    token_expire_hours: int = 24

    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
