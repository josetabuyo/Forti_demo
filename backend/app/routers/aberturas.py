from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.models.abertura import Abertura
from app.models.obra import Obra
from app.routers.auth import get_current_user
from app.schemas.abertura import AberturaCreate, AberturaRead, AberturaUpdate

router = APIRouter(tags=["aberturas"])


@router.post("/obras/{obra_id}/aberturas", response_model=AberturaRead, status_code=status.HTTP_201_CREATED)
def create_abertura(
    obra_id: int,
    body: AberturaCreate,
    session: Annotated[Session, Depends(get_session)],
    _: Annotated[str, Depends(get_current_user)],
) -> AberturaRead:
    obra = session.get(Obra, obra_id)
    if obra is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Obra no encontrada",
        )
    abertura = Abertura(obra_id=obra_id, **body.model_dump())
    session.add(abertura)
    session.commit()
    session.refresh(abertura)
    return AberturaRead.model_validate(abertura)


@router.get("/aberturas/{abertura_id}", response_model=AberturaRead)
def get_abertura(
    abertura_id: int,
    session: Annotated[Session, Depends(get_session)],
    _: Annotated[str, Depends(get_current_user)],
) -> AberturaRead:
    abertura = session.get(Abertura, abertura_id)
    if abertura is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Abertura no encontrada",
        )
    return AberturaRead.model_validate(abertura)


@router.put("/aberturas/{abertura_id}", response_model=AberturaRead)
def update_abertura(
    abertura_id: int,
    body: AberturaUpdate,
    session: Annotated[Session, Depends(get_session)],
    _: Annotated[str, Depends(get_current_user)],
) -> AberturaRead:
    abertura = session.get(Abertura, abertura_id)
    if abertura is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Abertura no encontrada",
        )
    data = body.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(abertura, field, value)
    session.add(abertura)
    session.commit()
    session.refresh(abertura)
    return AberturaRead.model_validate(abertura)


@router.delete("/aberturas/{abertura_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_abertura(
    abertura_id: int,
    session: Annotated[Session, Depends(get_session)],
    _: Annotated[str, Depends(get_current_user)],
) -> None:
    abertura = session.get(Abertura, abertura_id)
    if abertura is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Abertura no encontrada",
        )
    session.delete(abertura)
    session.commit()
