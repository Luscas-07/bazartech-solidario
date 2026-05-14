import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "bazartech-solidario-profissional-v1";
const ADMIN_PASSWORD = "bazar123";

const dadosIniciais = {
  evento: {
    nome: "Bazar Beneficente",
    data: "25/05",
    horario: "09:00",
    local: "A.D. Dique do Tororó",
    endereco: "Avenida Vasco da Gama, 186",
    quentinha: "Não confirmado",
    cardapio: "Doces, salgados e almoço",
    valorQuentinha: "15,00",
    pix: "meunatalsolidario@gmail.com",
    descricao: "Participe do nosso bazar beneficente e ajude essa ação solidária. Teremos roupas, calçados, utensílios e muito mais.",
  },
  produtos: [
    { id: 1, nome: "Camiseta", categoria: "Roupas", tamanho: "M", estado: "Bom", qtd: 10, valor: 12, status: "Disponível" },
    { id: 2, nome: "Tênis", categoria: "Calçados", tamanho: "42", estado: "Seminovo", qtd: 3, valor: 30, status: "Disponível" },
    { id: 3, nome: "Panela", categoria: "Utensílios", tamanho: "-", estado: "Bom", qtd: 1, valor: 20, status: "Disponível" },
  ],
  vendas: [],
  doacoes: [],
};

export default function BazarTechSolidario() {
  const [modo, setModo] = useState("publico");
  const [logado, setLogado] = useState(false);
  const [senha, setSenha] = useState("");
  const [abaAdmin, setAbaAdmin] = useState("dashboard");
  const [busca, setBusca] = useState("");

  const [evento, setEvento] = useState(dadosIniciais.evento);
  const [produtos, setProdutos] = useState(dadosIniciais.produtos);
  const [vendas, setVendas] = useState(dadosIniciais.vendas);
  const [doacoes, setDoacoes] = useState(dadosIniciais.doacoes);

  const [novoProduto, setNovoProduto] = useState({ nome: "", categoria: "Roupas", tamanho: "", estado: "Bom", qtd: 1, valor: 0, status: "Disponível" });
  const [novaVenda, setNovaVenda] = useState({ produto: "", categoria: "Roupas", qtd: 1, valor: 0, pagamento: "PIX" });
  const [novaDoacao, setNovaDoacao] = useState({ doador: "", produto: "", categoria: "Roupas", qtd: 1, obs: "" });

  useEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
      const dados = JSON.parse(salvo);
      setEvento(dados.evento || dadosIniciais.evento);
      setProdutos(dados.produtos || dadosIniciais.produtos);
      setVendas(dados.vendas || []);
      setDoacoes(dados.doacoes || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ evento, produtos, vendas, doacoes }));
  }, [evento, produtos, vendas, doacoes]);

  const resumo = useMemo(() => {
    const totalArrecadado = vendas.reduce((s, v) => s + Number(v.qtd) * Number(v.valor), 0);
    const totalProdutos = produtos.reduce((s, p) => s + Number(p.qtd), 0);
    const vendidos = vendas.reduce((s, v) => s + Number(v.qtd), 0);
    const disponiveis = produtos.filter((p) => p.status === "Disponível").reduce((s, p) => s + Number(p.qtd), 0);
    const totalDoacoes = doacoes.reduce((s, d) => s + Number(d.qtd), 0);
    return { totalArrecadado, totalProdutos, vendidos, disponiveis, totalDoacoes };
  }, [produtos, vendas, doacoes]);

  const produtosPublicos = produtos.filter((p) => p.status === "Disponível" && `${p.nome} ${p.categoria}`.toLowerCase().includes(busca.toLowerCase()));
  const produtosFiltrados = produtos.filter((p) => `${p.nome} ${p.categoria} ${p.status}`.toLowerCase().includes(busca.toLowerCase()));

  function dinheiro(valor) {
    return `R$ ${Number(valor || 0).toFixed(2).replace(".", ",")}`;
  }

  function loginAdmin() {
    if (senha === ADMIN_PASSWORD) {
      setLogado(true);
      setSenha("");
    } else {
      alert("Senha incorreta. Dica para teste: bazar123");
    }
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

  function limparDados() {
    if (!confirm("Deseja restaurar os dados iniciais?")) return;
    setEvento(dadosIniciais.evento);
    setProdutos(dadosIniciais.produtos);
    setVendas([]);
    setDoacoes([]);
  }

  function exportarCSV() {
    const linhas = [["Produto", "Categoria", "Tamanho", "Estado", "Quantidade", "Valor", "Status"], ...produtos.map(p => [p.nome, p.categoria, p.tamanho, p.estado, p.qtd, p.valor, p.status])];
   const mensagemDivulgacao = `✨ ${evento.nome} ✨

📍 Local: ${evento.local}
🏠 Endereço: ${evento.endereco}
📅 Data: ${evento.data}
⏰ Horário: ${evento.horario}

${evento.descricao}

PIX para colaboração: ${evento.pix}

Participe e ajude essa ação solidária! ❤️`;
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

${evento.descricao}
${evento.quentinha === "Sim" ? `
🍽️ Também teremos ${evento.cardapio} por R$ ${evento.valorQuentinha}.
` : ""}
PIX para colaboração: ${evento.pix}

Participe e ajude essa ação solidária! ❤️`;

  return (
    <div className="min-h-screen bg-orange-50 text-stone-900">
      <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">BazarTech Solidário</p>
            <h1 className="text-xl font-black md:text-3xl">Gestão Inteligente do Bazar</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setModo("publico")} className={`rounded-2xl px-4 py-2 text-sm font-black ${modo === "publico" ? "bg-orange-600 text-white" : "bg-orange-100 text-orange-800"}`}>Público</button>
            <button onClick={() => setModo("admin")} className={`rounded-2xl px-4 py-2 text-sm font-black ${modo === "admin" ? "bg-stone-900 text-white" : "bg-stone-100"}`}>Anfitrião</button>
          </div>
        </div>
      </header>

      {modo === "publico" ? (
        <Publico evento={evento} produtos={produtosPublicos} busca={busca} setBusca={setBusca} resumo={resumo} dinheiro={dinheiro} mensagemDivulgacao={mensagemDivulgacao} />
      ) : !logado ? (
        <Login senha={senha} setSenha={setSenha} loginAdmin={loginAdmin} />
      ) : (
        <Admin
          evento={evento}
          setEvento={setEvento}
          produtos={produtos}
          produtosFiltrados={produtosFiltrados}
          setProdutos={setProdutos}
          vendas={vendas}
          setVendas={setVendas}
          doacoes={doacoes}
          setDoacoes={setDoacoes}
          novoProduto={novoProduto}
          setNovoProduto={setNovoProduto}
          novaVenda={novaVenda}
          setNovaVenda={setNovaVenda}
          novaDoacao={novaDoacao}
          setNovaDoacao={setNovaDoacao}
          adicionarProduto={adicionarProduto}
          adicionarVenda={adicionarVenda}
          adicionarDoacao={adicionarDoacao}
          resumo={resumo}
          dinheiro={dinheiro}
          busca={busca}
          setBusca={setBusca}
          abaAdmin={abaAdmin}
          setAbaAdmin={setAbaAdmin}
          exportarCSV={exportarCSV}
          mensagemDivulgacao={mensagemDivulgacao}
          sair={() => setLogado(false)}
          limparDados={limparDados}
        />
      )}
    </div>
  );
}

function Publico({ evento, produtos, busca, setBusca, resumo, dinheiro, mensagemDivulgacao }) {
  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white shadow-xl">
        <div className="grid gap-6 p-6 md:grid-cols-[1.3fr_0.7fr] md:p-10">
          <div>
            <p className="font-bold uppercase tracking-[0.25em] text-white/80">Evento aberto ao público</p>
            <h2 className="mt-3 text-4xl font-black md:text-6xl">{evento.nome}</h2>
            <p className="mt-4 max-w-2xl text-lg text-white/90">{evento.descricao}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Info item="📅" label="Data" valor={evento.data} />
              <Info item="⏰" label="Horário" valor={evento.horario} />
              <Info item="📍" label="Local" valor={evento.local} />
              <Info item="🏠" label="Endereço" valor={evento.endereco} />
            </div>
          </div>
          <div className="rounded-[2rem] bg-white/15 p-6 backdrop-blur">
            <h3 className="text-2xl font-black">Contribua com o bazar</h3>
            <p className="mt-2 text-white/90">Chave Pix para colaboração:</p>
            <p className="mt-3 break-words rounded-2xl bg-white p-4 font-black text-orange-700">{evento.pix}</p>
            <p className="mt-5 text-sm text-white/80">Itens disponíveis: roupas, calçados, utensílios e outros produtos solidários.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card titulo="Produtos disponíveis" valor={resumo.disponiveis} icone="🛍️" />
        <Card titulo="Arrecadação registrada" valor={dinheiro(resumo.totalArrecadado)} icone="📊" />
        <Card titulo="Itens vendidos" valor={resumo.vendidos} icone="✅" />
        <Card titulo="Doações recebidas" valor={resumo.totalDoacoes} icone="🎁" />
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100 md:p-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-black">Catálogo público</h2>
            <p className="text-stone-500">Veja os itens cadastrados como disponíveis.</p>
          </div>
          <input className="rounded-2xl border border-orange-100 bg-orange-50 p-3 outline-none md:w-80" placeholder="Buscar item..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {produtos.map((p) => (
            <article key={p.id} className="rounded-3xl border border-orange-100 bg-orange-50 p-5">
              <span className="rounded-full bg-orange-600 px-3 py-1 text-xs font-black text-white">{p.categoria}</span>
              <h3 className="mt-4 text-2xl font-black">{p.nome}</h3>
              <p className="text-sm text-stone-600">Estado: {p.estado} | Tamanho: {p.tamanho}</p>
              <div className="mt-4 flex items-center justify-between">
                <strong className="text-2xl text-orange-700">{dinheiro(p.valor)}</strong>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-bold">Qtd: {p.qtd}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] bg-stone-900 p-6 text-white shadow-lg">
        <h2 className="text-2xl font-black">Mensagem de divulgação</h2>
        <textarea className="mt-4 h-64 w-full rounded-2xl bg-white p-4 text-stone-900" value={mensagemDivulgacao} readOnly />
      </section>
    </main>
  );
}

function Login({ senha, setSenha, loginAdmin }) {
  return (
    <main className="mx-auto flex min-h-[75vh] max-w-md items-center p-4">
      <section className="w-full rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-orange-100">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-orange-600">Área restrita</p>
        <h2 className="mt-2 text-3xl font-black">Login do anfitrião</h2>
        <p className="mt-2 text-stone-500">Entre para alterar dados do evento, produtos, vendas e doações.</p>
        <input type="password" className="mt-6 w-full rounded-2xl border border-orange-100 bg-orange-50 p-4 outline-none" placeholder="Senha do anfitrião" value={senha} onChange={(e) => setSenha(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loginAdmin()} />
        <button onClick={loginAdmin} className="mt-4 w-full rounded-2xl bg-stone-900 p-4 font-black text-white">Entrar</button>
        <p className="mt-4 text-center text-xs text-stone-400">Senha de teste: bazar123</p>
      </section>
    </main>
  );
}

function Admin(props) {
  const { evento, setEvento, produtos, produtosFiltrados, setProdutos, vendas, setVendas, doacoes, setDoacoes, novoProduto, setNovoProduto, novaVenda, setNovaVenda, novaDoacao, setNovaDoacao, adicionarProduto, adicionarVenda, adicionarDoacao, resumo, dinheiro, busca, setBusca, abaAdmin, setAbaAdmin, exportarCSV, mensagemDivulgacao, sair, limparDados } = props;

  return (
    <main className="mx-auto grid max-w-7xl gap-5 p-4 md:grid-cols-[260px_1fr] md:p-6">
      <aside className="rounded-[2rem] bg-gradient-to-b from-orange-600 to-red-600 p-4 text-white shadow-xl md:sticky md:top-24 md:h-[calc(100vh-7rem)]">
        <div className="mb-5 rounded-3xl bg-white/15 p-4">
          <p className="text-sm opacity-90">Painel do anfitrião</p>
          <h2 className="text-2xl font-black">{evento.nome}</h2>
          <p className="mt-1 text-sm">📍 {evento.local}</p>
        </div>
        <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
          {menuAdmin.map((item) => (
            <button key={item.id} onClick={() => setAbaAdmin(item.id)} className={`rounded-2xl px-4 py-3 text-left font-bold ${abaAdmin === item.id ? "bg-white text-orange-700 shadow" : "bg-white/10 hover:bg-white/20"}`}>{item.icone} {item.nome}</button>
          ))}
        </nav>
        <button onClick={exportarCSV} className="mt-4 w-full rounded-2xl bg-white/20 px-4 py-3 font-black">Exportar CSV</button>
        <button onClick={sair} className="mt-2 w-full rounded-2xl bg-stone-900/40 px-4 py-3 font-black">Sair</button>
      </aside>

      <section className="space-y-5">
        <section className="rounded-[2rem] bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white shadow-lg">
          <p className="font-semibold opacity-90">Administração do bazar</p>
          <h2 className="mt-1 text-3xl font-black md:text-5xl">Controle completo do evento</h2>
          <p className="mt-3 max-w-3xl text-white/90">Atualize os dados que aparecem ao público, registre itens, vendas, doações e acompanhe os resultados.</p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Card titulo="Arrecadado" valor={dinheiro(resumo.totalArrecadado)} icone="📊" />
          <Card titulo="Produtos" valor={resumo.totalProdutos} icone="🛍️" />
          <Card titulo="Vendidos" valor={resumo.vendidos} icone="✅" />
          <Card titulo="Disponíveis" valor={resumo.disponiveis} icone="📦" />
          <Card titulo="Doações" valor={resumo.totalDoacoes} icone="🎁" />
        </section>

        {abaAdmin === "dashboard" && <Painel titulo="Dashboard" descricao="Visão geral dos resultados do bazar."><AdminResumo resumo={resumo} dinheiro={dinheiro} /></Painel>}

        {abaAdmin === "evento" && (
          <Painel titulo="Configurações do Evento" descricao="Essas informações aparecem na página pública.">
            <FormEvento evento={evento} setEvento={setEvento} />
          </Painel>
        )}

        {abaAdmin === "produtos" && (
          <Painel titulo="Produtos e Estoque" descricao="Cadastre itens e controle o status de disponibilidade.">
            <FormProduto novoProduto={novoProduto} setNovoProduto={setNovoProduto} adicionarProduto={adicionarProduto} />
            <input className="my-4 w-full rounded-2xl border bg-white p-3" placeholder="Buscar por produto, categoria ou status..." value={busca} onChange={(e) => setBusca(e.target.value)} />
            <TabelaProdutos produtos={produtosFiltrados} todosProdutos={produtos} setProdutos={setProdutos} dinheiro={dinheiro} />
          </Painel>
        )}

        {abaAdmin === "doacoes" && (
          <Painel titulo="Doações" descricao="Registre itens recebidos pela comunidade.">
            <FormDoacao novaDoacao={novaDoacao} setNovaDoacao={setNovaDoacao} adicionarDoacao={adicionarDoacao} />
            <TabelaSimples linhas={doacoes} remover={(id) => setDoacoes(doacoes.filter(d => d.id !== id))} />
          </Painel>
        )}

        {abaAdmin === "vendas" && (
          <Painel titulo="Vendas" descricao="Registre as vendas realizadas no bazar.">
            <FormVenda novaVenda={novaVenda} setNovaVenda={setNovaVenda} adicionarVenda={adicionarVenda} />
            <TabelaSimples linhas={vendas.map(v => ({ ...v, total: dinheiro(v.qtd * v.valor) }))} remover={(id) => setVendas(vendas.filter(v => v.id !== id))} />
          </Painel>
        )}

        {abaAdmin === "ia" && (
          <div className="grid gap-4 lg:grid-cols-2">
            <Painel titulo="🤖 Apoio da IA" descricao="Demonstração do uso de inteligência artificial no projeto.">
              <div className="space-y-3">
                <IABox titulo="Sugestão de preço" texto="A IA pode analisar categoria, estado e público para sugerir valores acessíveis." />
                <IABox titulo="Descrição automática" texto="A IA pode criar textos curtos para divulgação dos produtos e do evento." />
                <IABox titulo="Análise de resultados" texto="A IA pode gerar relatórios com melhorias para os próximos bazares." />
              </div>
            </Painel>
            <Painel titulo="📣 Divulgação automática" descricao="Mensagem pronta para copiar.">
              <textarea className="h-72 w-full rounded-2xl border bg-orange-50 p-4" value={mensagemDivulgacao} readOnly />
            </Painel>
          </div>
        )}

        {abaAdmin === "sistema" && (
          <Painel titulo="Sistema" descricao="Ações administrativas do protótipo.">
            <button onClick={limparDados} className="rounded-2xl bg-red-600 px-5 py-3 font-black text-white">Restaurar dados iniciais</button>
            <p className="mt-4 text-sm text-stone-500">Nesta versão, os dados ficam salvos no navegador. Para todos verem as alterações em tempo real em celulares diferentes, o próximo passo é conectar Firebase ou Supabase.</p>
          </Painel>
        )}
      </section>
    </main>
  );
}

function FormEvento({ evento, setEvento }) {
  return <div className="grid gap-4 md:grid-cols-2">
    <Campo label="Nome" value={evento.nome} onChange={(v) => setEvento({ ...evento, nome: v })} />
    <Campo label="Data" value={evento.data} onChange={(v) => setEvento({ ...evento, data: v })} />
    <Campo label="Horário" value={evento.horario} onChange={(v) => setEvento({ ...evento, horario: v })} />
    <Campo label="Local" value={evento.local} onChange={(v) => setEvento({ ...evento, local: v })} />
    <Campo label="Endereço" value={evento.endereco} onChange={(v) => setEvento({ ...evento, endereco: v })} />
    <Campo label="Quentinha" value={evento.quentinha} onChange={(v) => setEvento({ ...evento, quentinha: v })} />
    <Campo label="Cardápio" value={evento.cardapio} onChange={(v) => setEvento({ ...evento, cardapio: v })} />
    <Campo label="Valor Quentinha" value={evento.valorQuentinha} onChange={(v) => setEvento({ ...evento, valorQuentinha: v })} />
    <Campo label="Pix" value={evento.pix} onChange={(v) => setEvento({ ...evento, pix: v })} />
    <label className="space-y-1 md:col-span-2"><span className="text-sm font-bold text-stone-600">Descrição pública</span><textarea className="h-32 w-full rounded-2xl border border-orange-100 bg-orange-50/50 p-3 outline-none focus:border-orange-500" value={evento.descricao} onChange={(e) => setEvento({ ...evento, descricao: e.target.value })} /></label>
  </div>;
}

function Campo({ label, value, onChange }) {
  return <label className="space-y-1"><span className="text-sm font-bold text-stone-600">{label}</span><input className="w-full rounded-2xl border border-orange-100 bg-orange-50/50 p-3 outline-none focus:border-orange-500" value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}

function FormProduto({ novoProduto, setNovoProduto, adicionarProduto }) {
  return <div className="grid gap-3 lg:grid-cols-8">
    <input className="rounded-2xl border p-3 lg:col-span-2" placeholder="Produto" value={novoProduto.nome} onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })} />
    <select className="rounded-2xl border p-3" value={novoProduto.categoria} onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}>{categorias.map(c => <option key={c}>{c}</option>)}</select>
    <input className="rounded-2xl border p-3" placeholder="Tamanho" value={novoProduto.tamanho} onChange={(e) => setNovoProduto({ ...novoProduto, tamanho: e.target.value })} />
    <select className="rounded-2xl border p-3" value={novoProduto.estado} onChange={(e) => setNovoProduto({ ...novoProduto, estado: e.target.value })}>{estados.map(c => <option key={c}>{c}</option>)}</select>
    <input className="rounded-2xl border p-3" type="number" placeholder="Qtd" value={novoProduto.qtd} onChange={(e) => setNovoProduto({ ...novoProduto, qtd: e.target.value })} />
    <input className="rounded-2xl border p-3" type="number" placeholder="Valor" value={novoProduto.valor} onChange={(e) => setNovoProduto({ ...novoProduto, valor: e.target.value })} />
    <button onClick={adicionarProduto} className="rounded-2xl bg-orange-600 p-3 font-black text-white hover:bg-orange-700">Adicionar</button>
  </div>;
}

function FormVenda({ novaVenda, setNovaVenda, adicionarVenda }) {
  return <div className="grid gap-3 lg:grid-cols-6">
    <input className="rounded-2xl border p-3" placeholder="Produto" value={novaVenda.produto} onChange={(e) => setNovaVenda({ ...novaVenda, produto: e.target.value })} />
    <select className="rounded-2xl border p-3" value={novaVenda.categoria} onChange={(e) => setNovaVenda({ ...novaVenda, categoria: e.target.value })}>{categorias.map(c => <option key={c}>{c}</option>)}</select>
    <input className="rounded-2xl border p-3" type="number" placeholder="Qtd" value={novaVenda.qtd} onChange={(e) => setNovaVenda({ ...novaVenda, qtd: e.target.value })} />
    <input className="rounded-2xl border p-3" type="number" placeholder="Valor" value={novaVenda.valor} onChange={(e) => setNovaVenda({ ...novaVenda, valor: e.target.value })} />
    <select className="rounded-2xl border p-3" value={novaVenda.pagamento} onChange={(e) => setNovaVenda({ ...novaVenda, pagamento: e.target.value })}>{["PIX", "Dinheiro", "Cartão", "Cortesia"].map(c => <option key={c}>{c}</option>)}</select>
    <button onClick={adicionarVenda} className="rounded-2xl bg-orange-600 p-3 font-black text-white">Adicionar</button>
  </div>;
}

function FormDoacao({ novaDoacao, setNovaDoacao, adicionarDoacao }) {
  return <div className="grid gap-3 lg:grid-cols-6">
    <input className="rounded-2xl border p-3" placeholder="Doador" value={novaDoacao.doador} onChange={(e) => setNovaDoacao({ ...novaDoacao, doador: e.target.value })} />
    <input className="rounded-2xl border p-3" placeholder="Produto" value={novaDoacao.produto} onChange={(e) => setNovaDoacao({ ...novaDoacao, produto: e.target.value })} />
    <select className="rounded-2xl border p-3" value={novaDoacao.categoria} onChange={(e) => setNovaDoacao({ ...novaDoacao, categoria: e.target.value })}>{categorias.map(c => <option key={c}>{c}</option>)}</select>
    <input className="rounded-2xl border p-3" type="number" placeholder="Qtd" value={novaDoacao.qtd} onChange={(e) => setNovaDoacao({ ...novaDoacao, qtd: e.target.value })} />
    <input className="rounded-2xl border p-3" placeholder="Observação" value={novaDoacao.obs} onChange={(e) => setNovaDoacao({ ...novaDoacao, obs: e.target.value })} />
    <button onClick={adicionarDoacao} className="rounded-2xl bg-orange-600 p-3 font-black text-white">Adicionar</button>
  </div>;
}

function AdminResumo({ resumo, dinheiro }) {
  return <div className="grid gap-4 lg:grid-cols-3">
    <div className="rounded-3xl bg-orange-100 p-5"><h3 className="text-xl font-black text-orange-800">Resultado parcial</h3><p className="mt-2 text-4xl font-black">{dinheiro(resumo.totalArrecadado)}</p><p className="mt-2 text-sm text-stone-600">Total registrado nas vendas.</p></div>
    <div className="rounded-3xl bg-red-100 p-5"><h3 className="text-xl font-black text-red-800">Estoque</h3><p className="mt-2 text-4xl font-black">{resumo.totalProdutos}</p><p className="mt-2 text-sm text-stone-600">Itens cadastrados.</p></div>
    <div className="rounded-3xl bg-stone-100 p-5"><h3 className="text-xl font-black text-stone-800">Impacto</h3><p className="mt-2 text-sm text-stone-600">Organização das doações, melhoria no atendimento e apoio à arrecadação solidária.</p></div>
  </div>;
}

function Info({ item, label, valor }) {
  return <div className="rounded-2xl bg-white/15 p-4"><p className="text-sm text-white/70">{item} {label}</p><p className="font-black">{valor}</p></div>;
}

function Card({ titulo, valor, icone }) {
  return <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-orange-100"><div className="flex items-center justify-between"><div><p className="text-sm font-bold text-stone-500">{titulo}</p><p className="text-2xl font-black text-orange-700">{valor}</p></div><div className="rounded-2xl bg-orange-100 p-3 text-2xl">{icone}</div></div></div>;
}

function Painel({ titulo, descricao, children }) {
  return <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100 md:p-6"><div className="mb-5"><h2 className="text-2xl font-black md:text-3xl">{titulo}</h2>{descricao && <p className="mt-1 text-sm text-stone-500">{descricao}</p>}</div>{children}</section>;
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

const categorias = ["Roupas", "Calçados", "Utensílios", "Acessórios", "Brinquedos", "Livros", "Outros"];
const estados = ["Novo", "Seminovo", "Bom", "Regular"];
const statusLista = ["Disponível", "Vendido", "Reservado", "Doado"];
const menuAdmin = [
  { id: "dashboard", nome: "Dashboard", icone: "📊" },
  { id: "evento", nome: "Evento", icone: "📅" },
  { id: "produtos", nome: "Produtos", icone: "🛍️" },
  { id: "doacoes", nome: "Doações", icone: "🎁" },
  { id: "vendas", nome: "Vendas", icone: "💰" },
  { id: "ia", nome: "IA", icone: "🤖" },
  { id: "sistema", nome: "Sistema", icone: "⚙️" },
];
