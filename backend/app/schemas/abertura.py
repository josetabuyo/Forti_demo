from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class AberturaCreate(BaseModel):
    denominacion: str
    ubicacion: Optional[str] = None
    local: Optional[str] = None
    linea: Optional[str] = None
    tipo_abertura: Optional[str] = None
    vidrio: Optional[str] = None
    mosquitero: Optional[str] = None
    mano: Optional[str] = None
    suplemento_lateral: Optional[float] = None
    suplemento_superior: Optional[float] = None
    tapajuntas: Optional[bool] = None
    manija: Optional[str] = None
    altura_manija: Optional[float] = None
    umbral: Optional[str] = None
    observaciones: Optional[str] = None
    cantidad: int = 1
    ancho_fab: Optional[float] = None
    alto_fab: Optional[float] = None


class AberturaUpdate(BaseModel):
    denominacion: Optional[str] = None
    ubicacion: Optional[str] = None
    local: Optional[str] = None
    linea: Optional[str] = None
    tipo_abertura: Optional[str] = None
    vidrio: Optional[str] = None
    mosquitero: Optional[str] = None
    mano: Optional[str] = None
    suplemento_lateral: Optional[float] = None
    suplemento_superior: Optional[float] = None
    tapajuntas: Optional[bool] = None
    manija: Optional[str] = None
    altura_manija: Optional[float] = None
    umbral: Optional[str] = None
    observaciones: Optional[str] = None
    cantidad: Optional[int] = None
    ancho_fab: Optional[float] = None
    alto_fab: Optional[float] = None


class AberturaRead(BaseModel):
    id: int
    obra_id: int
    denominacion: str
    ubicacion: Optional[str] = None
    local: Optional[str] = None
    linea: Optional[str] = None
    tipo_abertura: Optional[str] = None
    vidrio: Optional[str] = None
    mosquitero: Optional[str] = None
    mano: Optional[str] = None
    suplemento_lateral: Optional[float] = None
    suplemento_superior: Optional[float] = None
    tapajuntas: Optional[bool] = None
    manija: Optional[str] = None
    altura_manija: Optional[float] = None
    umbral: Optional[str] = None
    observaciones: Optional[str] = None
    cantidad: int
    ancho_fab: Optional[float] = None
    alto_fab: Optional[float] = None
    created_at: datetime

    model_config = {"from_attributes": True}
