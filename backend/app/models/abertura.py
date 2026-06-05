from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Abertura(SQLModel, table=True):
    __tablename__ = "aberturas"

    id: Optional[int] = Field(default=None, primary_key=True)
    obra_id: int = Field(foreign_key="obras.id", index=True)
    denominacion: str = Field(index=True)
    ubicacion: Optional[str] = Field(default=None)
    local: Optional[str] = Field(default=None)
    linea: Optional[str] = Field(default=None)
    tipo_abertura: Optional[str] = Field(default=None)
    vidrio: Optional[str] = Field(default=None)
    mosquitero: Optional[str] = Field(default=None)
    mano: Optional[str] = Field(default=None)
    suplemento_lateral: Optional[float] = Field(default=None)
    suplemento_superior: Optional[float] = Field(default=None)
    tapajuntas: Optional[bool] = Field(default=None)
    manija: Optional[str] = Field(default=None)
    altura_manija: Optional[float] = Field(default=None)
    umbral: Optional[str] = Field(default=None)
    observaciones: Optional[str] = Field(default=None)
    cantidad: int = Field(default=1)
    ancho_fab: Optional[float] = Field(default=None)
    alto_fab: Optional[float] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
