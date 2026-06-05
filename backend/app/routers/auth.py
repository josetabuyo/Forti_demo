from __future__ import annotations

from datetime import datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, status
from jose import JWTError, jwt
from pydantic import BaseModel

from app.config import Settings, get_settings

router = APIRouter(prefix="/auth", tags=["auth"])

ALGORITHM = "HS256"


class LoginRequest(BaseModel):
    password: str


class LoginResponse(BaseModel):
    token: str


def _create_token(settings: Settings) -> str:
    expire = datetime.utcnow() + timedelta(hours=settings.token_expire_hours)
    payload = {"sub": "forti-user", "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)


@router.post("/login", response_model=LoginResponse)
def login(
    body: LoginRequest,
    settings: Annotated[Settings, Depends(get_settings)],
) -> LoginResponse:
    if body.password != settings.app_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Contraseña incorrecta",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return LoginResponse(token=_create_token(settings))


def get_current_user(
    settings: Annotated[Settings, Depends(get_settings)],
    authorization: Annotated[str | None, Header()] = None,
) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Falta el encabezado de autorización",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = authorization.split(" ", 1)[1].strip()
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        sub: str | None = payload.get("sub")
        if sub is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return sub
