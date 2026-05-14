import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "bazartech-solidario-v2";

export default function BazarTechSolidario() {
  const [aba, setAba] = useState("inicio");
  const [busca, setBusca] = useState("");

  const [evento, setEvento] = useState({
    nome: "Bazar Beneficente",
    data: "Em breve",
    horario: "A confirmar",
    local: "A.D. Dique do Tororó",
    endereco: "Avenida Vasco da Gama, 186",
    quentinha: "Não confirmado",
    cardapio: "A definir",
    valorQuentinha: "A definir",
    pix: "meunatalsolidario@gmail.com",
  });

  const [produtos, setProdutos] = useState([
    { id: 1, nome: "Camiseta", categoria: "Roupas", tamanho: "M", estado: "Bom", qtd: 10, valor: 12, status: "Disponível" },
    { id: 2, nome: "Tênis", categoria: "Calçados", tamanho: "42", estado: "Seminovo", qtd: 3, valor: 30, status: "Disponível" },
    { id: 3, nome: "Panela", categoria: "Utensílios", tamanho: "-", estado: "Bom", qtd: 1, valor: 20, status: "Vendido" },
  ]);

  const [vendas, setVendas] = useState([
    { id: 1, produto: "Camiseta", categoria: "Roupas", qtd: 2, valor: 12, pagamento: "PIX" },
    { id: 2, produto: "Panela", categoria: "Utensílios", qtd: 1, valor: 20, pagamento: "Dinheiro" },
  ]);

  const [doacoes, setDoacoes] = useState([
    { id: 1, doador: "Maria", produto: "Roupas infantis", categoria: "Roupas", qtd: 15, obs: "Bom estado" },
  ]);

  const [novoProduto, setNovoProduto] = useState({ nome: "", categoria: "Roupas", tamanho: "", estado: "Bom", qtd: 1, valor: 0, status: "Disponível" });
  const [novaVenda, setNovaVenda] = useState({ produto: "", categoria: "Roupas", qtd: 1, valor: 0, pagamento: "PIX" });
  const [novaDoacao, setNovaDoacao] = useState({ doador: "", produto: "", categoria: "Roupas", qtd: 1, obs: "" });

  useEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
      const dados = JSON.parse(salvo);
      setEvento(dados.evento || evento);
      setProdutos(dados.produtos || produtos);
      setVendas(dados.vendas || vendas);
      setDoacoes(dados.doacoes || doacoes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ evento, produtos, vendas, doacoes }));
  }, [evento, produtos, vendas, doacoes]);

  const resumo = useMemo(() => {
    const totalArrecadado = vendas.reduce((s, v) => s + Number(v.qtd) * Number(v.valor), 0);
    const totalProdutos = produtos.reduce((s, p) => s + Number(p.qtd), 0);
    const vendidos = produtos.filter((p) => p.status === "Vendido").length;
    const disponiveis = produtos.filter((p) => p.status === "Disponível").length;
    const totalDoacoes = doacoes.reduce((s, d) => s + Number(d.qtd), 0);
    return { totalArrecadado, totalProdutos, vendidos, disponiveis, totalDoacoes };
  }, [produtos, vendas, doacoes]);

  const produtosFiltrados = produtos.filter((p) => `${p.nome} ${p.categoria} ${p.status}`.toLowerCase().includes(busca.toLowerCase()));

  function dinheiro(valor) {
    return `R$ ${Number(valor || 0).toFixed(2).replace(".", ",")}`;
  }

  function adicionarProduto() {
    if (!novoProduto.nome.trim()) return;
    setProdutos([...produtos, { ...novoProduto, id: Date.now(), qtd: Number(novoProduto.qtd), valor: Number(novoProduto.valor) }]);
    setNovoProduto({ nome: "", categoria: "Roupas", tamanho: "", estado: "Bom", qtd: 1, valor: 0, status: "Disponível" });
  }

  function adicionarVenda() {
    if (!novaVenda.produto.trim()) return;
    setVendas([...vendas, { ...novaVenda, id: Date.now(), qtd: Number(novaVenda.qtd), valor: Number(novaVenda.valor) }]);
    setNovaVenda({ produto: "", categoria: "Roupas", qtd: 1, valor: 0, pagamento: "PIX" });
  }

  function adicionarDoacao() {
    if (!novaDoacao.produto.trim()) return;
    setDoacoes([...doacoes, { ...novaDoacao, id: Date.now(), qtd: Number(novaDoacao.qtd) }]);
    setNovaDoacao({ doador: "", produto: "", categoria: "Roupas", qtd: 1, obs: "" });
  }

  function exportarCSV() {
    const linhas = [["Produto", "Categoria", "Tamanho", "Estado", "Quantidade", "Valor", "Status"], ...produtos.map(p => [p.nome, p.categoria, p.tamanho, p.estado, p.qtd, p.valor, p.status])];
    const csv = linhas.map(l => l.join(";")).join("\\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "produtos-bazar.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const mensagemDivulgacao = `✨ ${evento.nome} ✨

📍 Local: ${evento.local}
🏠 Endereço: ${evento.endereco}
📅 Data: ${evento.data}
⏰ Horário: ${evento.horario}

Teremos roupas, calçados, utensílios e muito mais.
${evento.quentinha === "Sim" ? `🍽️ Também teremos ${evento.cardapio} por ${evento.valorQuentinha}.
` : ""}
PIX para colaboração: ${evento.pix}

Participe e ajude essa ação solidária! ❤️`;

  return (
    <div className="min-h-screen bg-[#fff7ed] text-stone-900">
      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-3 md:p-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-600">BazarTech Solidário</p>
            <h1 className="text-lg font-black md:text-2xl">Gestão Inteligente do Bazar</h1>
          </div>
          <button onClick={exportarCSV} className="hidden rounded-xl bg-stone-900 px-4 py-2 text-sm font-bold text-white md:block">Exportar CSV</button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 p-3 md:grid-cols-[260px_1fr] md:p-6">
        <aside className="rounded-3xl bg-gradient-to-b from-orange-600 to-red-600 p-4 text-white shadow-xl md:sticky md:top-24 md:h-[calc(100vh-7rem)]">
          <div className="mb-5 rounded-2xl bg-white/15 p-4">
            <p className="text-sm opacity-90">Evento atual</p>
            <h2 className="text-2xl font-black">{evento.nome}</h2>
            <p className="mt-1 text-sm">📍 {evento.local}</p>
          </div>
          <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
            {menu.map((item) => (
              <button key={item.id} onClick={() => setAba(item.id)} className={`rounded-2xl px-4 py-3 text-left font-bold transition ${aba === item.id ? "bg-white text-orange-700 shadow" : "bg-white/10 hover:bg-white/20"}`}>
                <span className="mr-2">{item.icone}</span>{item.nome}
              </button>
            ))}
          </nav>
          <button onClick={exportarCSV} className="mt-3 w-full rounded-2xl bg-white/20 px-4 py-3 font-bold md:hidden">Exportar CSV</button>
        </aside>

        <section className="space-y-5">
          <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-red-600 p-5 text-white shadow-lg md:p-8">
            <p className="font-semibold opacity-90">Projeto de Extensão com IA</p>
            <h2 className="mt-1 text-3xl font-black md:text-5xl">Organização, vendas e impacto social</h2>
            <p className="mt-3 max-w-3xl text-white/90">Sistema responsivo para celular, tablet, notebook e computador, com dados salvos automaticamente no navegador.</p>
          </div>

          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Card titulo="Arrecadado" valor={dinheiro(resumo.totalArrecadado)} icone="📊" />
            <Card titulo="Produtos" valor={resumo.totalProdutos} icone="🛍️" />
            <Card titulo="Vendidos" valor={resumo.vendidos} icone="✅" />
            <Card titulo="Disponíveis" valor={resumo.disponiveis} icone="📦" />
            <Card titulo="Doações" valor={resumo.totalDoacoes} icone="🎁" />
          </section>

          {aba === "inicio" && <Inicio resumo={resumo} dinheiro={dinheiro} setAba={setAba} />}

          {aba === "evento" && (
            <Painel titulo="Configurações do Evento" descricao="Edite as informações que aparecerão na divulgação automática.">
              <div className="grid gap-4 md:grid-cols-2">
                {Object.keys(evento).map((campo) => (
                  <label key={campo} className="space-y-1">
                    <span className="text-sm font-bold capitalize text-stone-600">{campo.replace(/([A-Z])/g, " $1")}</span>
                    <input className="w-full rounded-2xl border border-orange-100 bg-orange-50/50 p-3 outline-none focus:border-orange-500" value={evento[campo]} onChange={(e) => setEvento({ ...evento, [campo]: e.target.value })} />
                  </label>
                ))}
              </div>
            </Painel>
          )}

          {aba === "produtos" && (
            <Painel titulo="Produtos e Estoque" descricao="Cadastre itens, filtre a lista e controle o status de cada produto.">
              <div className="mb-4 grid gap-3 lg:grid-cols-8">
                <input className="rounded-2xl border p-3 lg:col-span-2" placeholder="Produto" value={novoProduto.nome} onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })} />
                <select className="rounded-2xl border p-3" value={novoProduto.categoria} onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}>{categorias.map(c => <option key={c}>{c}</option>)}</select>
                <input className="rounded-2xl border p-3" placeholder="Tamanho" value={novoProduto.tamanho} onChange={(e) => setNovoProduto({ ...novoProduto, tamanho: e.target.value })} />
                <select className="rounded-2xl border p-3" value={novoProduto.estado} onChange={(e) => setNovoProduto({ ...novoProduto, estado: e.target.value })}>{estados.map(c => <option key={c}>{c}</option>)}</select>
                <input className="rounded-2xl border p-3" type="number" placeholder="Qtd" value={novoProduto.qtd} onChange={(e) => setNovoProduto({ ...novoProduto, qtd: e.target.value })} />
                <input className="rounded-2xl border p-3" type="number" placeholder="Valor" value={novoProduto.valor} onChange={(e) => setNovoProduto({ ...novoProduto, valor: e.target.value })} />
                <button onClick={adicionarProduto} className="rounded-2xl bg-orange-600 p-3 font-black text-white hover:bg-orange-700">Adicionar</button>
              </div>
              <input className="mb-4 w-full rounded-2xl border bg-white p-3" placeholder="Buscar por produto, categoria ou status..." value={busca} onChange={(e) => setBusca(e.target.value)} />
              <TabelaProdutos produtos={produtosFiltrados} setProdutos={setProdutos} todosProdutos={produtos} dinheiro={dinheiro} />
            </Painel>
          )}

          {aba === "doacoes" && (
            <Painel titulo="Registro de Doações" descricao="Controle as doações recebidas para manter o histórico organizado.">
              <div className="grid gap-3 lg:grid-cols-6">
                <input className="rounded-2xl border p-3" placeholder="Doador" value={novaDoacao.doador} onChange={(e) => setNovaDoacao({ ...novaDoacao, doador: e.target.value })} />
                <input className="rounded-2xl border p-3" placeholder="Produto" value={novaDoacao.produto} onChange={(e) => setNovaDoacao({ ...novaDoacao, produto: e.target.value })} />
                <select className="rounded-2xl border p-3" value={novaDoacao.categoria} onChange={(e) => setNovaDoacao({ ...novaDoacao, categoria: e.target.value })}>{categorias.map(c => <option key={c}>{c}</option>)}</select>
                <input className="rounded-2xl border p-3" type="number" placeholder="Qtd" value={novaDoacao.qtd} onChange={(e) => setNovaDoacao({ ...novaDoacao, qtd: e.target.value })} />
                <input className="rounded-2xl border p-3" placeholder="Observação" value={novaDoacao.obs} onChange={(e) => setNovaDoacao({ ...novaDoacao, obs: e.target.value })} />
                <button onClick={adicionarDoacao} className="rounded-2xl bg-orange-600 p-3 font-black text-white">Adicionar</button>
              </div>
              <TabelaSimples linhas={doacoes} remover={(id) => setDoacoes(doacoes.filter(d => d.id !== id))} />
            </Painel>
          )}

          {aba === "vendas" && (
            <Painel titulo="Registro de Vendas" descricao="Registre as vendas e acompanhe automaticamente o total arrecadado.">
              <div className="grid gap-3 lg:grid-cols-6">
                <input className="rounded-2xl border p-3" placeholder="Produto" value={novaVenda.produto} onChange={(e) => setNovaVenda({ ...novaVenda, produto: e.target.value })} />
                <select className="rounded-2xl border p-3" value={novaVenda.categoria} onChange={(e) => setNovaVenda({ ...novaVenda, categoria: e.target.value })}>{categorias.map(c => <option key={c}>{c}</option>)}</select>
                <input className="rounded-2xl border p-3" type="number" placeholder="Qtd" value={novaVenda.qtd} onChange={(e) => setNovaVenda({ ...novaVenda, qtd: e.target.value })} />
                <input className="rounded-2xl border p-3" type="number" placeholder="Valor" value={novaVenda.valor} onChange={(e) => setNovaVenda({ ...novaVenda, valor: e.target.value })} />
                <select className="rounded-2xl border p-3" value={novaVenda.pagamento} onChange={(e) => setNovaVenda({ ...novaVenda, pagamento: e.target.value })}>{["PIX", "Dinheiro", "Cartão", "Cortesia"].map(c => <option key={c}>{c}</option>)}</select>
                <button onClick={adicionarVenda} className="rounded-2xl bg-orange-600 p-3 font-black text-white">Adicionar</button>
              </div>
              <TabelaSimples linhas={vendas.map(v => ({ ...v, total: dinheiro(v.qtd * v.valor) }))} remover={(id) => setVendas(vendas.filter(v => v.id !== id))} />
            </Painel>
          )}

          {aba === "ia" && (
            <div className="grid gap-4 lg:grid-cols-2">
              <Painel titulo="🤖 Apoio da IA" descricao="Área demonstrativa para mostrar como a IA contribui no projeto.">
                <div className="space-y-3">
                  <IABox titulo="Sugestão de preço" texto="A IA pode analisar categoria, estado e público do bazar para sugerir preços acessíveis." />
                  <IABox titulo="Descrição automática" texto="A IA pode criar descrições curtas e atrativas para divulgar produtos." />
                  <IABox titulo="Análise dos resultados" texto="A IA pode gerar relatório com pontos fortes, dificuldades e melhorias para o próximo bazar." />
                </div>
              </Painel>
              <Painel titulo="📣 Divulgação Automática" descricao="Mensagem pronta para copiar e enviar no WhatsApp ou Instagram.">
                <textarea className="h-72 w-full rounded-2xl border bg-orange-50 p-4" value={mensagemDivulgacao} readOnly />
              </Painel>
            </div>
          )}

          {aba === "relatorio" && (
            <Painel titulo="Relatório do Projeto" descricao="Resumo pronto para usar na apresentação acadêmica.">
              <div className="rounded-2xl bg-orange-50 p-5 leading-8">
                <p>O sistema <b>BazarTech Solidário</b> auxilia a igreja na organização do bazar beneficente, oferecendo controle de produtos, doações e vendas.</p>
                <p>Foram cadastrados <b>{resumo.totalProdutos}</b> itens, com arrecadação registrada de <b>{dinheiro(resumo.totalArrecadado)}</b>.</p>
                <p>A inteligência artificial apoia o projeto com sugestões de preço, criação de mensagens de divulgação e análise dos resultados para melhorar os próximos eventos.</p>
              </div>
            </Painel>
          )}
        </section>
      </main>
    </div>
  );
}

const categorias = ["Roupas", "Calçados", "Utensílios", "Acessórios", "Brinquedos", "Livros", "Outros"];
const estados = ["Novo", "Seminovo", "Bom", "Regular"];
const statusLista = ["Disponível", "Vendido", "Reservado", "Doado"];
const menu = [
  { id: "inicio", nome: "Início", icone: "🏠" },
  { id: "evento", nome: "Evento", icone: "📅" },
  { id: "produtos", nome: "Produtos", icone: "🛍️" },
  { id: "doacoes", nome: "Doações", icone: "🎁" },
  { id: "vendas", nome: "Vendas", icone: "💰" },
  { id: "ia", nome: "IA", icone: "🤖" },
  { id: "relatorio", nome: "Relatório", icone: "📄" },
];

function Inicio({ resumo, dinheiro, setAba }) {
  return <Painel titulo="Visão Geral" descricao="Acompanhe rapidamente a situação do bazar.">
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-3xl bg-orange-100 p-5">
        <h3 className="text-xl font-black text-orange-800">Resultado parcial</h3>
        <p className="mt-2 text-4xl font-black">{dinheiro(resumo.totalArrecadado)}</p>
        <p className="mt-2 text-sm text-stone-600">Total registrado nas vendas.</p>
      </div>
      <div className="rounded-3xl bg-red-100 p-5">
        <h3 className="text-xl font-black text-red-800">Estoque</h3>
        <p className="mt-2 text-4xl font-black">{resumo.totalProdutos}</p>
        <p className="mt-2 text-sm text-stone-600">Itens cadastrados no sistema.</p>
      </div>
      <div className="rounded-3xl bg-stone-100 p-5">
        <h3 className="text-xl font-black text-stone-800">Próxima ação</h3>
        <p className="mt-2 text-sm text-stone-600">Cadastre produtos, registre vendas e use a aba IA para gerar divulgação.</p>
        <button onClick={() => setAba("produtos")} className="mt-4 rounded-2xl bg-stone-900 px-4 py-3 font-bold text-white">Cadastrar produto</button>
      </div>
    </div>
  </Painel>;
}

function Card({ titulo, valor, icone }) {
  return <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-orange-100"><div className="flex items-center justify-between"><div><p className="text-sm font-bold text-stone-500">{titulo}</p><p className="text-2xl font-black text-orange-700">{valor}</p></div><div className="rounded-2xl bg-orange-100 p-3 text-2xl">{icone}</div></div></div>;
}

function Painel({ titulo, descricao, children }) {
  return <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-orange-100 md:p-6"><div className="mb-5"><h2 className="text-2xl font-black md:text-3xl">{titulo}</h2>{descricao && <p className="mt-1 text-sm text-stone-500">{descricao}</p>}</div>{children}</section>;
}

function IABox({ titulo, texto }) {
  return <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4"><h3 className="font-black text-orange-800">{titulo}</h3><p className="text-sm text-stone-600">{texto}</p></div>;
}

function TabelaProdutos({ produtos, setProdutos, todosProdutos, dinheiro }) {
  function atualizarStatus(id, status) {
    setProdutos(todosProdutos.map(p => p.id === id ? { ...p, status } : p));
  }

  return <div className="overflow-x-auto rounded-2xl border bg-white"><table className="w-full min-w-[760px] text-sm"><thead className="bg-orange-600 text-white"><tr>{["Produto", "Categoria", "Tamanho", "Estado", "Qtd", "Valor", "Status", "Ação"].map(h => <th key={h} className="p-3 text-left">{h}</th>)}</tr></thead><tbody>{produtos.map(p => <tr key={p.id} className="border-t hover:bg-orange-50"><td className="p-3 font-bold">{p.nome}</td><td className="p-3">{p.categoria}</td><td className="p-3">{p.tamanho}</td><td className="p-3">{p.estado}</td><td className="p-3">{p.qtd}</td><td className="p-3">{dinheiro(p.valor)}</td><td className="p-3"><select className="rounded-xl border p-2" value={p.status} onChange={(e) => atualizarStatus(p.id, e.target.value)}>{statusLista.map(s => <option key={s}>{s}</option>)}</select></td><td className="p-3"><button className="rounded-lg bg-red-100 px-3 py-1" onClick={() => setProdutos(todosProdutos.filter(x => x.id !== p.id))}>🗑️</button></td></tr>)}</tbody></table></div>;
}

function TabelaSimples({ linhas, remover }) {
  const chaves = linhas[0] ? Object.keys(linhas[0]).filter(k => k !== "id") : [];
  return <div className="mt-5 overflow-x-auto rounded-2xl border bg-white"><table className="w-full min-w-[680px] text-sm"><thead className="bg-orange-600 text-white"><tr>{chaves.map(k => <th key={k} className="p-3 text-left capitalize">{k}</th>)}<th className="p-3 text-left">Ação</th></tr></thead><tbody>{linhas.map(linha => <tr key={linha.id} className="border-t hover:bg-orange-50">{chaves.map(k => <td key={k} className="p-3">{linha[k]}</td>)}<td className="p-3"><button className="rounded-lg bg-red-100 px-3 py-1" onClick={() => remover(linha.id)}>🗑️</button></td></tr>)}</tbody></table></div>;
}
