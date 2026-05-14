import { useState } from "react";

/* ─── Fonte Outfit via CDN ─── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap";
document.head.appendChild(fontLink);

/* ─── Dados simulados ─── */
const MOCK_USERS = [
  { email: "lukasgestor@gmail.com", password: "123456", name: "Lukas Gestor", bazar: "Bazar Beneficente" }
];

const NAV_ITEMS = [
  { id: "dashboard", icon: "📊", label: "Painel Principal" },
  { id: "evento",    icon: "📅", label: "Evento" },
  { id: "produtos",  icon: "🛍️", label: "Produtos" },
  { id: "doacoes",   icon: "🎁", label: "Doações" },
  { id: "vendas",    icon: "💰", label: "Vendas" },
  { id: "ia",        icon: "🤖", label: "Assistente IA" },
];

const CATEGORIES = ["Roupas", "Calçados", "Brinquedos", "Eletônicos", "Livros", "Decoração", "Outros"];
const CONDITIONS = ["Novo", "Ótimo", "Bom", "Regular"];

/* ─────────────────────────────────────────
   Componente: Modal de Autenticação
───────────────────────────────────────── */
function AuthModal({ onClose, onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "", bazar: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit() {
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (tab === "login") {
      const user = MOCK_USERS.find(
        (u) => u.email === form.email && u.password === form.password
      );
      if (!user) { setError("E-mail ou senha incorretos."); setLoading(false); return; }
      onLogin(user);
    } else {
      if (!form.name || !form.email || !form.bazar || !form.password) {
        setError("Preencha todos os campos."); setLoading(false); return;
      }
      if (form.password !== form.confirm) {
        setError("As senhas não coincidem."); setLoading(false); return;
      }
      const newUser = { email: form.email, password: form.password, name: form.name, bazar: form.bazar };
      MOCK_USERS.push(newUser);
      onLogin(newUser);
    }
    setLoading(false);
  }

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={styles.modalLogo}>🏪</div>
          <p style={styles.modalBrand}>BazarTech Solidário</p>
        </div>

        {/* Tabs */}
        <div style={styles.tabRow}>
          {[["login", "Entrar"], ["register", "Criar conta"]].map(([id, label]) => (
            <button key={id} style={{ ...styles.tabBtn, ...(tab === id ? styles.tabBtnActive : {}) }}
              onClick={() => { setTab(id); setError(""); }}>
              {label}
            </button>
          ))}
        </div>

        {/* Campos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tab === "register" && (
            <>
              <InputField label="Seu nome" value={form.name} onChange={set("name")} placeholder="Ex: João Silva" />
              <InputField label="Nome do bazar" value={form.bazar} onChange={set("bazar")} placeholder="Ex: Bazar da Igreja Central" />
            </>
          )}
          <InputField label="E-mail" type="email" value={form.email} onChange={set("email")} placeholder="seuemail@exemplo.com" />
          <InputField label="Senha" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />
          {tab === "register" && (
            <InputField label="Confirmar senha" type="password" value={form.confirm} onChange={set("confirm")} placeholder="••••••••" />
          )}
        </div>

        {error && <p style={styles.errorMsg}>{error}</p>}

        <button style={{ ...styles.primaryBtn, marginTop: 20, width: "100%", opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit} disabled={loading}>
          {loading ? "Aguarde..." : tab === "login" ? "Entrar" : "Criar minha conta"}
        </button>

        {tab === "login" && (
          <p style={styles.forgotLink}>
            <span style={{ cursor: "pointer", color: "#E85B2A" }}>Esqueci minha senha</span>
          </p>
        )}
      </div>
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <label style={styles.inputLabel}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={styles.input} />
    </div>
  );
}

/* ─────────────────────────────────────────
   Componente: Header
───────────────────────────────────────── */
function Header({ user, onLoginClick, onLogout }) {
  return (
    <header style={styles.header}>
      <div style={styles.headerLeft}>
        <span style={styles.headerBrandTag}>BAZARTECH SOLIDÁRIO</span>
        <h1 style={styles.headerTitle}>Gestão Inteligente do Bazar</h1>
      </div>
      <div style={styles.headerRight}>
        {user ? (
          <div style={styles.userBadge}>
            <div style={styles.userAvatar}>{user.name[0].toUpperCase()}</div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{user.name}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{user.email}</p>
            </div>
            <button style={styles.logoutBtn} onClick={onLogout}>Sair</button>
          </div>
        ) : (
          <button style={styles.loginHeaderBtn} onClick={onLoginClick}>
            Entrar / Cadastrar
          </button>
        )}
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────
   Componente: Sidebar
───────────────────────────────────────── */
function Sidebar({ user, activeNav, setActiveNav, onLoginClick }) {
  return (
    <aside style={styles.sidebar}>
      {/* Card do bazar */}
      <div style={styles.bazarCard}>
        <p style={styles.bazarCardLabel}>Meu Bazar</p>
        <h2 style={styles.bazarCardTitle}>{user ? user.bazar : "Faça login para continuar"}</h2>
        {user && <p style={styles.bazarCardSub}>📍 Administrador ativo</p>}
        {!user && (
          <button style={styles.sidebarLoginBtn} onClick={onLoginClick}>
            Entrar agora
          </button>
        )}
      </div>

      {/* Navegação */}
      <nav style={{ marginTop: 8 }}>
        {NAV_ITEMS.map((item) => (
          <button key={item.id}
            style={{ ...styles.navItem, ...(activeNav === item.id ? styles.navItemActive : {}) }}
            onClick={() => setActiveNav(item.id)}>
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

/* ─────────────────────────────────────────
   Componente: Dashboard Principal
───────────────────────────────────────── */
function DashboardView({ user }) {
  const stats = [
    { label: "Arrecadado", value: "R$ 0,00", icon: "📈", color: "#E85B2A" },
    { label: "Produtos",   value: "0",       icon: "🛍️", color: "#F5A623" },
    { label: "Vendidos",   value: "0",       icon: "✅", color: "#27AE60" },
    { label: "Disponível", value: "0",       icon: "📦", color: "#3498DB" },
    { label: "Doações",    value: "0",       icon: "🎁", color: "#9B59B6" },
  ];

  return (
    <div>
      {/* Banner do bazar */}
      <div style={styles.heroBanner}>
        <p style={styles.heroTag}>Administração do bazar</p>
        <h2 style={styles.heroTitle}>{user?.bazar ?? "Seu Bazar"}</h2>
        <p style={styles.heroSub}>
          Atualize os dados públicos, registre itens, vendas e acompanhe os resultados.
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div style={styles.statsGrid}>
        {stats.map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={styles.statLabel}>{s.label}</p>
                <p style={{ ...styles.statValue, color: s.color }}>{s.value}</p>
              </div>
              <span style={{ fontSize: 28 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Produtos e Estoque */}
      <ProductsSection />
    </div>
  );
}

/* ─────────────────────────────────────────
   Componente: Produtos
───────────────────────────────────────── */
function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", category: "Roupas", size: "", condition: "Bom", qty: 1, price: 0 });
  const [search, setSearch] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function addProduct() {
    if (!form.name.trim()) return;
    setProducts((p) => [...p, { ...form, id: Date.now(), status: "Disponível" }]);
    setForm({ name: "", category: "Roupas", size: "", condition: "Bom", qty: 1, price: 0 });
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>Produtos e Estoque</h3>
      <p style={styles.sectionSub}>Cadastre itens e controle o status de disponibilidade.</p>

      {/* Formulário de adição */}
      <div style={styles.formRow}>
        <input style={{ ...styles.input, flex: 2 }} placeholder="Nome do produto"
          value={form.name} onChange={set("name")} />
        <select style={{ ...styles.input, flex: 1 }} value={form.category} onChange={set("category")}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input style={{ ...styles.input, flex: 1 }} placeholder="Tamanho"
          value={form.size} onChange={set("size")} />
        <select style={{ ...styles.input, flex: 1 }} value={form.condition} onChange={set("condition")}>
          {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input style={{ ...styles.input, width: 80 }} type="number" min="1" placeholder="Qtd"
          value={form.qty} onChange={set("qty")} />
        <input style={{ ...styles.input, width: 90 }} type="number" min="0" step="0.50" placeholder="R$ 0,00"
          value={form.price} onChange={set("price")} />
        <button style={styles.primaryBtn} onClick={addProduct}>+ Adicionar</button>
      </div>

      {/* Busca */}
      <input style={{ ...styles.input, width: "100%", marginTop: 12 }}
        placeholder="🔍  Buscar por produto, categoria ou status..."
        value={search} onChange={(e) => setSearch(e.target.value)} />

      {/* Tabela */}
      {filtered.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={{ fontSize: 40 }}>📦</span>
          <p>Nenhum produto cadastrado ainda.</p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHead}>
              {["Produto", "Categoria", "Tamanho", "Estado", "Qtd", "Preço", "Status"].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={styles.tableRow}>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>{p.category}</td>
                <td style={styles.td}>{p.size || "—"}</td>
                <td style={styles.td}>{p.condition}</td>
                <td style={styles.td}>{p.qty}</td>
                <td style={styles.td}>R$ {Number(p.price).toFixed(2)}</td>
                <td style={styles.td}><span style={styles.badge}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Componente principal
───────────────────────────────────────── */
export default function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  function handleLogin(u) { setUser(u); setShowAuth(false); }
  function handleLogout() { setUser(null); }

  return (
    <div style={styles.root}>
      <Header user={user} onLoginClick={() => setShowAuth(true)} onLogout={handleLogout} />

      <div style={styles.layout}>
        <Sidebar user={user} activeNav={activeNav} setActiveNav={setActiveNav}
          onLoginClick={() => setShowAuth(true)} />

        <main style={styles.main}>
          {user ? (
            <DashboardView user={user} activeNav={activeNav} />
          ) : (
            <div style={styles.guestPlaceholder}>
              <span style={{ fontSize: 56 }}>🏪</span>
              <h2 style={{ color: "#1a1a1a", margin: "16px 0 8px" }}>Bem-vindo ao BazarTech Solidário</h2>
              <p style={{ color: "#666", maxWidth: 400, textAlign: "center" }}>
                Faça login ou crie sua conta para gerenciar seu bazar beneficente com inteligência.
              </p>
              <button style={{ ...styles.primaryBtn, marginTop: 24, padding: "14px 32px", fontSize: 15 }}
                onClick={() => setShowAuth(true)}>
                Entrar / Criar conta
              </button>
            </div>
          )}
        </main>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} />}
    </div>
  );
}

/* ─────────────────────────────────────────
   Estilos
───────────────────────────────────────── */
const styles = {
  root: {
    fontFamily: "'Outfit', sans-serif",
    minHeight: "100vh",
    background: "#F5F2EE",
    color: "#1a1a1a",
  },

  /* Header */
  header: {
    background: "#fff",
    borderBottom: "1px solid #E8E4DF",
    padding: "12px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerLeft: { display: "flex", flexDirection: "column" },
  headerBrandTag: { fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#E85B2A", textTransform: "uppercase" },
  headerTitle: { margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1a1a" },
  headerRight: { display: "flex", alignItems: "center", gap: 12 },
  loginHeaderBtn: {
    background: "linear-gradient(135deg, #E85B2A 0%, #D94020 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 20px",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
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
    background: "linear-gradient(135deg, #E85B2A, #D94020)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 14,
  },
  logoutBtn: {
    marginLeft: 8,
    background: "none",
    border: "1px solid #E8E4DF",
    borderRadius: 8,
    padding: "4px 10px",
    fontSize: 12,
    cursor: "pointer",
    color: "#888",
    fontFamily: "'Outfit', sans-serif",
  },

  /* Layout */
  layout: { display: "flex", minHeight: "calc(100vh - 57px)" },

  /* Sidebar */
  sidebar: {
    width: 240,
    background: "linear-gradient(180deg, #D94020 0%, #C03318 100%)",
    padding: "16px 12px",
    flexShrink: 0,
  },
  bazarCard: {
    background: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    padding: "16px 14px",
    backdropFilter: "blur(4px)",
    marginBottom: 8,
  },
  bazarCardLabel: { margin: "0 0 4px", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.7)", textTransform: "uppercase" },
  bazarCardTitle: { margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1.3 },
  bazarCardSub: { margin: 0, fontSize: 11, color: "rgba(255,255,255,0.75)" },
  sidebarLoginBtn: {
    marginTop: 12,
    width: "100%",
    background: "#fff",
    color: "#D94020",
    border: "none",
    borderRadius: 8,
    padding: "8px 0",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    background: "none",
    border: "none",
    borderRadius: 10,
    padding: "11px 12px",
    color: "rgba(255,255,255,0.85)",
    fontFamily: "'Outfit', sans-serif",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.15s",
  },
  navItemActive: {
    background: "#fff",
    color: "#D94020",
    fontWeight: 700,
  },
  navIcon: { fontSize: 16, width: 22, textAlign: "center" },

  /* Main content */
  main: { flex: 1, padding: 24, overflow: "auto" },

  /* Hero banner */
  heroBanner: {
    background: "linear-gradient(135deg, #E85B2A 0%, #C03318 100%)",
    borderRadius: 18,
    padding: "28px 32px",
    marginBottom: 20,
  },
  heroTag: { margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: 1.5 },
  heroTitle: { margin: "0 0 8px", fontSize: 32, fontWeight: 800, color: "#fff" },
  heroSub: { margin: 0, fontSize: 14, color: "rgba(255,255,255,0.85)", maxWidth: 520 },

  /* Stats */
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    background: "#fff",
    borderRadius: 14,
    padding: "16px 18px",
    border: "1px solid #F0EBE5",
  },
  statLabel: { margin: "0 0 4px", fontSize: 12, color: "#999", fontWeight: 500 },
  statValue: { margin: 0, fontSize: 22, fontWeight: 700 },

  /* Section */
  section: {
    background: "#fff",
    borderRadius: 16,
    padding: "24px",
    border: "1px solid #F0EBE5",
  },
  sectionTitle: { margin: "0 0 4px", fontSize: 20, fontWeight: 700 },
  sectionSub: { margin: "0 0 20px", fontSize: 13, color: "#999" },

  /* Form row */
  formRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "flex-end",
  },

  /* Input */
  input: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 14,
    border: "1.5px solid #E8E4DF",
    borderRadius: 10,
    padding: "10px 12px",
    outline: "none",
    background: "#FAFAF9",
    color: "#1a1a1a",
    transition: "border-color 0.15s",
  },

  /* Button */
  primaryBtn: {
    background: "linear-gradient(135deg, #E85B2A 0%, #D94020 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 18px",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  /* Table */
  table: { width: "100%", marginTop: 16, borderCollapse: "collapse", fontSize: 13 },
  tableHead: { background: "#F9F7F5" },
  tableRow: { borderBottom: "1px solid #F0EBE5" },
  th: { padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#666", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 },
  td: { padding: "10px 12px", color: "#444" },
  badge: {
    background: "#EAFAF1",
    color: "#1E8449",
    borderRadius: 6,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 600,
  },

  /* Empty state */
  emptyState: {
    textAlign: "center",
    padding: "40px 0",
    color: "#bbb",
    fontSize: 14,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },

  /* Guest placeholder */
  guestPlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 400,
    color: "#888",
  },

  /* Modal */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    backdropFilter: "blur(2px)",
  },
  modalBox: {
    background: "#fff",
    borderRadius: 20,
    padding: "32px 28px",
    width: "100%",
    maxWidth: 400,
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },
  modalLogo: {
    fontSize: 40,
    background: "linear-gradient(135deg, #FDE8DF, #FAC4AD)",
    width: 72,
    height: 72,
    borderRadius: 18,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  modalBrand: { margin: 0, fontWeight: 700, fontSize: 18, color: "#1a1a1a" },
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
    background: "none",
    border: "none",
    borderRadius: 9,
    padding: "9px 0",
    fontFamily: "'Outfit', sans-serif",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    color: "#888",
    transition: "all 0.15s",
  },
  tabBtnActive: {
    background: "#fff",
    color: "#D94020",
    fontWeight: 700,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  inputLabel: { display: "block", marginBottom: 4, fontSize: 12, fontWeight: 600, color: "#555" },
  errorMsg: {
    background: "#FEE",
    border: "1px solid #FAC5C5",
    borderRadius: 8,
    padding: "8px 12px",
    color: "#C0392B",
    fontSize: 13,
    marginTop: 8,
    margin: "8px 0 0",
  },
  forgotLink: {
    textAlign: "center",
    marginTop: 14,
    fontSize: 13,
    color: "#aaa",
  },
};