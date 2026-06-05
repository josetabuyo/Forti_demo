from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel


class EstadoObra(str, Enum):
    CARGADA = "CARGADA"
    MATERIAL_PEDIDO = "MATERIAL_PEDIDO"
    PRODUCCION = "PRODUCCION"
    CORTE = "CORTE"
    ENTREGADA = "ENTREGADA"


class Obra(SQLModel, table=True):
    __tablename__ = "obras"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True)
    direccion: str
    cliente: str = Field(index=True)
    presupuesto_nro: str
    telefono: Optional[str] = Field(default=None)
    email: Optional[str] = Field(default=None)
    tratamiento: Optional[str] = Field(default=None)
    linea: Optional[str] = Field(default=None)
    notas: Optional[str] = Field(default=None)
    estado: EstadoObra = Field(default=EstadoObra.CARGADA, index=True)
    fecha: date
    created_at: datetime = Field(default_factory=datetime.utcnow)
