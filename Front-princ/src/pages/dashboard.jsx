
import { useState } from "react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Cell,
    LineChart,
    Line
} from "recharts";

import MiniGrafico from "./MiniGrafico";

function Dashboard({
    pedidos = [],
    tecidos = [],
    historicoPedidos = [],
    historicoEstoque = [],
    setPagina,
    animar
}) {

    // Controle dos períodos de cada card
    const [periodos, setPeriodos] = useState({
        recebidos: "semana",
        prontos: "semana",
        producao: "semana",
        atrasados: "semana",
        estoque: "semana"
    });

    function alterarPeriodo(card, periodo) {
        setPeriodos(atual => ({
            ...atual,
            [card]: periodo
        }));
    }

    // Indicadores principais
    const recebidos = pedidos.filter(
        pedido => pedido.status === "recebido"
    ).length;

    const prontos = pedidos.filter(
        pedido => pedido.status === "pronto"
    ).length;

    const statusProducao = [
        "corte",
        "costura",
        "acabamento",
        "conferencia"
    ];

    const emProducao = pedidos.filter(
        pedido => statusProducao.includes(pedido.status)
    ).length;

    const hoje = new Date();

    const dataHoje = [
        hoje.getFullYear(),
        String(hoje.getMonth() + 1).padStart(2, "0"),
        String(hoje.getDate()).padStart(2, "0")
    ].join("-");

    const atrasados = pedidos.filter(pedido => {
        const prazoVencido =
            pedido.prazo && pedido.prazo < dataHoje;

        const pedidoConcluido =
            pedido.status === "enviado" ||
            pedido.statusLogistica === "entregue";

        return prazoVencido && !pedidoConcluido;
    }).length;

    // Indicadores do estoque
    const totalMateriais = tecidos.length;

    const quantidadeTotal = tecidos.reduce(
        (total, tecido) =>
            total + Number(tecido.quantidade || 0),
        0
    );

    // Histórico de movimentações do estoque
    const dadosEvolucaoEstoque = [...historicoEstoque]
        .filter(item =>
            item.data &&
            item.saldoTotal !== null &&
            item.saldoTotal !== undefined &&
            Number.isFinite(Number(item.saldoTotal))
        )
        .map((item, index) => ({
            id: item.id ?? index,
            data: item.data,
            momento: new Date(item.data).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }),
            saldo: Number(item.saldoTotal)
        }))
        .sort((a, b) =>
            new Date(a.data) - new Date(b.data)
        );

    // Histórico dos eventos dos pedidos
    const eventosOrdenados = [...historicoPedidos]
        .filter(evento =>
            evento.data &&
            !isNaN(new Date(evento.data).getTime())
        )
        .sort((a, b) =>
            new Date(b.data) - new Date(a.data)
        );

    // Calcula os indicadores dos pedidos em uma data específica
    function contarPedidosHistoricos(estado, dataReferencia) {
        const lista = [...estado.values()];

        const dataRef = [
            dataReferencia.getFullYear(),
            String(dataReferencia.getMonth() + 1).padStart(2, "0"),
            String(dataReferencia.getDate()).padStart(2, "0")
        ].join("-");

        return {
            recebidos: lista.filter(
                pedido => pedido.status === "recebido"
            ).length,

            prontos: lista.filter(
                pedido => pedido.status === "pronto"
            ).length,

            producao: lista.filter(
                pedido => statusProducao.includes(pedido.status)
            ).length,

            atrasados: lista.filter(pedido => {
                const vencido =
                    pedido.prazo && pedido.prazo < dataRef;

                const concluido =
                    pedido.status === "enviado" ||
                    pedido.statusLogistica === "entregue";

                return vencido && !concluido;
            }).length
        };
    }

    // Reconstrói os pedidos no final de cada dia ou mês
    function gerarHistoricoPedidos(chave, periodo) {
        const resultado = [];

        const quantidadePeriodos =
            periodo === "semana" ? 7 : 6;

        const agora = new Date();

        for (let i = quantidadePeriodos - 1; i >= 0; i--) {
            let proximoPeriodo;
            let dataReferencia;
            let dataGrafico;

            if (periodo === "semana") {
                const inicio = new Date(agora);
                inicio.setHours(0, 0, 0, 0);
                inicio.setDate(inicio.getDate() - i);

                proximoPeriodo = new Date(inicio);
                proximoPeriodo.setDate(
                    proximoPeriodo.getDate() + 1
                );

                dataReferencia = new Date(
                    proximoPeriodo.getTime() - 1
                );

                dataGrafico = new Date(inicio);
            } else {
                const inicio = new Date(
                    agora.getFullYear(),
                    agora.getMonth() - i,
                    1
                );

                proximoPeriodo = new Date(
                    inicio.getFullYear(),
                    inicio.getMonth() + 1,
                    1
                );

                dataReferencia = new Date(
                    proximoPeriodo.getTime() - 1
                );

                dataGrafico = new Date(
                    inicio.getFullYear(),
                    inicio.getMonth(),
                    15,
                    12
                );
            }

            // Começa com o estado atual dos pedidos
            const estado = new Map(
                pedidos.map(pedido => [
                    String(pedido.numero),
                    { ...pedido }
                ])
            );

            // Desfaz as alterações posteriores ao período analisado
            const eventosPosteriores = eventosOrdenados.filter(
                evento =>
                    new Date(evento.data) >= proximoPeriodo
            );

            eventosPosteriores.forEach(evento => {
                const numero = String(evento.numero);
                const pedido = estado.get(numero);

                if (evento.tipo === "alteracao_status" && pedido) {
                    estado.set(numero, {
                        ...pedido,
                        status: evento.statusAnterior
                    });
                }

                if (evento.tipo === "alteracao_prazo" && pedido) {
                    estado.set(numero, {
                        ...pedido,
                        prazo: evento.prazoAnterior
                    });
                }

                if (evento.tipo === "alteracao_logistica" && pedido) {
                    estado.set(numero, {
                        ...pedido,
                        statusLogistica:
                            evento.statusLogisticaAnterior
                    });
                }

                if (evento.tipo === "criacao") {
                    estado.delete(numero);
                }

                if (evento.tipo === "exclusao" && evento.pedido) {
                    estado.set(numero, {
                        ...evento.pedido
                    });
                }
            });

            const contagem = contarPedidosHistoricos(
                estado,
                dataReferencia
            );

            dataGrafico.setHours(12, 0, 0, 0);

            resultado.push({
                data: dataGrafico.toISOString(),
                valor: contagem[chave]
            });
        }

        return resultado;
    }

    // Histórico do estoque por semana ou mês
    function gerarHistoricoEstoque(periodo) {
        const resultado = [];

        const quantidadePeriodos =
            periodo === "semana" ? 7 : 6;

        const agora = new Date();

        for (let i = quantidadePeriodos - 1; i >= 0; i--) {
            let fim;
            let dataGrafico;

            if (periodo === "semana") {
                const inicio = new Date(agora);
                inicio.setHours(0, 0, 0, 0);
                inicio.setDate(inicio.getDate() - i);

                fim = new Date(inicio);
                fim.setHours(23, 59, 59, 999);

                dataGrafico = new Date(inicio);
            } else {
                const inicio = new Date(
                    agora.getFullYear(),
                    agora.getMonth() - i,
                    1
                );

                const proximoMes = new Date(
                    inicio.getFullYear(),
                    inicio.getMonth() + 1,
                    1
                );

                fim = new Date(proximoMes.getTime() - 1);

                dataGrafico = new Date(
                    inicio.getFullYear(),
                    inicio.getMonth(),
                    15,
                    12
                );
            }

            // Obtém o último saldo registrado até o final do período
            const registrosDoPeriodo = dadosEvolucaoEstoque.filter(
                item => new Date(item.data) <= fim
            );

            const ultimoRegistro =
                registrosDoPeriodo[registrosDoPeriodo.length - 1];

            dataGrafico.setHours(12, 0, 0, 0);

            resultado.push({
                data: dataGrafico.toISOString(),
                valor: ultimoRegistro
                    ? ultimoRegistro.saldo
                    : 0
            });
        }

        return resultado;
    }

    // Dados dos cinco mini gráficos
    const dadosMiniRecebidos = gerarHistoricoPedidos(
        "recebidos",
        periodos.recebidos
    );

    const dadosMiniProntos = gerarHistoricoPedidos(
        "prontos",
        periodos.prontos
    );

    const dadosMiniProducao = gerarHistoricoPedidos(
        "producao",
        periodos.producao
    );

    const dadosMiniAtrasados = gerarHistoricoPedidos(
        "atrasados",
        periodos.atrasados
    );

    const dadosMiniEstoque = gerarHistoricoEstoque(
        periodos.estoque
    );

    // Gráfico principal de pedidos
    const dadosGrafico = [
        { nome: "Recebidos", quantidade: recebidos },
        { nome: "Em produção", quantidade: emProducao },
        { nome: "Prontos", quantidade: prontos },
        { nome: "Atrasados", quantidade: atrasados }
    ];

    const coresGrafico = [
        "#3B82F6",
        "#F59E0B",
        "#16A34A",
        "#DC2626"
    ];

    // Seletor reutilizável dos períodos
    function SeletorPeriodo({ card }) {
        return (
            <select
                className="seletor-periodo"
                value={periodos[card]}
                onClick={evento => evento.stopPropagation()}
                onChange={evento =>
                    alterarPeriodo(card, evento.target.value)
                }
                aria-label="Selecionar período do gráfico"
            >
                <option value="semana">Últimos 7 dias</option>
                <option value="meses">Últimos 6 meses</option>
            </select>
        );
    }

    return (
        <>
            <header>
                <h2 className="dashboard">Dashboard</h2>
                <p>Acompanhe os cards da sua operação</p>
            </header>

            <section className="cards">

                {/* Pedidos recebidos */}
                <article className="card">
                    <h3>Pedidos recebidos</h3>

                    <span>{recebidos}</span>

                    <img
                        key={animar}
                        src={`${import.meta.env.BASE_URL}recebidos.png`}
                        alt="Pedidos recebidos"
                        className="img-card icone-pulo"
                    />

                    <SeletorPeriodo card="recebidos" />

                    <MiniGrafico
                        dados={dadosMiniRecebidos}
                        cor="#3B82F6"
                        periodo={periodos.recebidos}
                    />
                </article>

                {/* Pedidos prontos */}
                <article className="card">
                    <h3>Prontos</h3>

                    <span>{prontos}</span>

                    <img
                        key={animar}
                        src={`${import.meta.env.BASE_URL}prontos.png`}
                        alt="Pedidos prontos"
                        className="img-card icone-pulo"
                    />

                    <SeletorPeriodo card="prontos" />

                    <MiniGrafico
                        dados={dadosMiniProntos}
                        cor="#16A34A"
                        periodo={periodos.prontos}
                    />
                </article>

                {/* Pedidos em produção */}
                <article className="card">
                    <h3>Em produção</h3>

                    <span>{emProducao}</span>

                    <img
                        key={animar}
                        src={`${import.meta.env.BASE_URL}producao.png`}
                        alt="Pedidos em produção"
                        className="img-card icone-pulo"
                    />

                    <SeletorPeriodo card="producao" />

                    <MiniGrafico
                        dados={dadosMiniProducao}
                        cor="#F59E0B"
                        periodo={periodos.producao}
                    />
                </article>

                {/* Pedidos atrasados */}
                <article className="card">
                    <h3>Atrasados</h3>

                    <span>{atrasados}</span>

                    <img
                        key={animar}
                        src={`${import.meta.env.BASE_URL}atrasados.png`}
                        alt="Pedidos atrasados"
                        className="img-card icone-pulo"
                    />

                    <SeletorPeriodo card="atrasados" />

                    <MiniGrafico
                        dados={dadosMiniAtrasados}
                        cor="#DC2626"
                        periodo={periodos.atrasados}
                    />
                </article>

                {/* Estoque */}
                <article
                    className="card card-estoque"
                    onClick={() => setPagina("Estoque")}
                    style={{ cursor: "pointer" }}
                >
                    <h3>Estoque</h3>

                    <span>{totalMateriais}</span>

                    <small>Materiais cadastrados</small>

                    <SeletorPeriodo card="estoque" />

                    <MiniGrafico
                        dados={dadosMiniEstoque}
                        cor="#D97706"
                        periodo={periodos.estoque}
                    />

                    <small>Ver detalhes do estoque →</small>
                </article>

            </section>

            <div className="tabela">

                {/* Visão geral dos pedidos */}
                <section className="grafico-container">

                    <h3 className="visaoPedidos">
                        Visão geral dos pedidos
                    </h3>

                    <div style={{ width: "80%", height: "450px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={dadosGrafico}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 0,
                                    bottom: 10
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="nome"
                                    tick={{ fontSize: 12 }}
                                />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                <Bar
                                    dataKey="quantidade"
                                    name="Quantidade"
                                    radius={[6, 6, 0, 0]}
                                >
                                    {dadosGrafico.map((item, index) => (
                                        <Cell
                                            key={`celula-${index}`}
                                            fill={coresGrafico[index]}
                                        />
                                    ))}
                                </Bar>

                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </section>

                {/* Evolução do estoque */}
                <section className="grafico-container">

                    <h3>Evolução do estoque</h3>

                    {dadosEvolucaoEstoque.length === 0 ? (
                        <p>
                            Nenhuma movimentação registrada para gerar o gráfico.
                        </p>
                    ) : (
                        <div style={{ width: "100%", height: "350px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={dadosEvolucaoEstoque}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        left: 0,
                                        bottom: 10
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis
                                        dataKey="momento"
                                        tick={{ fontSize: 11 }}
                                    />

                                    <YAxis />

                                    <Tooltip />

                                    <Line
                                        type="monotone"
                                        dataKey="saldo"
                                        name="Quantidade em estoque"
                                        stroke="#D97706"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />

                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                </section>

                {/* Pedidos recentes */}
                <section className="ultimosPedidos">

                    <div className="tituloPedidos">
                        <div className="acompanhamentoPedidos">
                            <p>Acompanhe os pedidos recentes</p>
                        </div>

                        <span>{pedidos.length} pedidos</span>
                    </div>

                    {pedidos.length === 0 ? (
                        <p className="semPedidos">
                            Nenhum pedido cadastrado.
                        </p>
                    ) : (
                        <div className="tabelaPedidos">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Pedido</th>
                                        <th>Cliente</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {[...pedidos]
                                        .slice(-5)
                                        .reverse()
                                        .map(pedido => (
                                            <tr key={pedido.numero}>
                                                <td>#{pedido.numero}</td>

                                                <td>{pedido.cliente}</td>

                                                <td>
                                                    <span
                                                        className={`statusPedido ${pedido.status}`}
                                                    >
                                                        {pedido.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </section>

            </div>
        </>
    );
}

export default Dashboard;
