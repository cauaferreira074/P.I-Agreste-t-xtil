
const etapas = [
  { valor: "aguardando_expedicao", nome: "Aguardando expedição" },
  { valor: "separacao", nome: "Separação" },
  { valor: "conferencia", nome: "Conferência" },
  { valor: "despachado", nome: "Despachado" },
  { valor: "em_transporte", nome: "Em transporte" },
  { valor: "entregue", nome: "Entregue" }
];

function AcompanhamentoLogistica({ pedido, fechar }) {
  if (!pedido) return null;

  const statusAtual =
    pedido.statusLogistica || "aguardando_expedicao";

  const indiceAtual = etapas.findIndex(
    etapa => etapa.valor === statusAtual
  );

  return (
    <section className="acompanhamento">

      <button onClick={fechar}>
        Voltar para logística
      </button>

      <h2>Pedido #{pedido.numero}</h2>

      <p>Cliente: {pedido.cliente}</p>
      <p>Quantidade: {pedido.quantidade} peças</p>

      <h3>Etapas logísticas</h3>

      <div className="linha-etapas">

        {etapas.map((etapa, indice) => {
          const concluida = indice <= indiceAtual;
          const atual = indice === indiceAtual;

          return (
            <div
              key={etapa.valor}
              className={`etapa ${concluida ? "concluida" : ""} ${atual ? "atual" : ""}`}
            >
              <span>
                {concluida ? "✓" : indice + 1}
              </span>

              <p>{etapa.nome}</p>

              {atual && <small>Etapa atual</small>}
            </div>
          );
        })}

      </div>
    </section>
  );
}

export default AcompanhamentoLogistica;
