
import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

// Etapas da produção
const etapasProducao = [
    { valor: "recebido", nome: "Recebidos" },
    { valor: "corte", nome: "Corte" },
    { valor: "costura", nome: "Costura" },
    { valor: "acabamento", nome: "Acabamento" },
    { valor: "conferencia", nome: "Conferência" },
    { valor: "pronto", nome: "Prontos" },
    { valor: "enviado", nome: "Enviados" }
];

// Etapas da logística
const etapasLogistica = [
    { valor: "aguardando_expedicao", nome: "Aguardando expedição" },
    { valor: "separacao", nome: "Separação" },
    { valor: "conferencia", nome: "Conferência" },
    { valor: "despachado", nome: "Despachados" },
    { valor: "em_transporte", nome: "Em transporte" },
    { valor: "entregue", nome: "Entregues" }
];

// Componente reutilizável dos gráficos
function GraficoPizza({ titulo, dados, cores, unidade = "pedidos" }) {

    if (!dados.some(item => item.quantidade > 0)) {
        return (
            <div className="grafico-relat">
                <h3>{titulo}</h3>
                <p>Nenhum dado registrado.</p>
            </div>
        );
    }

    return (
        <div className="grafico-relat">
            <h3>{titulo}</h3>

            <ResponsiveContainer width="100%" height={500}>
                <PieChart>
                    <Pie
                        data={dados}
                        dataKey="quantidade"
                        nameKey="nome"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        label={
                            dados.some(item => item.quantidade > 0)
                                ? ({ x, y, name, percent, index, textAnchor }) => (
                                    <text
                                        x={x}
                                        y={y}
                                        fill={cores[index % cores.length]}
                                        textAnchor={textAnchor}
                                        dominantBaseline="central"
                                        fontSize={25}
                                    >
                                        {`${name} (${(percent * 100).toFixed(0)}%)`}
                                    </text>
                                )
                                : false
                        }
                    >
                        {dados.map((item, index) => (
                            <Cell
                                key={`celula-${index}`}
                                fill={cores[index % cores.length]}
                            />
                        ))}
                    </Pie>

                    <Tooltip
                        formatter={(valor) => [
                            `${valor} ${unidade}`,
                            "Quantidade"
                        ]}
                    />

                    <Legend
                        content={({ payload }) => {
                            const itensVisiveis = payload?.filter(
                                item => Number(item.payload?.quantidade) > 0
                            );

                            return (
                                <div className="legenda-grafico">
                                    {itensVisiveis.map((item, index) => (
                                        <div className="legenda-item" key={index}>
                                            <span
                                                className="legenda-cor"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span style={{ color: item.color }}>
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            );
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

function Relatorio({ pedidos = [], tecidos = [] }) {

    // =====================================
    // 1. GRÁFICO DE PEDIDOS
    // =====================================

    const recebidos = pedidos.filter(
        pedido => pedido.status === "recebido"
    ).length;

    const emProducao = pedidos.filter(pedido =>
        ["corte", "costura", "acabamento", "conferencia"].includes(
            pedido.status
        )
    ).length;

    const prontos = pedidos.filter(
        pedido => pedido.status === "pronto"
    ).length;

    const enviados = pedidos.filter(
        pedido => pedido.status === "enviado"
    ).length;

    const atrasados = pedidos.filter(
        pedido => pedido.atrasado
    ).length;

    const dadosPedidos = [
        { nome: "Recebidos", quantidade: recebidos },
        { nome: "Em produção", quantidade: emProducao },
        { nome: "Prontos", quantidade: prontos },
        { nome: "Enviados", quantidade: enviados }
    ];

    // =====================================
    // 2. GRÁFICO DE PRODUÇÃO
    // =====================================

    const dadosProducao = etapasProducao.map(etapa => ({
        nome: etapa.nome,
        quantidade: pedidos.filter(
            pedido => pedido.status === etapa.valor
        ).length
    }));

    // =====================================
    // 3. GRÁFICO DE ESTOQUE
    // =====================================

    const estoqueBaixo = tecidos
        .filter(tecido =>
            tecido.quantidade <= tecido.estoqueMinimo
        )
        .reduce((total, tecido) =>
            total + Number(tecido.quantidade || 0), 0
        );

    const estoqueAdequado = tecidos
        .filter(tecido =>
            tecido.quantidade > tecido.estoqueMinimo
        )
        .reduce((total, tecido) =>
            total + Number(tecido.quantidade || 0), 0
        );

    const dadosEstoque = [
        { nome: "Estoque adequado", quantidade: estoqueAdequado },
        { nome: "Estoque baixo", quantidade: estoqueBaixo }
    ];

    // =====================================
    // 4. GRÁFICO DE LOGÍSTICA
    // =====================================

    // Apenas pedidos que já estão prontos
    const pedidosLogistica = pedidos.filter(
        pedido => pedido.status === "pronto"
    );

    const dadosLogistica = etapasLogistica.map(etapa => ({
        nome: etapa.nome,
        quantidade: pedidosLogistica.filter(
            pedido =>
                (pedido.statusLogistica || "aguardando_expedicao") ===
                etapa.valor
        ).length
    }));

    // =====================================
    // CORES DOS GRÁFICOS
    // =====================================

    const coresPedidos = [
        "#ff009d",
        "#094d6c",
        "#50134c",
        "#D97706"
    ];

    const coresProducao = [
        "#D97706",
        "#B45309",
        "#92400E",
        "#C2410C",
        "#EA580C",
        "#15803D",
        "#2563EB"
    ];

    const coresEstoque = [
        "#15803D",
        "#DC2626"
    ];

    const coresLogistica = [
        "#D97706",
        "#B45309",
        "#92400E",
        "#C2410C",
        "#2563EB",
        "#15803D"
    ];

    return (
        <main>
            <div className="graficos-relatorios">

                {/* GRÁFICO DE PEDIDOS */}
                <GraficoPizza
                    titulo="Pedidos"
                    dados={dadosPedidos}
                    cores={coresPedidos}
                />

                {/* GRÁFICO DE PRODUÇÃO */}
                <GraficoPizza
                    titulo="Gráfico de produção"
                    dados={dadosProducao}
                    cores={coresProducao}
                />

                {/* GRÁFICO DE ESTOQUE */}
                <GraficoPizza
                    titulo="Gráfico de estoque"
                    dados={dadosEstoque}
                    cores={coresEstoque}
                    unidade="metros"
                />

                {/* GRÁFICO DE LOGÍSTICA */}
                <GraficoPizza
                    titulo="Gráfico de logística"
                    dados={dadosLogistica}
                    cores={coresLogistica}
                />

            </div>

            <div className="resumo-relatorios">
                <p>
                    <strong>Pedidos atrasados:</strong> {atrasados}
                </p>

                <p>
                    <strong>Pedidos em produção no prazo:</strong>{" "}
                    {pedidos.filter(pedido =>
                        ["corte", "costura", "acabamento", "conferencia"].includes(
                            pedido.status
                        ) && !pedido.atrasado
                    ).length}
                </p>

                <p>
                    <strong>Total de tecidos cadastrados:</strong>{" "}
                    {tecidos.length}
                </p>
            </div>
        </main>
    );
}

export default Relatorio;
