
import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

function Relatorio({ pedidos = [] }) {

    const recebidos = pedidos.length;

    const emProducao = pedidos.filter(pedido =>
        ["corte", "costura", "acabamento", "conferencia"].includes(
            pedido.status
        )
    ).length;

    const prontos = pedidos.filter(
        pedido => pedido.status === "pronto"
    ).length;

    const atrasados = pedidos.filter(
        pedido => pedido.atrasado
    ).length;

    const emProducaoNoPrazo = pedidos.filter(
        pedido =>
            ["corte", "costura", "acabamento", "conferencia"].includes(
                pedido.status
            ) && !pedido.atrasado
    ).length;

    const dadosGrafico = [
        { nome: "Recebidos", quantidade: recebidos },
        { nome: "Em produção", quantidade: emProducao },
        { nome: "Prontos", quantidade: prontos },
        { nome: "Atrasados", quantidade: atrasados }
    ];

    const coresGrafico = [
        "#ff009d",
        "#094d6c",
        "#50134c",
        "#DC2626"
    ];

    return (
        <main>
            <div className="graficos-relatorios">

                <div className="grafico-relat">
                    <h3>Gráfico de pedidos</h3>

                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={dadosGrafico}
                                dataKey="quantidade"
                                nameKey="nome"
                                cx="50%"
                                cy="50%"
                                outerRadius={110}
                                label
                            >
                                {dadosGrafico.map((item, index) => (
                                    <Cell
                                        key={`celula-${index}`}
                                        fill={coresGrafico[index]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="grafico-relat">
                    <h3>Gráfico de produção</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={dadosGrafico}
                                dataKey="quantidade"
                                nameKey="nome"
                                cx="50%"
                                cy="50%"
                                outerRadius={110}
                                label
                            >
                                {dadosGrafico.map((item, index) => (
                                    <Cell
                                        key={`celula-${index}`}
                                        fill={coresGrafico[index]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    <p>Em produção no prazo: {emProducaoNoPrazo}</p>
                </div>

                <div className="grafico-relat">
                    <h3>Gráfico de estoque</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={dadosGrafico}
                                dataKey="quantidade"
                                nameKey="nome"
                                cx="50%"
                                cy="50%"
                                outerRadius={110}
                                label
                            >
                                {dadosGrafico.map((item, index) => (
                                    <Cell
                                        key={`celula-${index}`}
                                        fill={coresGrafico[index]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="grafico-relat">
                    <h3>Gráfico de logística</h3>

                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={dadosGrafico}
                                dataKey="quantidade"
                                nameKey="nome"
                                cx="50%"
                                cy="50%"
                                outerRadius={110}
                                label
                            >
                                {dadosGrafico.map((item, index) => (
                                    <Cell
                                        key={`celula-${index}`}
                                        fill={coresGrafico[index]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>

                </div>

            </div>
        </main>
    );
}

export default Relatorio;
