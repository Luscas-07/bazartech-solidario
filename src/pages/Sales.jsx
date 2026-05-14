import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";

const PAGAMENTOS = [
  "Dinheiro",
  "Pix",
  "Cartão de débito",
  "Cartão de crédito",
  "Outro",
];

export default function Sales() {
  const { produtos, vendas, registrarVenda } = useApp();

  const produtosDisponiveis = produtos.filter(
    (produto) => produto.status === "Disponível"
  );

  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [valor, setValor] = useState("");
  const [comprador, setComprador] = useState("");
  const [pagamento, setPagamento] = useState("Pix");

  const produtoAtual = produtos.find(
    (produto) => produto.id === produtoSelecionado
  );

  function confirmarVenda() {
    if (!produtoAtual) return;

    registrarVenda({
      produtoId: produtoAtual.id,
      produtoNome: produtoAtual.nome,
      valor: Number(valor || produtoAtual.preco),
      comprador,
      pagamento,
    });

    alert("Venda registrada com sucesso!");

    setProdutoSelecionado("");
    setValor("");
    setComprador("");
    setPagamento("Pix");
  }

  const resumo = useMemo(() => {
    const total = vendas.reduce(
      (soma, venda) => soma + Number(venda.valor),
      0
    );

    return {
      total,
      quantidade: vendas.length,
      ticketMedio: vendas.length ? total / vendas.length : 0,
    };
  }, [vendas]);

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <p style={styles.tag}>PDV simplificado</p>

        <h1 style={styles.title}>Registro de Vendas</h1>

        <p style={styles.subtitle}>
          Registre vendas rapidamente e atualize o estoque automaticamente.
        </p>
      </section>

      <section style={styles.statsGrid}>
        <Stat
          titulo="Total arrecadado"
          valor={formatarMoeda(resumo.total)}
        />

        <Stat
          titulo="Número de vendas"
          valor={resumo.quantidade}
        />

        <Stat
          titulo="Ticket médio"
          valor={formatarMoeda(resumo.ticketMedio)}
        />
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Nova venda</h2>

        <div style={styles.formGrid}>
          <select
            style={styles.input}
            value={produtoSelecionado}
            onChange={(e) => {
              setProdutoSelecionado(e.target.value);

              const produto = produtos.find(
                (p) => p.id === e.target.value
              );

              if (produto) {
                setValor(produto.preco);
              }
            }}
          >
            <option value="">Selecione um produto</option>

            {produtosDisponiveis.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.id} — {produto.nome}
              </option>
            ))}
          </select>

          <input
            style={styles.input}
            placeholder="Valor final"
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Comprador (opcional)"
            value={comprador}
            onChange={(e) => setComprador(e.target.value)}
          />

          <select
            style={styles.input}
            value={pagamento}
            onChange={(e) => setPagamento(e.target.value)}
          >
            {PAGAMENTOS.map((tipo) => (
              <option key={tipo}>{tipo}</option>
            ))}
          </select>

          <button style={styles.primaryBtn} onClick={confirmarVenda}>
            Confirmar venda
          </button>
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Histórico de vendas</h2>

        {vendas.length === 0 ? (
          <div style={styles.empty}>
            Nenhuma venda registrada ainda.
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Valor</th>
                  <th>Pagamento</th>
                  <th>Comprador</th>
                  <th>Data</th>
                </tr>
              </thead>

              <tbody>
                {[...vendas].reverse().map((venda) => (
                  <tr key={venda.id}>
                    <td>{venda.produtoNome}</td>

                    <td>
                      {formatarMoeda(venda.valor)}
                    </td>

                    <td>{venda.pagamento}</td>

                    <td>
                      {venda.comprador || "Não informado"}
                    </td>

                    <td>
                      {new Date(venda.data).toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ titulo, valor }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statLabel}>{titulo}</p>

      <h2 style={styles.statValue}>{valor}</h2>
    </div>
  );
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
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
    letterSpacing: 2,
    textTransform: "uppercase",
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

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 14,
  },

  statCard: {
    background: "#fff",
    border: "1px solid #F0EBE5",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },

  statLabel: {
    margin: 0,
    color: "#777",
    fontSize: 13,
  },

  statValue: {
    margin: "8px 0 0",
    color: "#E85B2A",
    fontSize: 28,
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
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 12,
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

  empty: {
    textAlign: "center",
    padding: 30,
    color: "#999",
  },
};