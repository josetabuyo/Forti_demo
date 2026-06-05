import { useEffect, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { apiGet, apiPost, apiPut } from '../api';
import type { Abertura } from '../types';

const LINEAS = [
  'ENKEL',
  'HOJA OCULTA',
  'HOJA OCULTA RPT',
  'CORREDIZA 2H',
  'CORREDIZA 3H',
  'CORREDIZA 4H',
  'HA62',
  '62RPT',
  'HA110',
  '110RPT',
  'HA135',
  '135RPT',
  'IMPERIA',
  'IMPERIA RPT',
  'A30',
  'A40',
  'A40 RPT',
  'MODENA',
  'OTRO',
];

const MANOS = ['DERECHA', 'IZQUIERDA', 'N/A'];
const MOSQUITEROS = ['NO', 'SI-FIJO', 'SI-3ERA GUÍA', 'OTRO'];

interface FormState {
  denominacion: string;
  ubicacion: string;
  local: string;
  cantidad: number;
  linea: string;
  tipo_abertura: string;
  mano: string;
  vidrio: string;
  mosquitero: string;
  tapajuntas: boolean;
  manija: string;
  altura_manija: string;
  umbral: string;
  suplemento_lateral: string;
  suplemento_superior: string;
  ancho_fab: string;
  alto_fab: string;
  observaciones: string;
}

const EMPTY: FormState = {
  denominacion: '',
  ubicacion: '',
  local: '',
  cantidad: 1,
  linea: '',
  tipo_abertura: '',
  mano: '',
  vidrio: '',
  mosquitero: 'NO',
  tapajuntas: false,
  manija: '',
  altura_manija: '',
  umbral: '',
  suplemento_lateral: '',
  suplemento_superior: '',
  ancho_fab: '',
  alto_fab: '',
  observaciones: '',
};

function aberturaToForm(a: Abertura): FormState {
  return {
    denominacion: a.denominacion,
    ubicacion: a.ubicacion ?? '',
    local: a.local ?? '',
    cantidad: a.cantidad,
    linea: a.linea ?? '',
    tipo_abertura: a.tipo_abertura ?? '',
    mano: a.mano ?? '',
    vidrio: a.vidrio ?? '',
    mosquitero: a.mosquitero ?? 'NO',
    tapajuntas: a.tapajuntas ?? false,
    manija: a.manija ?? '',
    altura_manija: a.altura_manija != null ? String(a.altura_manija) : '',
    umbral: a.umbral ?? '',
    suplemento_lateral: a.suplemento_lateral != null ? String(a.suplemento_lateral) : '',
    suplemento_superior: a.suplemento_superior != null ? String(a.suplemento_superior) : '',
    ancho_fab: a.ancho_fab != null ? String(a.ancho_fab) : '',
    alto_fab: a.alto_fab != null ? String(a.alto_fab) : '',
    observaciones: a.observaciones ?? '',
  };
}

function formToPayload(f: FormState, obra_id: number) {
  return {
    obra_id,
    denominacion: f.denominacion.trim(),
    ubicacion: f.ubicacion.trim() || undefined,
    local: f.local.trim() || undefined,
    cantidad: Number(f.cantidad),
    linea: f.linea || undefined,
    tipo_abertura: f.tipo_abertura.trim() || undefined,
    mano: f.mano || undefined,
    vidrio: f.vidrio.trim() || undefined,
    mosquitero: f.mosquitero || undefined,
    tapajuntas: f.tapajuntas,
    manija: f.manija.trim() || undefined,
    altura_manija: f.altura_manija !== '' ? Number(f.altura_manija) : undefined,
    umbral: f.umbral.trim() || undefined,
    suplemento_lateral: f.suplemento_lateral !== '' ? Number(f.suplemento_lateral) : undefined,
    suplemento_superior: f.suplemento_superior !== '' ? Number(f.suplemento_superior) : undefined,
    ancho_fab: f.ancho_fab !== '' ? Number(f.ancho_fab) : undefined,
    alto_fab: f.alto_fab !== '' ? Number(f.alto_fab) : undefined,
    observaciones: f.observaciones.trim() || undefined,
  };
}

export default function AberturaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const isEdit = location.pathname.includes('/editar');

  const obra_id_from_state = (location.state as { obra_id?: number } | null)?.obra_id;

  const [form, setForm] = useState<FormState>(EMPTY);
  const [obraId, setObraId] = useState<number | null>(obra_id_from_state ?? null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      apiGet<Abertura>(`/aberturas/${id}`)
        .then(a => {
          setForm(aberturaToForm(a));
          setObraId(a.obra_id);
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    } else if (!isEdit && id) {
      setObraId(Number(id));
    }
  }, [id, isEdit]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const target = e.target;
    const key = target.name as keyof FormState;
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setForm(prev => ({ ...prev, [key]: target.checked }));
    } else {
      setForm(prev => ({ ...prev, [key]: target.value }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!obraId) {
      setError('No se pudo determinar la obra.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = formToPayload(form, obraId);
      if (isEdit && id) {
        await apiPut(`/aberturas/${id}`, payload);
      } else {
        await apiPost(`/obras/${obraId}/aberturas`, payload);
      }
      navigate(`/obras/${obraId}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="loading-page">
        <span className="spinner" />
      </div>
    );
  }

  const backPath = obraId ? `/obras/${obraId}` : '/obras';

  return (
    <>
      <Link to={backPath} className="back-link">← Volver a la obra</Link>

      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            {isEdit ? 'Editar Abertura' : 'Nueva Abertura'}
          </h1>
          {isEdit && form.denominacion && (
            <p className="page-subtitle">{form.denominacion}</p>
          )}
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-card">

          <div className="form-section">
            <div className="form-section-title">Identificación</div>
            <div className="form-grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 100px' }}>
              <div className="form-group">
                <label htmlFor="denominacion">
                  Denominación <span className="required">*</span>
                </label>
                <input
                  id="denominacion"
                  name="denominacion"
                  type="text"
                  value={form.denominacion}
                  onChange={handleChange}
                  placeholder="ej: V103"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="ubicacion">Ubicación</label>
                <input
                  id="ubicacion"
                  name="ubicacion"
                  type="text"
                  value={form.ubicacion}
                  onChange={handleChange}
                  placeholder="ej: Planta Baja"
                />
              </div>
              <div className="form-group">
                <label htmlFor="local">Local</label>
                <input
                  id="local"
                  name="local"
                  type="text"
                  value={form.local}
                  onChange={handleChange}
                  placeholder="ej: Baño"
                />
              </div>
              <div className="form-group">
                <label htmlFor="cantidad">Cantidad <span className="required">*</span></label>
                <input
                  id="cantidad"
                  name="cantidad"
                  type="number"
                  min={1}
                  value={form.cantidad}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Carpintería</div>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 2fr 1fr' }}>
              <div className="form-group">
                <label htmlFor="linea">Línea</label>
                <select id="linea" name="linea" value={form.linea} onChange={handleChange}>
                  <option value="">— Sin especificar —</option>
                  {LINEAS.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="tipo_abertura">Tipo de abertura</label>
                <input
                  id="tipo_abertura"
                  name="tipo_abertura"
                  type="text"
                  value={form.tipo_abertura}
                  onChange={handleChange}
                  placeholder="ej: Oscilobatiente + Paño fijo inferior"
                />
              </div>
              <div className="form-group">
                <label htmlFor="mano">Mano / Hoja activa</label>
                <select id="mano" name="mano" value={form.mano} onChange={handleChange}>
                  <option value="">— Sin especificar —</option>
                  {MANOS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Vidrio y Mosquitero</div>
            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="vidrio">Vidrio / Composición DVH</label>
                <input
                  id="vidrio"
                  name="vidrio"
                  type="text"
                  value={form.vidrio}
                  onChange={handleChange}
                  placeholder="ej: DVH 4+12+4 Templado"
                />
              </div>
              <div className="form-group">
                <label htmlFor="mosquitero">Mosquitero</label>
                <select id="mosquitero" name="mosquitero" value={form.mosquitero} onChange={handleChange}>
                  {MOSQUITEROS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Herrajes y Detalles</div>
            <div className="form-grid" style={{ gridTemplateColumns: 'auto 1fr 120px 1fr 120px 120px' }}>
              <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                <label style={{ opacity: 0, userSelect: 'none' }}>-</label>
                <div className="checkbox-row">
                  <input
                    id="tapajuntas"
                    name="tapajuntas"
                    type="checkbox"
                    checked={form.tapajuntas}
                    onChange={handleChange}
                  />
                  <label htmlFor="tapajuntas" className="checkbox-row-label">Tapajuntas</label>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="manija">Manija / Cierre</label>
                <input
                  id="manija"
                  name="manija"
                  type="text"
                  value={form.manija}
                  onChange={handleChange}
                  placeholder="ej: Manija lever cromo"
                />
              </div>
              <div className="form-group">
                <label htmlFor="altura_manija">Alt. manija (mm)</label>
                <input
                  id="altura_manija"
                  name="altura_manija"
                  type="number"
                  min={0}
                  value={form.altura_manija}
                  onChange={handleChange}
                  placeholder="mm"
                />
              </div>
              <div className="form-group">
                <label htmlFor="umbral">Umbral</label>
                <input
                  id="umbral"
                  name="umbral"
                  type="text"
                  value={form.umbral}
                  onChange={handleChange}
                  placeholder="ej: SEMI E-30mm"
                />
              </div>
              <div className="form-group">
                <label htmlFor="suplemento_lateral">Sup. lateral (mm)</label>
                <input
                  id="suplemento_lateral"
                  name="suplemento_lateral"
                  type="number"
                  min={0}
                  value={form.suplemento_lateral}
                  onChange={handleChange}
                  placeholder="mm"
                />
              </div>
              <div className="form-group">
                <label htmlFor="suplemento_superior">Sup. superior (mm)</label>
                <input
                  id="suplemento_superior"
                  name="suplemento_superior"
                  type="number"
                  min={0}
                  value={form.suplemento_superior}
                  onChange={handleChange}
                  placeholder="mm"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Medidas de Fabricación</div>
            <div className="form-grid-3">
              <div className="form-group">
                <label htmlFor="ancho_fab">
                  Ancho de fabricación (mm) <span className="required">*</span>
                </label>
                <input
                  id="ancho_fab"
                  name="ancho_fab"
                  type="number"
                  min={1}
                  value={form.ancho_fab}
                  onChange={handleChange}
                  placeholder="mm"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="alto_fab">
                  Alto de fabricación (mm) <span className="required">*</span>
                </label>
                <input
                  id="alto_fab"
                  name="alto_fab"
                  type="number"
                  min={1}
                  value={form.alto_fab}
                  onChange={handleChange}
                  placeholder="mm"
                  required
                />
              </div>
              {form.ancho_fab && form.alto_fab && (
                <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                  <label style={{ opacity: 0, userSelect: 'none' }}>-</label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '9px 14px',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius)',
                      fontSize: '0.875rem',
                      color: 'var(--steel-light)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
                      Medida:
                    </span>
                    {form.ancho_fab} × {form.alto_fab} mm
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Observaciones</div>
            <div className="form-group">
              <label htmlFor="observaciones">Observaciones</label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={form.observaciones}
                onChange={handleChange}
                placeholder="Notas adicionales sobre esta abertura..."
                style={{ minHeight: 90 }}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? <span className="spinner" style={{ width: 14, height: 14 }} /> : null}
              {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear abertura'}
            </button>
            <Link to={backPath} className="btn btn-secondary">
              Cancelar
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
