import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/obras';

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(password);
      navigate(from, { replace: true });
    } catch {
      setError('Contraseña incorrecta. Verificá e intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(61,122,181,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              marginBottom: '16px',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="3" y="8" width="9" height="13" rx="1" stroke="#5499d9" strokeWidth="1.5" />
              <rect x="16" y="8" width="9" height="13" rx="1" stroke="#5499d9" strokeWidth="1.5" />
              <line x1="12" y1="14.5" x2="16" y2="14.5" stroke="#5499d9" strokeWidth="1.5" />
              <line x1="7.5" y1="8" x2="7.5" y2="21" stroke="#3d7ab5" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="20.5" y1="8" x2="20.5" y2="21" stroke="#3d7ab5" strokeWidth="1" strokeDasharray="2 2" />
            </svg>
          </div>
          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              letterSpacing: '0.2em',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            FORTI
          </div>
          <div
            style={{
              fontSize: '0.6875rem',
              letterSpacing: '0.2em',
              color: 'var(--steel)',
              textTransform: 'uppercase',
              marginTop: '4px',
            }}
          >
            Sistema de Obras
          </div>
        </div>

        <div
          style={{
            width: '100%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '28px 28px 24px',
          }}
        >
          <div
            style={{
              fontSize: '0.9375rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '4px',
            }}
          >
            Acceso al sistema
          </div>
          <div
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              marginBottom: '22px',
            }}
          >
            Ingresá la contraseña para continuar
          </div>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !password}
              style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', marginTop: '4px' }}
            >
              {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : null}
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
          }}
        >
          Aberturas Forti &mdash; Sistema interno
        </div>
      </div>
    </div>
  );
}
