import { useEffect, useState } from "react";
import { cadastrar, login, logout } from "./firebase/auth";
import auth from "./firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

const NAV_ITEMS = [
  { id: "dashboard", icon: "📊", label: "Painel Principal" },
  { id: "evento", icon: "📅", label: "Evento" },
  { id: "produtos", icon: "🛍️", label: "Produtos" },
  { id: "doacoes", icon: "🎁", label: "Doações" },
  { id: "vendas", icon: "💰", label: "Vendas" },
  { id: "ia", icon: "🤖", label: "Assistente IA" },
];

const CATEGORIES = ["Roupas", "Calçados", "Brinquedos", "Eletrônicos", "Livros", "Decoração", "Outros"];
const CONDITIONS = ["Novo", "Ótimo", "Bom", "Regular"];

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

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

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
        setError("Não foi possível acessar. Verifique os dados.");
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
            style={{ ...styles.tabBtn, ...(tab === "login" ? styles.tabBtnActive : {}) }}
            onClick={() => setTab("login")}
          >
            Entrar
          </button>
          <button
            style={{ ...styles.tabBtn, ...(tab === "register" ? styles.tabBtnActive : {}) }}
            onClick={() => setTab("register")}
          >
            Criar conta
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tab === "register" && (
            <>
              <InputField label="Seu nome" value={form.name} onChange={set("name")} placeholder="Ex: Lukas Gestor" />
              <InputField label="Nome do bazar" value={form.bazar} onChange={set("bazar")} placeholder="Ex: Bazar Beneficente" />
            </>
          )}

          <InputField label="E-mail" type="email" value={form.email} onChange={set("email")} placeholder="lukasgestor@gmail.com" />
          <InputField label="Senha" type="password" value={form.password} onChange={set("password")} placeholder="Mínimo 6 caracteres" />

          {tab === "register" && (
            <InputField label="Confirmar senha" type="password" value={form.confirm} onChange={set("confirm")} placeholder="Repita sua senha" />
          )}
        </div>

        {error && <p style={styles.errorMsg}>{error}</p>}

        <button
          style={{ ...styles.primaryBtn, width: "100%", marginTop: 20 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Aguarde..." : tab === "login" ? "Entrar" : "Criar minha conta"}
        </button>
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

function Header({ user, onLoginClick, onLogout }) {
  return (
    <header style={styles.header}>
      <div>
        <span style={styles.headerBrandTag}>BAZARTECH SOLIDÁRIO</span>
        <h1 style={styles.headerTitle}>Gestão Inteligente do Bazar</h1>
      </div>

      {user ? (
        <div style={styles.userBadge}>
          <div style={styles.userAvatar}>{user.name[0].toUpperCase()}</div>
          <div>
            <p style={{ margin: 0, fontWeight: 700 }}>{user.name}</p>
            <p style={{ margin: 0, fontSize: 12, color: "#777" }}>{user.email}</p>
          </div>
          <button style={styles.logoutBtn} onClick={onLogout}>Sair</button>
        </div>
      ) : (
        <button style={styles.loginHeaderBtn} onClick={onLoginClick}>Entrar / Cadastrar</button>
      )}
    </header>
  );
}

function Sidebar({ user, activeNav, setActiveNav, onLoginClick }) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.bazarCard}>
        <p style={styles.bazarCardLabel}>Meu Bazar</p>
        <h2 style={styles.bazarCardTitle}>{user ? user.bazar : "Faça login para continuar"}</h2>
        {user ? <p style={styles.bazarCardSub}>Administrador ativo</p> : (
          <button style={styles.sidebarLoginBtn} onClick={onLoginClick}>Entrar agora</button>
        )}
      </div>

      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          style={{ ...styles.navItem, ...(activeNav === item.id ? styles.navItemActive : {}) }}
          onClick={() => setActiveNav(item.id)}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}

function DashboardView({ user }) {
  return (
    <div>
      <div style={styles.heroBanner}>
        <p style={styles.heroTag}>Administração do bazar</p>
        <h2 style={styles.heroTitle}>{user?.bazar || "Seu Bazar"}</h2>
        <p style={styles.heroSub}>Atualize os dados públicos, registre itens, vendas e acompanhe os resultados.</p>
      </div>

      <div style={styles.statsGrid}>
        <Stat label="Arrecadado" value="R$ 0,00" icon="📈" />
        <Stat label="Produtos" value="0" icon="🛍️" />
        <Stat label="Vendidos" value="0" icon="✅" />
        <Stat label="Disponível" value="0" icon="📦" />
        <Stat label="Doações" value="0" icon="🎁" />
      </div>

      <ProductsSection />
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statLabel}>{label}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={styles.statValue}>{value}</p>
        <span style={{ fontSize: 28 }}>{icon}</span>
      </div>
    </div>
  );
}

function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "Roupas",
    size: "",
    condition: "Bom",
    qty: 1,
    price: 0,
  });
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

      <div style={styles.formRow}>
        <input style={{ ...styles.input, flex: 2 }} placeholder="Nome do produto" value={form.name} onChange={set("name")} />
        <select style={{ ...styles.input, flex: 1 }} value={form.category} onChange={set("category")}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input style={{ ...styles.input, flex: 1 }} placeholder="Tamanho" value={form.size} onChange={set("size")} />
        <select style={{ ...styles.input, flex: 1 }} value={form.condition} onChange={set("condition")}>
          {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input style={{ ...styles.input, width: 80 }} type="number" min="1" value={form.qty} onChange={set("qty")} />
        <input style={{ ...styles.input, width: 90 }} type="number" min="0" value={form.price} onChange={set("price")} />
        <button style={styles.primaryBtn} onClick={addProduct}>Adicionar</button>
      </div>

      <input
        style={{ ...styles.input, width: "100%", marginTop: 12 }}
        placeholder="Buscar por produto ou categoria..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

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
                <td style={styles.td}>R$ {Number(p.price).toFixed(2).replace(".", ",")}</td>
                <td style={styles.td}><span style={styles.badge}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
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

  function handleLogin(u) {
    setUser(u);
    setShowAuth(false);
  }

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  return (
    <div style={styles.root}>
      <Header user={user} onLoginClick={() => setShowAuth(true)} onLogout={handleLogout} />

      <div style={styles.layout}>
        <Sidebar user={user} activeNav={activeNav} setActiveNav={setActiveNav} onLoginClick={() => setShowAuth(true)} />

        <main style={styles.main}>
          {user ? (
            <DashboardView user={user} activeNav={activeNav} />
          ) : (
            <div style={styles.guestPlaceholder}>
              <span style={{ fontSize: 56 }}>🏪</span>
              <h2>Bem-vindo ao BazarTech Solidário</h2>
              <p>Faça login ou crie sua conta para gerenciar seu bazar beneficente.</p>
              <button style={styles.primaryBtn} onClick={() => setShowAuth(true)}>
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

const styles = {
  root: {
    fontFamily: "Arial, sans-serif",
    minHeight: "100vh",
    background: "#F5F2EE",
    color: "#1a1a1a",
  },
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
  },
  layout: {
    display: "flex",
    minHeight: "calc(100vh - 65px)",
  },
  sidebar: {
    width: 240,
    background: "linear-gradient(180deg, #D94020 0%, #C03318 100%)",
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
    letterSpacing: 1.5,
  },
  bazarCardTitle: {
    color: "#fff",
    margin: 0,
    fontSize: 18,
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
    background: "transparent",
    border: "none",
    borderRadius: 10,
    padding: "12px",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left",
  },
  navItemActive: {
    background: "#fff",
    color: "#D94020",
  },
  main: {
    flex: 1,
    padding: 24,
    overflow: "auto",
  },
  heroBanner: {
    background: "linear-gradient(135deg, #E85B2A 0%, #C03318 100%)",
    borderRadius: 18,
    padding: "28px 32px",
    marginBottom: 20,
    color: "#fff",
  },
  heroTag: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  heroTitle: {
    margin: 0,
    fontSize: 32,
    fontWeight: 800,
  },
  heroSub: {
    fontSize: 14,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    background: "#fff",
    borderRadius: 14,
    padding: 16,
    border: "1px solid #F0EBE5",
  },
  statLabel: {
    fontSize: 12,
    color: "#777",
    margin: 0,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 800,
    margin: 0,
    color: "#D94020",
  },
  section: {
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    border: "1px solid #F0EBE5",
  },
  sectionTitle: {
    margin: 0,
    fontSize: 22,
  },
  sectionSub: {
    color: "#777",
    fontSize: 14,
  },
  formRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  input: {
    fontSize: 14,
    border: "1.5px solid #E8E4DF",
    borderRadius: 10,
    padding: "10px 12px",
    background: "#FAFAF9",
  },
  primaryBtn: {
    background: "#E85B2A",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 18px",
    fontWeight: 700,
    cursor: "pointer",
  },
  table: {
    width: "100%",
    marginTop: 16,
    borderCollapse: "collapse",
    fontSize: 13,
  },
  tableHead: {
    background: "#F9F7F5",
  },
  tableRow: {
    borderBottom: "1px solid #F0EBE5",
  },
  th: {
    padding: 12,
    textAlign: "left",
  },
  td: {
    padding: 12,
  },
  badge: {
    background: "#EAFAF1",
    color: "#1E8449",
    borderRadius: 6,
    padding: "4px 10px",
    fontWeight: 700,
  },
  emptyState: {
    textAlign: "center",
    padding: 40,
    color: "#999",
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
    zIndex: 999,
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
    background: "none",
    border: "none",
    borderRadius: 9,
    padding: "10px 0",
    cursor: "pointer",
  },
  tabBtnActive: {
    background: "#fff",
    color: "#D94020",
    fontWeight: 800,
  },
  inputLabel: {
    display: "block",
    marginBottom: 4,
    fontSize: 12,
    fontWeight: 700,
  },
  errorMsg: {
    background: "#FEE",
    border: "1px solid #FAC5C5",
    borderRadius: 8,
    padding: 10,
    color: "#C0392B",
    fontSize: 13,
    marginTop: 10,
  },
};