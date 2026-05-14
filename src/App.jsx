<div className="grid gap-4 md:grid-cols-2">
  <label className="space-y-1">
    <span className="text-sm font-bold text-stone-600">Nome</span>
    <input
      className="w-full rounded-2xl border border-orange-100 bg-orange-50/50 p-3"
      value={evento.nome}
      onChange={(e) =>
        setEvento({ ...evento, nome: e.target.value })
      }
    />
  </label>

  <label className="space-y-1">
    <span className="text-sm font-bold text-stone-600">Data</span>
    <input
      className="w-full rounded-2xl border border-orange-100 bg-orange-50/50 p-3"
      value={evento.data}
      onChange={(e) =>
        setEvento({ ...evento, data: e.target.value })
      }
    />
  </label>

  <label className="space-y-1">
    <span className="text-sm font-bold text-stone-600">Horário</span>
    <input
      className="w-full rounded-2xl border border-orange-100 bg-orange-50/50 p-3"
      value={evento.horario}
      onChange={(e) =>
        setEvento({ ...evento, horario: e.target.value })
      }
    />
  </label>

  <label className="space-y-1">
    <span className="text-sm font-bold text-stone-600">Local</span>
    <input
      className="w-full rounded-2xl border border-orange-100 bg-orange-50/50 p-3"
      value={evento.local}
      onChange={(e) =>
        setEvento({ ...evento, local: e.target.value })
      }
    />
  </label>

  <label className="space-y-1">
    <span className="text-sm font-bold text-stone-600">Endereço</span>
    <input
      className="w-full rounded-2xl border border-orange-100 bg-orange-50/50 p-3"
      value={evento.endereco}
      onChange={(e) =>
        setEvento({ ...evento, endereco: e.target.value })
      }
    />
  </label>

  <label className="space-y-1">
    <span className="text-sm font-bold text-stone-600">Quentinha</span>
    <input
      className="w-full rounded-2xl border border-orange-100 bg-orange-50/50 p-3"
      value={evento.quentinha}
      onChange={(e) =>
        setEvento({ ...evento, quentinha: e.target.value })
      }
    />
  </label>

  <label className="space-y-1">
    <span className="text-sm font-bold text-stone-600">Cardápio</span>
    <input
      className="w-full rounded-2xl border border-orange-100 bg-orange-50/50 p-3"
      value={evento.cardapio}
      onChange={(e) =>
        setEvento({ ...evento, cardapio: e.target.value })
      }
    />
  </label>

  <label className="space-y-1">
    <span className="text-sm font-bold text-stone-600">
      Valor Quentinha
    </span>
    <input
      className="w-full rounded-2xl border border-orange-100 bg-orange-50/50 p-3"
      value={evento.valorQuentinha}
      onChange={(e) =>
        setEvento({
          ...evento,
          valorQuentinha: e.target.value,
        })
      }
    />
  </label>

  <label className="space-y-1 md:col-span-2">
    <span className="text-sm font-bold text-stone-600">Pix</span>
    <input
      className="w-full rounded-2xl border border-orange-100 bg-orange-50/50 p-3"
      value={evento.pix}
      onChange={(e) =>
        setEvento({ ...evento, pix: e.target.value })
      }
    />
  </label>
</div>