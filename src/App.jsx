import { useEffect, useState } from "react";
import { cadastrar, login, logout } from "./firebase/auth";
import auth from "./firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";

const NAV_ITEMS = [
  { id: "dashboard", icon: "📊", label: "Painel Principal" },
  { id: "evento", icon: "📅", label: "Evento" },
  { id: "produtos", icon: "🛍️", label: "Produtos" },
  { id: "doacoes", icon: "🎁", label: "Doações" },
  { id: "vendas", icon: "💰", label: "Vendas" },
  { id: "ia", icon: "🤖", label: "Assistente IA" },
];

function AuthModal({ onClose, onLogin }) {
  const [tab, setTab] = useState("login");

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    bazar: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  async function handleSubmit() {
    setError("");
    setLoading(true);

    try {
      let cred;

      if (tab === "login") {
        cred = await login(form.email, form.password);

        onLogin({
          email: cred.user.email,
          name: cred.user.email.split("@")[0],
          bazar: "Bazar Beneficente",
        });
      } else {
        if (!form.name || !form.email || !form.bazar || !form.password) {
          setError("Preencha todos os campos.");
          setLoading(false);
          return;
        }

        if (form.password !== form.confirm) {
          setError("As senhas não coincidem.");
          setLoading(false);
          return;
        }

        cred = await cadastrar(form.email, form.password);

        onLogin({
          email: cred.user.email,
          name: form.name,
          bazar: form.bazar,
        });
      }
    } catch (erro) {
      if (erro.code === "auth/email-already-in-use") {
        setError("Este e-mail já está cadastrado.");
      } else if (erro.code === "auth/invalid-email") {
        setError("Digite um e-mail válido.");
      } else if (erro.code === "auth/weak-password") {
        setError("A senha deve ter pelo menos 6 caracteres.");
      } else if (erro.code === "auth/invalid-credential") {
        setError("E-mail ou senha incorretos.");
      } else {
  setError(`Erro: ${erro.code}`);
}
    }

    setLoading(false);
  }

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={styles.modalLogo}>🏪</div>
          <p style={styles.modalBrand}>BazarTech Solidário</p>
        </div>

        <div style={styles.tabRow}>
          <button
            style={{
              ...styles.tabBtn,
              ...(tab === "login" ? styles.tabBtnActive : {}),
            }}
            onClick={() => setTab("login")}
          >
            Entrar
          </button>

          <button
            style={{
              ...styles.tabBtn,
              ...(tab === "register" ? styles.tabBtnActive : {}),
            }}
            onClick={() => setTab("register")}
          >
            Criar conta
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tab === "register" && (
            <>
              <InputField
                label="Seu nome"
                value={form.name}
                onChange={set("name")}
              />

              <InputField
                label="Nome do bazar"
                value={form.bazar}
                onChange={set("bazar")}
              />
            </>
          )}

          <InputField
            label="E-mail"
            type="email"
            value={form.email}
            onChange={set("email")}
          />

          <InputField
            label="Senha"
            type="password"
            value={form.password}
            onChange={set("password")}
          />

          {tab === "register" && (
            <InputField
              label="Confirmar senha"
              type="password"
              value={form.confirm}
              onChange={set("confirm")}
            />
          )}
        </div>

        {error && <p style={styles.errorMsg}>{error}</p>}

        <button
          style={{ ...styles.primaryBtn, width: "100%", marginTop: 20 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Aguarde..."
            : tab === "login"
            ? "Entrar"
            : "Criar conta"}
        </button>
      </div>
    </div>
  );
}

function InputField({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label style={styles.inputLabel}>{label}</label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        style={styles.input}
      />
    </div>
  );
}

function Header({ user, onLoginClick, onLogout }) {
  return (
    <header style={styles.header}>
      <div>
        <span style={styles.headerBrandTag}>BAZARTECH SOLIDÁRIO</span>

        <h1 style={styles.headerTitle}>Gestão Inteligente do Bazar</h1>
      </div>

      {user ? (
        <div style={styles.userBadge}>
          <div style={styles.userAvatar}>
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>

          <div>
            <p style={{ margin: 0, fontWeight: 700 }}>{user.name}</p>

            <p style={{ margin: 0, fontSize: 12, color: "#777" }}>
              {user.email}
            </p>
          </div>

          <button style={styles.logoutBtn} onClick={onLogout}>
            Sair
          </button>
        </div>
      ) : (
        <button style={styles.loginHeaderBtn} onClick={onLoginClick}>
          Entrar / Cadastrar
        </button>
      )}
    </header>
  );
}

function Sidebar({ user, activeNav, setActiveNav, onLoginClick }) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.bazarCard}>
        <p style={styles.bazarCardLabel}>Meu Bazar</p>

        <h2 style={styles.bazarCardTitle}>
          {user ? user.bazar : "Faça login"}
        </h2>

        {user ? (
          <p style={styles.bazarCardSub}>Administrador ativo</p>
        ) : (
          <button style={styles.sidebarLoginBtn} onClick={onLoginClick}>
            Entrar agora
          </button>
        )}
      </div>

      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          style={{
            ...styles.navItem,
            ...(activeNav === item.id ? styles.navItemActive : {}),
          }}
          onClick={() => setActiveNav(item.id)}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}

function PlaceholderPage({ title, subtitle }) {
  return (
    <section style={styles.placeholder}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>

      <p>{subtitle}</p>
    </section>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email,
          name: firebaseUser.email.split("@")[0],
          bazar: "Bazar Beneficente",
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  function handleLogin(usuario) {
    setUser(usuario);
    setShowAuth(false);
  }

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  return (
    <div style={styles.root}>
      <Header
        user={user}
        onLoginClick={() => setShowAuth(true)}
        onLogout={handleLogout}
      />

      <div style={styles.layout}>
        <Sidebar
          user={user}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onLoginClick={() => setShowAuth(true)}
        />

        <main style={styles.main}>
          {user ? (
            <>
              {activeNav === "dashboard" && <Dashboard />}

              {activeNav === "produtos" && <Products />}

              {activeNav === "vendas" && <Sales />}

              {activeNav === "evento" && (
                <PlaceholderPage
                  title="Configurações do Evento"
                  subtitle="Aqui vamos cadastrar local, data, Pix e informações do bazar."
                />
              )}

              {activeNav === "doacoes" && (
                <PlaceholderPage
                  title="Doações"
                  subtitle="Aqui vamos registrar doadores e itens recebidos."
                />
              )}

              {activeNav === "ia" && (
                <PlaceholderPage
                  title="Assistente IA"
                  subtitle="Aqui vamos gerar relatórios automáticos e sugestões inteligentes."
                />
              )}
            </>
          ) : (
            <div style={styles.guestPlaceholder}>
              <span style={{ fontSize: 56 }}>🏪</span>

              <h2>Bem-vindo ao BazarTech Solidário</h2>

              <p>
                Faça login ou crie sua conta para gerenciar seu bazar.
              </p>

              <button
                style={styles.primaryBtn}
                onClick={() => setShowAuth(true)}
              >
                Entrar / Criar conta
              </button>
            </div>
          )}
        </main>
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

const styles = {
  root: {
    fontFamily: "Arial, sans-serif",
    minHeight: "100vh",
    background: "#F5F2EE",
  },

  header: {
    background: "#fff",
    borderBottom: "1px solid #E8E4DF",
    padding: "12px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerBrandTag: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 2,
    color: "#E85B2A",
  },

  headerTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
  },

  loginHeaderBtn: {
    background: "#E85B2A",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 20px",
    fontWeight: 700,
    cursor: "pointer",
  },

  layout: {
    display: "flex",
    minHeight: "calc(100vh - 65px)",
  },

  sidebar: {
    width: 240,
    background: "linear-gradient(180deg, #D94020, #C03318)",
    padding: 16,
  },

  bazarCard: {
    background: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },

  bazarCardLabel: {
    color: "#fff",
    fontSize: 11,
  },

  bazarCardTitle: {
    color: "#fff",
    margin: 0,
  },

  bazarCardSub: {
    color: "#fff",
    fontSize: 12,
  },

  sidebarLoginBtn: {
    marginTop: 12,
    width: "100%",
    background: "#fff",
    color: "#D94020",
    border: "none",
    borderRadius: 8,
    padding: 10,
    fontWeight: 700,
    cursor: "pointer",
  },

  navItem: {
    display: "flex",
    gap: 10,
    width: "100%",
    border: "none",
    background: "transparent",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
    textAlign: "left",
  },

  navItemActive: {
    background: "#fff",
    color: "#D94020",
  },

  main: {
    flex: 1,
    padding: 24,
  },

  placeholder: {
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    border: "1px solid #F0EBE5",
  },

  guestPlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 400,
    textAlign: "center",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modalBox: {
    background: "#fff",
    borderRadius: 20,
    padding: 28,
    width: "100%",
    maxWidth: 400,
  },

  modalLogo: {
    fontSize: 40,
  },

  modalBrand: {
    fontWeight: 800,
    fontSize: 20,
  },

  tabRow: {
    display: "flex",
    background: "#F5F2EE",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    gap: 4,
  },

  tabBtn: {
    flex: 1,
    border: "none",
    background: "none",
    padding: 10,
    borderRadius: 8,
    cursor: "pointer",
  },

  tabBtnActive: {
    background: "#fff",
    color: "#D94020",
    fontWeight: 700,
  },

  inputLabel: {
    display: "block",
    marginBottom: 4,
    fontSize: 12,
    fontWeight: 700,
  },

  input: {
    width: "100%",
    border: "1px solid #E8E4DF",
    borderRadius: 10,
    padding: 12,
    boxSizing: "border-box",
  },

  primaryBtn: {
    background: "#E85B2A",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "12px 18px",
    fontWeight: 700,
    cursor: "pointer",
  },

  errorMsg: {
    background: "#FEE",
    color: "#C0392B",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },

  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#F9F7F5",
    border: "1px solid #E8E4DF",
    borderRadius: 12,
    padding: "8px 14px",
  },

  userAvatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#E85B2A",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },

  logoutBtn: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "5px 10px",
    cursor: "pointer",
    background: "#fff",
  },
};