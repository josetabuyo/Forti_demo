from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel

from app.models.obra import EstadoObra


class ObraCreate(BaseModel):
    nombre: str
    direccion: str
    cliente: str
    presupuesto_nro: str
    telefono: Optional[str] = None
    email: Optional[str] = None
    tratamiento: Optional[str] = None
    linea: Optional[str] = None
    notas: Optional[str] = None
    estado: EstadoObra = EstadoObra.CARGADA
    fecha: date


class ObraUpdate(BaseModel):
    nombre: Optional[str] = None
    direccion: Optional[str] = None
    cliente: Optional[str] = None
    presupuesto_nro: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    tratamiento: Optional[str] = None
    linea: Optional[str] = None
    notas: Optional[str] = None
    estado: Optional[EstadoObra] = None
    fecha: Optional[date] = None


class ObraListItem(BaseModel):
    id: int
    nombre: str
    cliente: str
    estado: EstadoObra
    fecha: date
    cantidad_aberturas: int

    model_config = {"from_attributes": True}


class ObraRead(BaseModel):
    id: int
    nombre: str
    direccion: str
    cliente: str
    presupuesto_nro: str
    telefono: Optional[str] = None
    email: Optional[str] = None
    tratamiento: Optional[str] = None
    linea: Optional[str] = None
    notas: Optional[str] = None
    estado: EstadoObra
    fecha: date
    created_at: datetime

    model_config = {"from_attributes": True}
