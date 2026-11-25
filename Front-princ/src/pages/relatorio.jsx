
import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Cell
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

// Gráfico reutilizável
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
                <BarChart
                    data={dados}
                    margin={{ top: 25, right: 25, left: 10, bottom: 15 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="nome"
                        tick={{ fontSize: 13 }}
                        interval={0}
                    />

                    <YAxis allowDecimals={false} />

                    <Tooltip
                        formatter={(valor) => [
                            `${valor} ${unidade}`,
                            "Quantidade"
                        ]}
                    />

                    <Bar
                        dataKey="quantidade"
                        name="Quantidade"
                        radius={[7, 7, 0, 0]}
                        maxBarSize={65}
                    >
                        {dados.map((item, index) => (
                            <Cell
                                key={`celula-${index}`}
                                fill={cores[index % cores.length]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            <div className="legenda-grafico">
                {dados
                    .filter(item => item.quantidade > 0)
                    .map(item => {
                        const index = dados.indexOf(item);

                        return (
                            <div className="legenda-item" key={item.nome}>
                                <span
                                    className="legenda-cor"
                                    style={{
                                        backgroundColor: cores[index % cores.length]
                                    }}
                                />
                                <span>
                                    {item.nome}
                                </span>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

// Gráfico comparativo de estoque atual x mínimo
function GraficoComparativo({ titulo, dados }) {

    if (!dados.some(item => item.atual > 0 || item.minimo > 0)) {
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
                <BarChart
                    data={dados}
                    margin={{ top: 25, right: 25, left: 10, bottom: 15 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="nome"
                        tick={{ fontSize: 13 }}
                        interval={0}
                    />

                    <YAxis allowDecimals={false} />

                    <Tooltip
                        formatter={(valor) => [`${valor} metros`]}
                    />

                    <Legend />

                    <Bar
                        dataKey="atual"
                        name="Estoque atual"
                        fill="#D97706"
                        radius={[7, 7, 0, 0]}
                    />

                    <Bar
                        dataKey="minimo"
                        name="Estoque mínimo"
                        fill="#DC2626"
                        radius={[7, 7, 0, 0]}
                    />
                </BarChart>
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
    // 3. ANÁLISE DE ESTOQUE
    // =====================================

    const tecidosAnalisados = tecidos.map(tecido => ({
        nome: tecido.nome,
        quantidade: Number(tecido.quantidade || 0),
        estoqueMinimo: Number(tecido.estoqueMinimo ?? 20)
    }));

    // Distribuição por categoria

    const estoqueBaixo = tecidosAnalisados.filter(
        tecido => tecido.quantidade <= tecido.estoqueMinimo
    ).length;

    const estoqueMedio = tecidosAnalisados.filter(
        tecido =>
            tecido.quantidade > tecido.estoqueMinimo &&
            tecido.quantidade <= tecido.estoqueMinimo * 2
    ).length;

    const estoqueAlto = tecidosAnalisados.filter(
        tecido => tecido.quantidade > tecido.estoqueMinimo * 2
    ).length;

    const dadosEstoqueCategorias = [
        { nome: "Estoque baixo", quantidade: estoqueBaixo },
        { nome: "Estoque médio", quantidade: estoqueMedio },
        { nome: "Estoque alto", quantidade: estoqueAlto }
    ];

    // Quantidade disponível por tecido

    const dadosQuantidadeTecidos = tecidosAnalisados.map(tecido => ({
        nome: tecido.nome,
        quantidade: tecido.quantidade
    }));

    // Estoque atual x estoque mínimo

    const dadosComparativoEstoque = tecidosAnalisados.map(tecido => ({
        nome: tecido.nome,
        atual: tecido.quantidade,
        minimo: tecido.estoqueMinimo
    }));

    // =====================================
    // 4. GRÁFICO DE LOGÍSTICA
    // =====================================

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
    // 5. CORES DOS GRÁFICOS
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
        "#DC2626",
        "#F59E0B",
        "#15803D"
    ];

    const coresQuantidade = [
        "#D97706",
        "#B45309",
        "#92400E",
        "#C2410C",
        "#EA580C"
    ];

    const coresLogistica = [
        "#D97706",
        "#B45309",
        "#92400E",
        "#C2410C",
        "#2563EB",
        "#15803D"
    ];

    // =====================================
    // 6. TELA DE RELATÓRIOS
    // =====================================

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

                {/* DISTRIBUIÇÃO DO ESTOQUE */}
                <GraficoPizza
                    titulo="Distribuição do estoque"
                    dados={dadosEstoqueCategorias}
                    cores={coresEstoque}
                    unidade="materiais"
                />

                {/* QUANTIDADE POR TECIDO */}
                <GraficoPizza
                    titulo="Quantidade disponível por tecido"
                    dados={dadosQuantidadeTecidos}
                    cores={coresQuantidade}
                    unidade="metros"
                />

                {/* ESTOQUE ATUAL X MÍNIMO */}
                <GraficoComparativo
                    titulo="Estoque atual x estoque mínimo"
                    dados={dadosComparativoEstoque}
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
                    <strong>Materiais com estoque baixo:</strong> {estoqueBaixo}
                </p>

                <p>
                    <strong>Materiais com estoque médio:</strong> {estoqueMedio}
                </p>

                <p>
                    <strong>Materiais com estoque alto:</strong> {estoqueAlto}
                </p>

                <p>
                    <strong>Total de tecidos cadastrados:</strong> {tecidos.length}
                </p>
            </div>
        </main>
    );
}

export default Relatorio;
