const etapas = [
  { status: "recebido", titulo: "Recebidos", classe: "conteudo-painel1" },
  { status: "corte", titulo: "Corte", classe: "conteudo-painel2" },
  { status: "costura", titulo: "Costura", classe: "conteudo-painel3" },
  { status: "acabamento", titulo: "Acabamento", classe: "conteudo-painel4" },
  { status: "conferencia", titulo: "Conferência", classe: "conteudo-painel1" },
  { status: "pronto", titulo: "Prontos", classe: "conteudo-painel2" },
  { status: "enviado", titulo: "Enviados", classe: "conteudo-painel3" },
];

function Producao({ pedidos = [] }) {
  return (
    <main className="conteudo" id="producao">
      <header><h2>Produção</h2><p>Acompanhe os pedidos por etapa de produção.</p></header>
      <section id="painel">
        {etapas.map((etapa) => {
          const daEtapa = pedidos.filter((pedido) => pedido.status === etapa.status);
          return (
            <div className={etapa.classe} key={etapa.status}>
              <div className="coluna-cabecalho1">
                <h3>{etapa.titulo}</h3><strong>({daEtapa.length})</strong>
              </div>
              {daEtapa.map((pedido) => (
                <div className="pedido-id" key={pedido.numero}>
                  <strong>#{pedido.numero}</strong><p>{pedido.cliente}</p><span>{pedido.quantidade} peças</span>
                </div>
              ))}
              {daEtapa.length === 0 && <p>Nenhum pedido nesta etapa.</p>}
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default Producao;
