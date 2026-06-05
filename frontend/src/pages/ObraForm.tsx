import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiPost } from '../api';
import type { Obra, EstadoObra } from '../types';

const LINEAS = [
  'ENKEL', 'HOJA OCULTA', 'HOJA OCULTA RPT',
  'CORREDIZA 2H', 'CORREDIZA 3H', 'CORREDIZA 4H',
  'HA62', '62RPT', 'HA110', '110RPT', 'HA135', '135RPT',
  'IMPERIA', 'IMPERIA RPT', 'A30', 'A40', 'A40 RPT', 'MODENA',
];

const ESTADOS: { value: EstadoObra; label: string }[] = [
  { value: 'CARGADA', label: 'Cargada' },
  { value: 'MATERIAL_PEDIDO', label: 'Material Pedido' },
  { value: 'PRODUCCION', label: 'Producción' },
  { value: 'CORTE', label: 'Corte' },
  { value: 'ENTREGADA', label: 'Entregada' },
];

export default function ObraForm() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    cliente: '',
    presupuesto_nro: '',
    telefono: '',
    email: '',
    tratamiento: '',
    linea: '',
    notas: '',
    estado: 'CARGADA' as EstadoObra,
    fecha: new Date().toISOString().split('T')[0],
  });

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const obra = await apiPost<Obra>('/obras', form);
      navigate(`/obras/${obra.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <Link to="/obras" className="back-link">← Obras</Link>
          <h1 className="page-title">Nueva Obra</h1>
        </div>
      </div>

      {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ padding: '24px', marginBottom: 16 }}>
          <div className="form-section-title">Datos del proyecto</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre de obra *</label>
              <input value={form.nombre} onChange={e => set('nombre', e.target.value)}
                placeholder="Ej: CASA FAIRWAY" required />
            </div>
            <div className="form-group">
              <label>Presupuesto N°</label>
              <input value={form.presupuesto_nro} onChange={e => set('presupuesto_nro', e.target.value)}
                placeholder="Ej: PF 1045.10" />
            </div>
            <div className="form-group form-span-2">
              <label>Dirección</label>
              <input value={form.direccion} onChange={e => set('direccion', e.target.value)}
                placeholder="Ej: LAGARTOS COUNTRY CLUB 523" />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', marginBottom: 16 }}>
          <div className="form-section-title">Cliente</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre / Estudio *</label>
              <input value={form.cliente} onChange={e => set('cliente', e.target.value)}
                placeholder="Ej: CATALINA LO CANE DIPA" required />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input value={form.telefono} onChange={e => set('telefono', e.target.value)}
                placeholder="15-6982-5652" />
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="cliente@mail.com" />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', marginBottom: 16 }}>
          <div className="form-section-title">Carpintería</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Línea</label>
              <select value={form.linea} onChange={e => set('linea', e.target.value)}>
                <option value="">— Seleccionar —</option>
                {LINEAS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Tratamiento</label>
              <input value={form.tratamiento} onChange={e => set('tratamiento', e.target.value)}
                placeholder="Ej: MICROTEXTURADO NEGRO" />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', marginBottom: 16 }}>
          <div className="form-section-title">Estado y fecha</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Estado</label>
              <select value={form.estado} onChange={e => set('estado', e.target.value as EstadoObra)}>
                {ESTADOS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Fecha</label>
              <input type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', marginBottom: 24 }}>
          <div className="form-section-title">Notas generales</div>
          <div className="form-group">
            <textarea value={form.notas} onChange={e => set('notas', e.target.value)}
              rows={4} placeholder="Observaciones generales de la obra..." />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Link to="/obras" className="btn btn-ghost">Cancelar</Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <span className="spinner" style={{ width: 14, height: 14 }} /> : null}
            {saving ? 'Guardando...' : 'Crear obra'}
          </button>
        </div>
      </form>
    </>
  );
}
