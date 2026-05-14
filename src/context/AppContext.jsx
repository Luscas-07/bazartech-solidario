import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext();

const produtosIniciais = [
  { id: "#0001", nome: "Blusa floral manga longa", categoria: "Roupas Femininas", tamanho: "M", estado: "Bom", preco: 15, quantidade: 1, status: "Disponível" },
  { id: "#0002", nome: "Tênis esportivo", categoria: "Calçados", tamanho: "40", estado: "Ótimo", preco: 35, quantidade: 1, status: "Disponível" },
];

export function AppProvider({ children }) {
  const [produtos, setProdutos] = useState(() => {
    return JSON.parse(localStorage.getItem("produtos")) || produtosIniciais;
  });

  const [vendas, setVendas] = useState(() => {
    return JSON.parse(localStorage.getItem("vendas")) || [];
  });

  const [doacoes, setDoacoes] = useState(() => {
    return JSON.parse(localStorage.getItem("doacoes")) || [];
  });

  useEffect(() => {
    localStorage.setItem("produtos", JSON.stringify(produtos));
  }, [produtos]);

  useEffect(() => {
    localStorage.setItem("vendas", JSON.stringify(vendas));
  }, [vendas]);

  useEffect(() => {
    localStorage.setItem("doacoes", JSON.stringify(doacoes));
  }, [doacoes]);

  function adicionarProduto(produto) {
    const novoId = `#${String(produtos.length + 1).padStart(4, "0")}`;

    setProdutos([
      ...produtos,
      {
        ...produto,
        id: novoId,
        status: "Disponível",
      },
    ]);
  }

  function registrarVenda(venda) {
    setVendas([
      ...vendas,
      {
        ...venda,
        id: Date.now(),
        data: new Date().toISOString(),
      },
    ]);

    setProdutos((lista) =>
      lista.map((produto) =>
        produto.id === venda.produtoId
          ? { ...produto, status: "Vendido", quantidade: 0 }
          : produto
      )
    );
  }

  function registrarDoacao(doacao) {
    setDoacoes([
      ...doacoes,
      {
        ...doacao,
        id: Date.now(),
        data: new Date().toISOString(),
      },
    ]);
  }

  const resumo = useMemo(() => {
    const totalArrecadado = vendas.reduce((soma, venda) => soma + Number(venda.valor || 0), 0);
    const vendidos = produtos.filter((p) => p.status === "Vendido").length;
    const disponiveis = produtos.filter((p) => p.status === "Disponível").length;

    return {
      totalArrecadado,
      totalProdutos: produtos.length,
      vendidos,
      disponiveis,
      totalDoacoes: doacoes.length,
      ticketMedio: vendas.length ? totalArrecadado / vendas.length : 0,
    };
  }, [produtos, vendas, doacoes]);

  return (
    <AppContext.Provider
      value={{
        produtos,
        vendas,
        doacoes,
        resumo,
        adicionarProduto,
        registrarVenda,
        registrarDoacao,
        setProdutos,
        setVendas,
        setDoacoes,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}