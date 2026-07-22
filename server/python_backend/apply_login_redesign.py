import os
import re

CSS_FILE = "dashboard-ui/src/index.css"
APP_FILE = "dashboard-ui/src/App.jsx"

# --- 1. PATCH CSS ---
with open(CSS_FILE, "r", encoding="utf-8") as f:
    css_content = f.read()

new_login_css = """
/* LIGHT-THEMED CLEAN LOGIN REDESIGN */
.login-shell {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #3b5b8d; /* Outer blue from reference */
  padding: 20px;
}

.login-shell::before, .login-shell::after {
  display: none;
}

.login-panel {
  width: min(440px, 100%);
  background-color: #f2f5f9; /* Soft light gray/blue inner card */
  border-radius: 16px;
  padding: 48px 32px 32px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  color: #333;
  animation: fade-in-up 0.5s ease-out both;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 32px;
}

.login-brand-lockup {
  margin-bottom: 16px;
}

.login-brand-lockup .brand-logo-pair {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  background: white;
  border-radius: 99px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.login-headline h1 {
  font-size: 28px;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 6px;
}

.login-headline p {
  color: #64748b;
  font-size: 15px;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.input-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 8px;
}

.login-input-wrapper {
  display: flex;
  align-items: stretch;
  background-color: #e2e8f0; /* Gray input background */
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #cbd5e1;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.login-input-wrapper:focus-within {
  border-color: #3b5b8d;
  box-shadow: 0 0 0 3px rgba(59, 91, 141, 0.2);
}

.login-input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  background-color: white; /* White block for icon */
  color: #475569;
  border-right: 1px solid #e2e8f0;
}

.login-form input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px 16px;
  color: #1e293b;
  font-size: 15px;
  outline: none;
}

.login-form input::placeholder {
  color: #94a3b8;
}

.login-options {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.login-options input[type="checkbox"] {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
  accent-color: #3b5b8d;
  cursor: pointer;
}

.login-options label {
  font-size: 14px;
  color: #475569;
  cursor: pointer;
  user-select: none;
}

.btn-login {
  background-color: #3b5b8d; /* Flat blue button */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background-color 0.2s;
  text-transform: uppercase;
  margin-top: 8px;
}

.btn-login:hover {
  background-color: #2c4770;
}

.login-features-badge {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
}

.login-feature-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  background: white;
  padding: 6px 12px;
  border-radius: 99px;
  border: 1px solid #e2e8f0;
}

.login-error {
  background: #fef2f2;
  color: #ef4444;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #f87171;
  font-size: 14px;
}
/* END LIGHT-THEMED LOGIN */
"""

css_content = re.sub(r'/\* GLASSMORPHISM LOGIN REDESIGN \*/.*?/\* END GLASSMORPHISM LOGIN \*/', new_login_css, css_content, flags=re.DOTALL)

with open(CSS_FILE, "w", encoding="utf-8") as f:
    f.write(css_content)

# --- 2. PATCH APP.JSX ---
with open(APP_FILE, "r", encoding="utf-8") as f:
    app_content = f.read()

new_login_jsx = """
    if (!authenticated) {
      return (
        <div className="login-shell">
          <div className="login-panel">
            <div className="login-brand">
              <BrandLockup className="login-brand-lockup" logoClassName="login-logo" compact />
              <div className="login-headline">
                <h1>VoltKraft Gateway</h1>
                <p>Masuk ke sistem monitoring lokal</p>
              </div>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              {loginError && (
                <div className="login-error">
                  <AlertTriangle size={16} />
                  <span>{loginError}</span>
                </div>
              )}
              <div className="input-group">
                <label htmlFor="login-username">Username</label>
                <div className="login-input-wrapper">
                  <div className="login-input-icon">
                    <User size={18} strokeWidth={2.5} />
                  </div>
                  <input
                    id="login-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Masukkan username"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="login-password">Password</label>
                <div className="login-input-wrapper">
                  <div className="login-input-icon">
                    <Key size={18} strokeWidth={2.5} />
                  </div>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Masukkan password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="login-options">
                <input type="checkbox" id="remember-me" />
                <label htmlFor="remember-me">Ingat saya</label>
              </div>

              <button className="btn-login" type="submit">
                Masuk
              </button>
            </form>

            <div className="login-features-badge">
              <span className="login-feature-item"><Activity size={12} /> DC Monitor</span>
              <span className="login-feature-item"><Waves size={12} /> PQM</span>
              <span className="login-feature-item"><Gauge size={12} /> AVR</span>
              <span className="login-feature-item"><Zap size={12} /> AR Monitor</span>
            </div>
          </div>
        </div>
      );
    }
"""

app_content = re.sub(r'if \(!authenticated\) \{.*?(?=const currentMeta =)', new_login_jsx, app_content, flags=re.DOTALL)

with open(APP_FILE, "w", encoding="utf-8") as f:
    f.write(app_content)

print("Light Theme UI Patch Applied!")
