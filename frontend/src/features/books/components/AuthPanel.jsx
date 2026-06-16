import { useState } from 'react';

const DEFAULT_FORM = {
  email: '',
  name: '',
  password: '',
};

const ROLE_LABELS = {
  admin: 'Administrador',
  customer: 'Cliente',
  seller: 'Vendedor',
};

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function AuthPanel({
  authError,
  onLogin,
  onLogout,
  onRegister,
  session,
}) {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState(DEFAULT_FORM);

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (mode === 'login') {
      onLogin(formData);
      return;
    }

    onRegister(formData);
  };

  if (session) {
    return (
      <section className="account-panel account-summary" aria-label="Cuenta activa">
        <div className="account-summary-header">
          <div className="account-avatar" aria-hidden="true">
            {getInitials(session.name)}
          </div>

          <div className="account-identity">
            <p className="section-kicker">Cuenta</p>
            <h2>{session.name}</h2>
            <p className="account-email">{session.email}</p>
          </div>
        </div>

        <div className="account-meta">
          <span className="role-badge">{ROLE_LABELS[session.role] ?? 'Cliente'}</span>
          <span>Sesion activa</span>
        </div>

        <button type="button" className="btn-clear account-logout" onClick={onLogout}>
          Cerrar sesion
        </button>
      </section>
    );
  }

  return (
    <section className="account-panel" aria-label="Acceso de usuario">
      <p className="section-kicker">Cuenta</p>
      <div className="auth-tabs" role="tablist" aria-label="Tipo de acceso">
        <button
          type="button"
          className={mode === 'login' ? 'active' : ''}
          onClick={() => setMode('login')}
        >
          Iniciar
        </button>
        <button
          type="button"
          className={mode === 'register' ? 'active' : ''}
          onClick={() => setMode('register')}
        >
          Registro
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {mode === 'register' && (
          <label>
            Nombre
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            minLength="4"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        {authError && <p className="form-error">{authError}</p>}

        <button type="submit" className="btn-save">
          {mode === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>
      </form>
    </section>
  );
}
