import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiGet, apiPut, apiDelete } from '../api';
import type { Obra, Abertura, EstadoObra } from '../types';

const ESTADO_LABELS: Record<EstadoObra, string> = {
  CARGADA: 'Cargada',
  MATERIAL_PEDIDO: 'Material Pedido',
  PRODUCCION: 'Producción',
  CORTE: 'Corte',
  ENTREGADA: 'Entregada',
};

const ESTADOS: EstadoObra[] = ['CARGADA', 'MATERIAL_PEDIDO', 'PRODUCCION', 'CORTE', 'ENTREGADA'];

export default function ObraDetalle() {
  const { id } = useParams<{ id: string }>();

  const [obra, setObra] = useState<Obra | null>(null);
  const [aberturas, setAberturas] = useState<Abertura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [estadoSaving, setEstadoSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      apiGet<Obra>(`/obras/${id}`),
      apiGet<Abertura[]>(`/obras/${id}/aberturas`),
    ])
      .then(([o, a]) => {
        setObra(o);
        setAberturas(a);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleEstadoChange(nuevo: EstadoObra) {
    if (!obra) return;
    setEstadoSaving(true);
    try {
      const updated = await apiPut<Obra>(`/obras/${id}`, { ...obra, estado: nuevo });
      setObra(updated);
    } catch (e: unknown) {
      alert('Error al actualizar estado: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setEstadoSaving(false);
    }
  }

  async function handleDeleteAbertura(aberturaId: number) {
    if (!confirm('¿Eliminar esta abertura?')) return;
    try {
      await apiDelete(`/aberturas/${aberturaId}`);
      setAberturas(prev => prev.filter(a => a.id !== aberturaId));
    } catch (e: unknown) {
      alert('Error al eliminar: ' + (e instanceof Error ? e.message : String(e)));
    }
  }

  if (loading) {
    return (
      <div className="loading-page">
        <span className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Link to="/obras" className="back-link">← Obras</Link>
        <div className="error-msg">{error}</div>
      </>
    );
  }

  if (!obra) return null;

  return (
    <>
      <Link to="/obras" className="back-link">← Obras</Link>

      <div className="page-header" style={{ marginBottom: 0, alignItems: 'center' }}>
        <div className="page-header-left">
          <h1 className="page-title">{obra.nombre}</h1>
          {obra.direccion && <p className="page-subtitle">{obra.direccion}</p>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select
            value={obra.estado}
            onChange={e => handleEstadoChange(e.target.value as EstadoObra)}
            disabled={estadoSaving}
            className={`badge badge-${obra.estado.toLowerCase()}`}
            style={{
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '3px 6px',
            }}
          >
            {ESTADOS.map(e => (
              <option key={e} value={e} style={{ background: '#161b22', textTransform: 'uppercase' }}>
                {ESTADO_LABELS[e]}
              </option>
            ))}
          </select>
          {estadoSaving && <span className="spinner" style={{ width: 14, height: 14 }} />}
        </div>
      </div>

      <div className="obra-meta-grid" style={{ marginTop: 16 }}>
        <div className="obra-meta-item">
          <div className="obra-meta-label">Cliente</div>
          <div className="obra-meta-value large">{obra.cliente}</div>
        </div>
        <div className="obra-meta-item">
          <div className="obra-meta-label">Presupuesto Nro</div>
          <div className="obra-meta-value">{obra.presupuesto_nro || '—'}</div>
        </div>
        {obra.tratamiento && (
          <div className="obra-meta-item">
            <div className="obra-meta-label">Tratamiento</div>
            <div className="obra-meta-value">{obra.tratamiento}</div>
          </div>
        )}
        {obra.linea && (
          <div className="obra-meta-item">
            <div className="obra-meta-label">Línea</div>
            <div className="obra-meta-value">{obra.linea}</div>
          </div>
        )}
        {obra.telefono && (
          <div className="obra-meta-item">
            <div className="obra-meta-label">Teléfono</div>
            <div className="obra-meta-value">{obra.telefono}</div>
          </div>
        )}
        {obra.email && (
          <div className="obra-meta-item">
            <div className="obra-meta-label">Email</div>
            <div className="obra-meta-value">{obra.email}</div>
          </div>
        )}
        <div className="obra-meta-item">
          <div className="obra-meta-label">Fecha</div>
          <div className="obra-meta-value">
            {new Date(obra.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </div>
        </div>
      </div>

      {obra.notas && (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius)',
            padding: '10px 14px',
            marginBottom: '20px',
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
          }}
        >
          <span style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginRight: 8 }}>Notas</span>
          {obra.notas}
        </div>
      )}

      <div className="page-header" style={{ marginBottom: 12 }}>
        <div className="page-header-left">
          <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
            Aberturas
          </h2>
          <p className="page-subtitle">{aberturas.length} {aberturas.length === 1 ? 'abertura' : 'aberturas'}</p>
        </div>
        <Link to={`/obras/${id}/aberturas/nueva`} className="btn btn-primary btn-sm">
          + Nueva Abertura
        </Link>
      </div>

      <div className="card">
        <div className="table-wrap">
          {aberturas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📐</div>
              <div className="empty-title">Sin aberturas cargadas</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Agregá la primera abertura a esta obra
              </div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Denominación</th>
                  <th>Tipo</th>
                  <th>Línea</th>
                  <th>Medidas (AxA)</th>
                  <th>Ubicación / Local</th>
                  <th style={{ textAlign: 'center' }}>Cant.</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {aberturas.map(a => (
                  <tr key={a.id}>
                    <td>
                      <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                        {a.denominacion}
                      </span>
                    </td>
                    <td className="td-muted" style={{ maxWidth: 200 }}>
                      {a.tipo_abertura || '—'}
                    </td>
                    <td className="td-muted">{a.linea || '—'}</td>
                    <td>
                      {a.ancho_fab && a.alto_fab ? (
                        <span className="medidas-chip">
                          {a.ancho_fab} × {a.alto_fab}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="td-muted">
                      {[a.ubicacion, a.local].filter(Boolean).join(' / ') || '—'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="count-chip">{a.cantidad}</span>
                    </td>
                    <td>
                      <div className="td-actions">
                        <Link
                          to={`/aberturas/${a.id}/editar`}
                          state={{ obra_id: obra.id }}
                          className="btn btn-ghost btn-sm"
                        >
                          Editar
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteAbertura(a.id)}
                        >
                          Eliminar
                        </button>
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
