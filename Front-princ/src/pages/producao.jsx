
function Producao({ pedidos = [] }) {

    function renderizarColuna(status, titulo, classe, classeCabecalho) {
        const pedidosDaColuna = pedidos.filter(
            pedido => pedido.status === status
        );

        return (
            <div className={classe}>
                <div className={classeCabecalho}>
                    <h3>{titulo}</h3>
                    <strong>{pedidosDaColuna.length}</strong>
                </div>

                {pedidosDaColuna.length > 0 ? (
                    pedidosDaColuna.map(pedido => (
                        <div
                            className="pedido-id"
                            key={pedido.id ?? pedido.numero}
                        >
                            <strong>#{pedido.numero}</strong>
                            <p>{pedido.cliente}</p>
                            <span>{pedido.quantidade} peças</span>
                        </div>
                    ))
                ) : (
                    <p className="sem-pedidos">
                        Nenhum pedido nesta etapa.
                    </p>
                )}
            </div>
        );
    }

    return (
        <main className="conteudo" id="producao">

            <section id="painel">

                {renderizarColuna(
                    "recebido",
                    "Recebidos",
                    "conteudo-painel1",
                    "coluna-cabecalho1"
                )}

                {renderizarColuna(
                    "corte",
                    "Corte",
                    "conteudo-painel2",
                    "coluna-cabecalho2"
                )}

                {renderizarColuna(
                    "costura",
                    "Costura",
                    "conteudo-painel3",
                    "coluna-cabecalho3"
                )}

                {renderizarColuna(
                    "acabamento",
                    "Acabamento",
                    "conteudo-painel4",
                    "coluna-cabecalho4"
                )}

            </section>
        </main>
    );
}

export default Producao;
