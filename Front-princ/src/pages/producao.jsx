
const etapasProducao = [
    {
        status: "recebido",
        titulo: "Recebidos",
        descricao: "Pedidos aguardando início",
        classe: "recebidos",
        icone: "inbox"
    },
    {
        status: "corte",
        titulo: "Corte",
        descricao: "Preparação dos tecidos",
        classe: "corte",
        icone: "content_cut"
    },
    {
        status: "costura",
        titulo: "Costura",
        descricao: "Montagem das peças",
        classe: "costura",
        icone: "design_services"
    },
    {
        status: "acabamento",
        titulo: "Acabamento",
        descricao: "Finalização da produção",
        classe: "acabamento",
        icone: "checkroom"
    },
    {
        status: "conferencia",
        titulo: "Conferência",
        descricao: "Verificação de qualidade",
        classe: "conferencia",
        icone: "fact_check"
    }
];

function Producao({ pedidos = [] }) {

    function renderizarColuna(etapa) {
        const pedidosDaColuna = pedidos.filter(
            pedido => pedido.status === etapa.status
        );

        return (
            <section
                className={`coluna-producao ${etapa.classe}`}
                key={etapa.status}
            >
                <header className="cabecalho-coluna">
                    <div className="coluna-titulo">
                        <span className="icone-etapa material-symbols-outlined">
                            {etapa.icone}
                        </span>

                        <div>
                            <h3>{etapa.titulo}</h3>
                            <p>{etapa.descricao}</p>
                        </div>
                    </div>

                    <span className="contador-etapa">
                        {pedidosDaColuna.length}
                    </span>
                </header>

                <div className="lista-pedidos-producao">
                    {pedidosDaColuna.length > 0 ? (
                        pedidosDaColuna.map(pedido => (
                            <article
                                className="card-pedido-producao"
                                key={pedido.id ?? pedido.numero}
                            >
                                <div className="card-pedido-topo">
                                    <span className="identificador-pedido">
                                        PEDIDO #{pedido.numero}
                                    </span>

                                    <span className="indicador-etapa" />
                                </div>

                                <h4>{pedido.cliente}</h4>

                                <div className="informacoes-pedido">
                                    <div className="informacao-item">
                                        <span className="material-symbols-outlined">
                                            inventory_2
                                        </span>

                                        <span>
                                            {pedido.quantidade} peças
                                        </span>
                                    </div>

                                    {pedido.prazo && (
                                        <div className="informacao-item">
                                            <span className="material-symbols-outlined">
                                                calendar_month
                                            </span>

                                            <span>
                                                {new Date(
                                                    pedido.prazo + "T00:00:00"
                                                ).toLocaleDateString("pt-BR")}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="producao-vazia">
                            <span className="material-symbols-outlined">
                                inbox
                            </span>

                            <p>Nenhum pedido nesta etapa.</p>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    const totalEmProducao = pedidos.filter(pedido =>
        etapasProducao.some(
            etapa => etapa.status === pedido.status
        )
    ).length;

    const totalPecas = pedidos
        .filter(pedido =>
            etapasProducao.some(
                etapa => etapa.status === pedido.status
            )
        )
        .reduce(
            (total, pedido) => total + Number(pedido.quantidade || 0),
            0
        );

    return (
        <main className="pagina-producao" id="producao">

            <header className="topo-producao">
                <div>
                    <span className="etiqueta-producao">
                        AGRESTE TÊXTIL
                    </span>

                    <h1>Controle de Produção</h1>

                    <p>
                        Acompanhe cada pedido e visualize o andamento
                        das etapas de fabricação.
                    </p>
                </div>

                <div className="icone-topo-producao">
                    <span className="material-symbols-outlined">
                        precision_manufacturing
                    </span>
                </div>
            </header>

            <section className="resumo-producao">

                <div className="resumo-producao-card">
                    <div className="resumo-icone">
                        <span className="material-symbols-outlined">
                            assignment
                        </span>
                    </div>

                    <div>
                        <span>Pedidos em andamento</span>
                        <strong>{totalEmProducao}</strong>
                    </div>
                </div>

                <div className="resumo-producao-card">
                    <div className="resumo-icone">
                        <span className="material-symbols-outlined">
                            inventory_2
                        </span>
                    </div>

                    <div>
                        <span>Peças em produção</span>
                        <strong>{totalPecas.toLocaleString("pt-BR")}</strong>
                    </div>
                </div>

                <div className="resumo-producao-card">
                    <div className="resumo-icone">
                        <span className="material-symbols-outlined">
                            view_kanban
                        </span>
                    </div>

                    <div>
                        <span>Etapas acompanhadas</span>
                        <strong>{etapasProducao.length}</strong>
                    </div>
                </div>

            </section>

            <div className="titulo-fluxo-producao">
                <div>
                    <h2>Fluxo de produção</h2>
                    <p>Visualize os pedidos em cada etapa.</p>
                </div>

                <span className="legenda-fluxo">
                    <span className="bolinha-fluxo" />
                    Atualizado automaticamente
                </span>
            </div>

            <section className="painel-producao">
                {etapasProducao.map(etapa =>
                    renderizarColuna(etapa)
                )}
            </section>

        </main>
    );
}

export default Producao;
