import React, { useState, useEffect } from "react";


const notificacoesIniciais = [
    {
        id: 1,
        titulo: "Novo pedido recebido",
        descricao: "Um novo pedido foi registrado no sistema.",
        tipo: "pedido",
        icone: "shopping_cart",
        data: "Hoje",
        lida: false
    },
    {
        id: 2,
        titulo: "Estoque baixo",
        descricao: "A quantidade de um tecido está abaixo do esperado.",
        tipo: "estoque",
        icone: "inventory_2",
        data: "Hoje",
        lida: false
    },
    {
        id: 3,
        titulo: "Produção finalizada",
        descricao: "Um pedido concluiu todas as etapas de produção.",
        tipo: "producao",
        icone: "check_circle",
        data: "Ontem",
        lida: true
    },
    {
        id: 4,
        titulo: "Pedido pronto para expedição",
        descricao: "Existe um pedido aguardando envio.",
        tipo: "logistica",
        icone: "local_shipping",
        data: "Ontem",
        lida: true
    },
    {
        id: 5,
        titulo: "Pedido com atraso",
        descricao: "Um pedido ultrapassou a previsão de entrega.",
        tipo: "pedido",
        icone: "schedule",
        data: "Há 2 dias",
        lida: false
    }
];

function Notificacoes() {

    const [notificacoes, setNotificacoes] = useState(() => {
        try {
            const salvas = localStorage.getItem("agreste_notificacoes");
            return salvas ? JSON.parse(salvas) : notificacoesIniciais;
        } catch {
            return notificacoesIniciais;
        }
    });

    const [filtro, setFiltro] = useState("todas");
    const [categoria, setCategoria] = useState("todas");

    useEffect(() => {
        localStorage.setItem(
            "agreste_notificacoes",
            JSON.stringify(notificacoes)
        );
    }, [notificacoes]);

    const naoLidas = notificacoes.filter(n => !n.lida).length;
    const total = notificacoes.length;

    const notificacoesFiltradas = notificacoes.filter(n => {
        const correspondeStatus =
            filtro === "todas" ||
            (filtro === "naoLidas" && !n.lida) ||
            (filtro === "lidas" && n.lida);

        const correspondeCategoria =
            categoria === "todas" || n.tipo === categoria;

        return correspondeStatus && correspondeCategoria;
    });

    function marcarComoLida(id) {
        setNotificacoes(prev =>
            prev.map(n =>
                n.id === id ? { ...n, lida: true } : n
            )
        );
    }

    function marcarTodasComoLidas() {
        setNotificacoes(prev =>
            prev.map(n => ({ ...n, lida: true }))
        );
    }

    function excluirNotificacao(id) {
        setNotificacoes(prev =>
            prev.filter(n => n.id !== id)
        );
    }

    function limparNotificacoes() {
        setNotificacoes([]);
    }

    return (
        <main className="notificacoes-container">

            {/* CABEÇALHO */}
            <header className="notificacoes-header">
                <div>
                    <h1>Notificações</h1>
                    <p>
                        Acompanhe as atualizações e atividades do Agreste Têxtil.
                    </p>
                </div>

                <div className="notificacoes-resumo">
                    <span className="material-symbols-outlined">
                        notifications
                    </span>

                    <div>
                        <strong>{naoLidas}</strong>
                        <span>Não lidas</span>
                    </div>
                </div>
            </header>


            {/* INDICADORES */}
            <section className="notificacoes-indicadores">

                <div className="notificacao-indicador">
                    <span className="material-symbols-outlined">
                        notifications_active
                    </span>
                    <div>
                        <strong>{total}</strong>
                        <p>Total de notificações</p>
                    </div>
                </div>

                <div className="notificacao-indicador">
                    <span className="material-symbols-outlined">
                        mark_email_unread
                    </span>
                    <div>
                        <strong>{naoLidas}</strong>
                        <p>Não lidas</p>
                    </div>
                </div>

                <div className="notificacao-indicador">
                    <span className="material-symbols-outlined">
                        mark_email_read
                    </span>
                    <div>
                        <strong>{total - naoLidas}</strong>
                        <p>Já lidas</p>
                    </div>
                </div>

            </section>


            {/* FILTROS */}
            <section className="notificacoes-filtros-area">

                <div className="notificacoes-filtros">
                    <button
                        className={filtro === "todas" ? "ativo" : ""}
                        onClick={() => setFiltro("todas")}
                    >
                        Todas
                    </button>

                    <button
                        className={filtro === "naoLidas" ? "ativo" : ""}
                        onClick={() => setFiltro("naoLidas")}
                    >
                        Não lidas
                    </button>

                    <button
                        className={filtro === "lidas" ? "ativo" : ""}
                        onClick={() => setFiltro("lidas")}
                    >
                        Lidas
                    </button>
                </div>

                <select
                    value={categoria}
                    onChange={e => setCategoria(e.target.value)}
                    className="notificacoes-select"
                >
                    <option value="todas">Todas as categorias</option>
                    <option value="pedido">Pedidos</option>
                    <option value="estoque">Estoque</option>
                    <option value="producao">Produção</option>
                    <option value="logistica">Logística</option>
                </select>

            </section>


            {/* AÇÕES */}
            <div className="notificacoes-toolbar">

                <span>
                    {notificacoesFiltradas.length} notificações encontradas
                </span>

                <div>
                    <button
                        onClick={marcarTodasComoLidas}
                        disabled={naoLidas === 0}
                    >
                        <span className="material-symbols-outlined">
                            done_all
                        </span>
                        Marcar todas como lidas
                    </button>

                    <button
                        onClick={limparNotificacoes}
                        disabled={total === 0}
                    >
                        <span className="material-symbols-outlined">
                            delete
                        </span>
                        Limpar todas
                    </button>
                </div>

            </div>


            {/* LISTA */}
            <section className="notificacoes-lista">

                {notificacoesFiltradas.length > 0 ? (

                    notificacoesFiltradas.map(notificacao => (

                        <article
                            key={notificacao.id}
                            className={`notificacao-card ${!notificacao.lida ? "nao-lida" : ""}`}
                        >

                            <div className={`notificacao-icone ${notificacao.tipo}`}>
                                <span className="material-symbols-outlined">
                                    {notificacao.icone}
                                </span>
                            </div>

                            <div className="notificacao-conteudo">

                                <div className="notificacao-titulo">
                                    <h3>{notificacao.titulo}</h3>

                                    {!notificacao.lida && (
                                        <span className="notificacao-ponto"></span>
                                    )}
                                </div>

                                <p>{notificacao.descricao}</p>

                                <div className="notificacao-metadados">
                                    <span>
                                        <span className="material-symbols-outlined">
                                            schedule
                                        </span>
                                        {notificacao.data}
                                    </span>

                                    <span className={`categoria-tag ${notificacao.tipo}`}>
                                        {notificacao.tipo}
                                    </span>
                                </div>

                            </div>

                            <div className="notificacao-acoes">

                                {!notificacao.lida && (
                                    <button
                                        title="Marcar como lida"
                                        onClick={() => marcarComoLida(notificacao.id)}
                                    >
                                        <span className="material-symbols-outlined">
                                            mark_email_read
                                        </span>
                                    </button>
                                )}

                                <button
                                    title="Excluir"
                                    onClick={() => excluirNotificacao(notificacao.id)}
                                >
                                    <span className="material-symbols-outlined">
                                        delete
                                    </span>
                                </button>

                            </div>

                        </article>

                    ))

                ) : (

                    <div className="notificacoes-vazio">
                        <span className="material-symbols-outlined">
                            notifications_off
                        </span>

                        <h3>Nenhuma notificação encontrada</h3>

                        <p>
                            Não há notificações para os filtros selecionados.
                        </p>
                    </div>

                )}

            </section>

        </main>
    );
}

export default Notificacoes;