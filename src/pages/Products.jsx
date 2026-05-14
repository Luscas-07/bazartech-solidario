import Products from "./pages/Products";
import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";

const CATEGORIAS = [
  "Roupas Femininas",
  "Roupas Masculinas",
  "Roupas Infantis",
  "Calçados",
  "Acessórios",
  "Brinquedos",
  "Livros",
  "Utensílios",
  "Eletrônicos",
  "Outros",
];

const ESTADOS = ["Novo", "Ótimo", "Bom", "Regular"];

export default function Products() {
  const { produtos, adicionarProduto, setProdutos } = useApp();

  const [form, setForm] = useState({
    nome: "",
    categoria: "Roupas Femininas",
    tamanho: "",
    estado: "Bom",
    preco: "",
    quantidade: 1,
  });

  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [statusFiltro, setStatusFiltro] = useState("Todos");

  const set = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  function cadastrarProduto() {
    if (!form.nome || !form.preco) return;

    adicionarProduto({
      ...form,
      preco: Number(form.preco),
      quantidade: Number(form.quantidade),
    });

    setForm({
      nome: "",
      categoria: "Roupas Femininas",
      tamanho: "",
      estado: "Bom",
      preco: "",
      quantidade: 1,
    });
  }

  function excluirProduto(id) {
    const confirmar = confirm("Deseja excluir este produto?");

    if (!confirmar) return;

    setProdutos((lista) => lista.filter((p) => p.id !== id));
  }

  function alterarStatus(id, status) {
    setProdutos((lista) =>
      lista.map((produto) =>
        produto.id === id ? { ...produto, status } : produto
      )
    );
  }

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const matchBusca =
        produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
        produto.id.toLowerCase().includes(busca.toLowerCase());

      const matchCategoria =
        categoriaFiltro === "Todos" ||
        produto.categoria === categoriaFiltro;

      const matchStatus =
        statusFiltro === "Todos" ||
        produto.status === statusFiltro;

      return matchBusca && matchCategoria && matchStatus;
    });
  }, [produtos, busca, categoriaFiltro, statusFiltro]);

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <p style={styles.tag}>Estoque do bazar</p>

        <h1 style={styles.title}>Produtos e Estoque</h1>

        <p style={styles.subtitle}>
          Cadastre produtos, acompanhe disponibilidade e controle vendas.
        </p>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Cadastrar produto</h2>

        <div style={styles.formGrid}>
          <input
            style={styles.input}
            placeholder="Nome do produto"
            value={form.nome}
            onChange={set("nome")}
          />

          <select
            style={styles.input}
            value={form.categoria}
            onChange={set("categoria")}
          >
            {CATEGORIAS.map((categoria) => (
              <option key={categoria}>{categoria}</option>
            ))}
          </select>

          <input
            style={styles.input}
            placeholder="Tamanho"
            value={form.tamanho}
            onChange={set("tamanho")}
          />

          <select
            style={styles.input}
            value={form.estado}
            onChange={set("estado")}
          >
            {ESTADOS.map((estado) => (
              <option key={estado}>{estado}</option>
            ))}
          </select>

          <input
            style={styles.input}
            type="number"
            placeholder="Preço"
            value={form.preco}
            onChange={set("preco")}
          />

          <input
            style={styles.input}
            type="number"
            placeholder="Qtd"
            value={form.quantidade}
            onChange={set("quantidade")}
          />

          <button style={styles.primaryBtn} onClick={cadastrarProduto}>
            Cadastrar produto
          </button>
        </div>
      </section>

      <section style={styles.card}>
        <div style={styles.filterRow}>
          <input
            style={styles.input}
            placeholder="Buscar por nome ou ID"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <select
            style={styles.input}
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option>Todos</option>

            {CATEGORIAS.map((categoria) => (
              <option key={categoria}>{categoria}</option>
            ))}
          </select>

          <select
            style={styles.input}
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
          >
            <option>Todos</option>
            <option>Disponível</option>
            <option>Vendido</option>
            <option>Reservado</option>
            <option>Retirado</option>
          </select>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Tamanho</th>
                <th>Estado</th>
                <th>Preço</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {produtosFiltrados.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.id}</td>
                  <td>{produto.nome}</td>
                  <td>{produto.categoria}</td>
                  <td>{produto.tamanho || "—"}</td>
                  <td>{produto.estado}</td>

                  <td>
                    {Number(produto.preco).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>

                  <td>
                    <span
                      style={{
                        ...styles.status,
                        ...(produto.status === "Disponível"
                          ? styles.disponivel
                          : produto.status === "Vendido"
                          ? styles.vendido
                          : produto.status === "Reservado"
                          ? styles.reservado
                          : styles.retirado),
                      }}
                    >
                      {produto.status}
                    </span>
                  </td>

                  <td>
                    <div style={styles.actions}>
                      <button
                        style={styles.smallBtn}
                        onClick={() =>
                          alterarStatus(produto.id, "Disponível")
                        }
                      >
                        Disponível
                      </button>

                      <button
                        style={styles.smallBtn}
                        onClick={() =>
                          alterarStatus(produto.id, "Reservado")
                        }
                      >
                        Reservar
                      </button>

                      <button
                        style={styles.smallBtn}
                        onClick={() =>
                          alterarStatus(produto.id, "Vendido")
                        }
                      >
                        Vender
                      </button>

                      <button
                        style={styles.deleteBtn}
                        onClick={() => excluirProduto(produto.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {produtosFiltrados.length === 0 && (
            <div style={styles.empty}>
              Nenhum produto encontrado.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  hero: {
    background: "linear-gradient(135deg, #E85B2A, #C03318)",
    color: "#fff",
    borderRadius: 18,
    padding: 28,
  },

  tag: {
    margin: 0,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 2,
  },

  title: {
    margin: "8px 0",
    fontSize: 34,
    fontWeight: 800,
  },

  subtitle: {
    margin: 0,
    opacity: 0.9,
  },

  card: {
    background: "#fff",
    border: "1px solid #F0EBE5",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },

  sectionTitle: {
    marginTop: 0,
    fontSize: 22,
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
  },

  filterRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: 12,
    marginBottom: 20,
  },

  input: {
    width: "100%",
    border: "1px solid #E8E4DF",
    borderRadius: 10,
    padding: "12px",
    background: "#FAFAF9",
    fontSize: 14,
    boxSizing: "border-box",
  },

  primaryBtn: {
    border: "none",
    borderRadius: 10,
    background: "linear-gradient(135deg, #E85B2A, #C03318)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    padding: "12px 18px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  actions: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },

  smallBtn: {
    border: "none",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
    background: "#F5F2EE",
    fontSize: 12,
  },

  deleteBtn: {
    border: "none",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
    background: "#FDEDEC",
    color: "#C0392B",
    fontSize: 12,
  },

  status: {
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
  },

  disponivel: {
    background: "#EAFAF1",
    color: "#1E8449",
  },

  vendido: {
    background: "#FDEDEC",
    color: "#C0392B",
  },

  reservado: {
    background: "#FEF9E7",
    color: "#D68910",
  },

  retirado: {
    background: "#F2F3F4",
    color: "#717D7E",
  },

  empty: {
    textAlign: "center",
    padding: 30,
    color: "#999",
  },
};