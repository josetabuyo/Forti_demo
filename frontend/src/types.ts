export type EstadoObra = 'CARGADA' | 'MATERIAL_PEDIDO' | 'PRODUCCION' | 'CORTE' | 'ENTREGADA';

export interface Obra {
  id: number;
  nombre: string;
  direccion: string;
  cliente: string;
  presupuesto_nro: string;
  telefono?: string;
  email?: string;
  tratamiento?: string;
  linea?: string;
  notas?: string;
  estado: EstadoObra;
  fecha: string;
  created_at: string;
  aberturas?: Abertura[];
  abertura_count?: number;
}

export interface Abertura {
  id: number;
  obra_id: number;
  denominacion: string;
  ubicacion?: string;
  local?: string;
  linea?: string;
  tipo_abertura?: string;
  vidrio?: string;
  mosquitero?: string;
  mano?: string;
  suplemento_lateral?: number;
  suplemento_superior?: number;
  tapajuntas?: boolean;
  manija?: string;
  altura_manija?: number;
  umbral?: string;
  observaciones?: string;
  cantidad: number;
  ancho_fab?: number;
  alto_fab?: number;
  created_at: string;
}
