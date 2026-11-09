
import React, { useState, useEffect } from "react";

function Notificacoes({
    pedidos = [],
    tecidos = [],
    notificacoes = [],
    setNotificacoes
}) {

    const [filtro, setFiltro] = useState("todas");
    const [categoria, setCategoria] = useState("todas");

    // Detectar alterações nos pedidos e no estoque
    useEffect(() => {
        const chaveEstado = "agreste_estado_notificacoes";

        const estadoAtual = {
            pedidos: pedidos.map(p => ({
                id: String(p.id ?? p.numero),
                numero: p.numero,
                cliente: p.cliente,
                status: p.status,
                statusLogistica: p.statusLogistica
            })),

            tecidos: tecidos.map(t => ({
                id: String(t.id),
                nome: t.nome,
                quantidade: Number(t.quantidade),
                estoqueMinimo: Number(t.estoqueMinimo)
            }))
        };

        const estadoSalvo = localStorage.getItem(chaveEstado);

        // Primeira execução: guardar estado sem gerar alertas antigos
        if (!estadoSalvo) {
            localStorage.setItem(
                chaveEstado,
                JSON.stringify(estadoAtual)
            );
            return;
        }

        let anterior;

        try {
            anterior = JSON.parse(estadoSalvo);
        } catch {
            localStorage.setItem(
                chaveEstado,
                JSON.stringify(estadoAtual)
            );
            return;
        }

        const novas = [];
        const dataAtual = new Date().toLocaleString("pt-BR");

        function adicionarNotificacao(titulo, descricao, tipo, icone) {
            novas.push({
                id: `${Date.now()}-${novas.length}`,
                titulo,
                descricao,
                tipo,
                icone,
                data: dataAtual,
                lida: false
            });
        }

        const pedidosAnteriores = anterior.pedidos || [];
        const tecidosAnteriores = anterior.tecidos || [];

        // 1. Novos pedidos
        pedidos.forEach(pedido => {
            const id = String(pedido.id ?? pedido.numero);

            const existia = pedidosAnteriores.some(
                p => String(p.id) === id
            );

            if (!existia) {
                adicionarNotificacao(
                    "Novo pedido recebido",
                    `O pedido #${pedido.numero} de ${pedido.cliente} foi registrado.`,
                    "pedido",
                    "shopping_cart"
                );
            }
        });

        // 2. Produção finalizada
        pedidos.forEach(pedido => {
            const id = String(pedido.id ?? pedido.numero);

            const pedidoAnterior = pedidosAnteriores.find(
                p => String(p.id) === id
            );

            if (
                pedidoAnterior &&
                pedidoAnterior.status !== "pronto" &&
                pedido.status === "pronto"
            ) {
                adicionarNotificacao(
                    "Produção finalizada",
                    `O pedido #${pedido.numero} está pronto.`,
                    "producao",
                    "check_circle"
                );
            }
        });

        // 3. Atualização da logística
        pedidos.forEach(pedido => {
            const id = String(pedido.id ?? pedido.numero);

            const pedidoAnterior = pedidosAnteriores.find(
                p => String(p.id) === id
            );

            if (
                pedidoAnterior &&
                pedidoAnterior.statusLogistica !== pedido.statusLogistica &&
                pedido.status === "pronto"
            ) {
                adicionarNotificacao(
                    "Atualização na logística",
                    `O pedido #${pedido.numero} teve seu andamento atualizado.`,
                    "logistica",
                    "local_shipping"
                );
            }
        });

        // 4. Estoque baixo
        tecidos.forEach(tecido => {
            const id = String(tecido.id);

            const tecidoAnterior = tecidosAnteriores.find(
                t => String(t.id) === id
            );

            const quantidade = Number(tecido.quantidade);
            const minimo = Number(tecido.estoqueMinimo);

            const estoqueBaixo =
                Number.isFinite(quantidade) &&
                Number.isFinite(minimo) &&
                quantidade <= minimo;

            const estavaBaixo = tecidoAnterior
                ? Number(tecidoAnterior.quantidade) <=
                  Number(tecidoAnterior.estoqueMinimo)
                : false;

            if (estoqueBaixo && !estavaBaixo) {
                adicionarNotificacao(
                    "Estoque baixo",
                    `O tecido ${tecido.nome} atingiu o limite mínimo de estoque.`,
                    "estoque",
                    "inventory_2"
                );
            }
        });

        // Adicionar novas notificações à lista compartilhada
        if (novas.length > 0) {
            setNotificacoes(prev => [...novas, ...prev]);
        }

        // Atualizar estado anterior
        localStorage.setItem(
            chaveEstado,
            JSON.stringify(estadoAtual)
        );

    }, [pedidos, tecidos, setNotificacoes]);

    // Indicadores
    const naoLidas = notificacoes.filter(n => !n.lida).length;
    const total = notificacoes.length;

    // Filtros
    const notificacoesFiltradas = notificacoes.filter(n => {

        const correspondeStatus =
            filtro === "todas" ||
            (filtro === "naoLidas" && !n.lida) ||
            (filtro === "lidas" && n.lida);

        const correspondeCategoria =
            categoria === "todas" || n.tipo === categoria;

        return correspondeStatus && correspondeCategoria;
    });

    // Marcar uma como lida
    function marcarComoLida(id) {
        setNotificacoes(prev =>
            prev.map(n =>
                n.id === id ? { ...n, lida: true } : n
            )
        );
    }

    // Marcar todas como lidas
    function marcarTodasComoLidas() {
        setNotificacoes(prev =>
            prev.map(n => ({ ...n, lida: true }))
        );
    }

    // Excluir uma notificação
    function excluirNotificacao(id) {
        setNotificacoes(prev =>
            prev.filter(n => n.id !== id)
        );
    }

    // Limpar todas
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
