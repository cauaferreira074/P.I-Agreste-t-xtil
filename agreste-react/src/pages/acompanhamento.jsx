
const etapas = [
  { valor: "recebido", nome: "Pedido recebido" },
  { valor: "corte", nome: "Corte" },
  { valor: "costura", nome: "Costura" },
  { valor: "acabamento", nome: "Acabamento" },
  { valor: "conferencia", nome: "Conferência" },
  { valor: "pronto", nome: "Pronto" },
  { valor: "enviado", nome: "Enviado" }
];

function Acompanhamento({ pedido, fechar }) {
  if (!pedido) return null;

  const indiceAtual = etapas.findIndex(
    etapa => etapa.valor === pedido.status
  );

  return (
    <section className="acompanhamento">
      <button onClick={fechar}>
        Voltar para pedidos
      </button>

      <h2>Acompanhamento do pedido #{pedido.numero}</h2>

      <p>Cliente: {pedido.cliente}</p>
      <p>Quantidade: {pedido.quantidade} peças</p>

      <h3>Etapas da produção</h3>

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

export default Acompanhamento;
