import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../api';
import type { Obra, EstadoObra } from '../types';

const ESTADO_LABELS: Record<EstadoObra, string> = {
  CARGADA: 'Cargada',
  MATERIAL_PEDIDO: 'Mat. Pedido',
  PRODUCCION: 'Producción',
  CORTE: 'Corte',
  ENTREGADA: 'Entregada',
};

function EstadoBadge({ estado }: { estado: EstadoObra }) {
  return (
    <span className={`badge badge-${estado.toLowerCase()}`}>
      {ESTADO_LABELS[estado]}
    </span>
  );
}

function formatFecha(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function Obras() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet<Obra[]>('/obras')
      .then(setObras)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-page">
        <span className="spinner" />
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Obras</h1>
          <p className="page-subtitle">{obras.length} {obras.length === 1 ? 'obra registrada' : 'obras registradas'}</p>
        </div>
        <Link to="/obras/nueva" className="btn btn-primary">
          + Nueva Obra
        </Link>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <div className="table-wrap">
          {obras.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏗</div>
              <div className="empty-title">Sin obras registradas</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Creá la primera obra para comenzar
              </div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cliente</th>
                  <th>Presupuesto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th style={{ textAlign: 'center' }}>Aberturas</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {obras.map(obra => (
                  <tr key={obra.id}>
                    <td>
                      <Link to={`/obras/${obra.id}`} className="link-cell">
                        {obra.nombre}
                      </Link>
                      {obra.direccion && (
                        <div className="td-muted" style={{ marginTop: 1 }}>
                          {obra.direccion}
                        </div>
                      )}
                    </td>
                    <td>{obra.cliente}</td>
                    <td className="td-mono">{obra.presupuesto_nro || '—'}</td>
                    <td>
                      <EstadoBadge estado={obra.estado} />
                    </td>
                    <td className="td-muted">{formatFecha(obra.fecha)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="count-chip">
                        {obra.abertura_count ?? obra.aberturas?.length ?? 0}
                      </span>
                    </td>
                    <td>
                      <div className="td-actions">
                        <Link to={`/obras/${obra.id}`} className="btn btn-ghost btn-sm">
                          Ver
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
