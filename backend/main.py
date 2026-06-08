from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_db
from app.routers import auth, obras, aberturas


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        description="Forti — Back-office para fabricación de aberturas de aluminio y PVC.",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins(),
        allow_origin_regex=r"(http://(localhost|127\.0\.0\.1)(:\d+)?|https://[a-z0-9-]+\.vercel\.app)",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/", tags=["health"])
    def root() -> dict:
        return {"name": "Forti", "status": "ok"}

    @app.get("/health", tags=["health"])
    def health() -> dict:
        return {"status": "ok"}

    app.include_router(auth.router)
    app.include_router(obras.router)
    app.include_router(aberturas.router)
    return app


app = create_app()
