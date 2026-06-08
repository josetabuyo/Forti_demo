from __future__ import annotations

from functools import lru_cache

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Forti API"
    environment: str = "development"

    # Vercel Postgres provee POSTGRES_URL; localmente usamos DATABASE_URL o SQLite.
    database_url: str = ""
    postgres_url: str = ""  # inyectado automáticamente por Vercel Postgres

    app_password: str = "forti2026"
    secret_key: str = "change-me-in-production"
    token_expire_hours: int = 24

    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    cors_extra_origins: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @model_validator(mode="after")
    def resolve_database_url(self) -> "Settings":
        if not self.database_url:
            self.database_url = self.postgres_url or "sqlite:///./forti.db"
        # SQLAlchemy requiere postgresql:// en lugar del postgres:// que usa Vercel
        if self.database_url.startswith("postgres://"):
            self.database_url = self.database_url.replace("postgres://", "postgresql://", 1)
        return self

    def all_cors_origins(self) -> list[str]:
        extra = [o.strip() for o in self.cors_extra_origins.split(",") if o.strip()]
        return self.cors_origins + extra


@lru_cache
def get_settings() -> Settings:
    return Settings()
