from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, func, select

from app.database import get_session
from app.models.abertura import Abertura
from app.models.obra import Obra
from app.routers.auth import get_current_user
from app.schemas.abertura import AberturaRead
from app.schemas.obra import ObraCreate, ObraListItem, ObraRead, ObraUpdate

router = APIRouter(prefix="/obras", tags=["obras"])


@router.get("", response_model=list[ObraListItem])
def list_obras(
    session: Annotated[Session, Depends(get_session)],
    _: Annotated[str, Depends(get_current_user)],
) -> list[ObraListItem]:
    obras = session.exec(select(Obra)).all()
    result = []
    for obra in obras:
        count = session.exec(
            select(func.count()).where(Abertura.obra_id == obra.id)
        ).one()
        result.append(
            ObraListItem(
                id=obra.id or 0,
                nombre=obra.nombre,
                cliente=obra.cliente,
                estado=obra.estado,
                fecha=obra.fecha,
                cantidad_aberturas=count,
            )
        )
    return result


@router.post("", response_model=ObraRead, status_code=status.HTTP_201_CREATED)
def create_obra(
    body: ObraCreate,
    session: Annotated[Session, Depends(get_session)],
    _: Annotated[str, Depends(get_current_user)],
) -> ObraRead:
    obra = Obra(**body.model_dump())
    session.add(obra)
    session.commit()
    session.refresh(obra)
    return ObraRead.model_validate(obra)


@router.get("/{obra_id}", response_model=ObraRead)
def get_obra(
    obra_id: int,
    session: Annotated[Session, Depends(get_session)],
    _: Annotated[str, Depends(get_current_user)],
) -> ObraRead:
    obra = session.get(Obra, obra_id)
    if obra is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Obra no encontrada",
        )
    return ObraRead.model_validate(obra)


@router.put("/{obra_id}", response_model=ObraRead)
def update_obra(
    obra_id: int,
    body: ObraUpdate,
    session: Annotated[Session, Depends(get_session)],
    _: Annotated[str, Depends(get_current_user)],
) -> ObraRead:
    obra = session.get(Obra, obra_id)
    if obra is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Obra no encontrada",
        )
    data = body.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(obra, field, value)
    session.add(obra)
    session.commit()
    session.refresh(obra)
    return ObraRead.model_validate(obra)


@router.delete("/{obra_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_obra(
    obra_id: int,
    session: Annotated[Session, Depends(get_session)],
    _: Annotated[str, Depends(get_current_user)],
) -> None:
    obra = session.get(Obra, obra_id)
    if obra is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Obra no encontrada",
        )
    aberturas = session.exec(select(Abertura).where(Abertura.obra_id == obra_id)).all()
    for abertura in aberturas:
        session.delete(abertura)
    session.delete(obra)
    session.commit()


@router.get("/{obra_id}/aberturas", response_model=list[AberturaRead])
def list_aberturas_for_obra(
    obra_id: int,
    session: Annotated[Session, Depends(get_session)],
    _: Annotated[str, Depends(get_current_user)],
) -> list[AberturaRead]:
    obra = session.get(Obra, obra_id)
    if obra is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Obra no encontrada",
        )
    aberturas = session.exec(
        select(Abertura).where(Abertura.obra_id == obra_id)
    ).all()
    return [AberturaRead.model_validate(a) for a in aberturas]
