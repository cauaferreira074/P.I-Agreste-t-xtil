
import {
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts";

function MiniGrafico({
    dados = [],
    cor = "#D97706",
    periodo = "semana"
}) {
    const agora = new Date();
    const dias = periodo === "semana" ? 7 : 30;

    const dataInicial = new Date(agora);
    dataInicial.setDate(agora.getDate() - dias);
    dataInicial.setHours(0, 0, 0, 0);

    const dadosValidos = dados
        .filter(item => {
            const data = new Date(item.data);

            return (
                Number.isFinite(Number(item.valor)) &&
                !isNaN(data.getTime()) &&
                data >= dataInicial &&
                data <= agora
            );
        })
        .sort((a, b) => new Date(a.data) - new Date(b.data));

    if (dadosValidos.length < 2) {
        return (
            <div className="mini-grafico-vazio">
                Histórico insuficiente
            </div>
        );
    }

    return (
        <div className="mini-grafico">
            <ResponsiveContainer width="100%" height={45}>
                <LineChart data={dadosValidos}>
                    <Line
                        type="monotone"
                        dataKey="valor"
                        stroke={cor}
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default MiniGrafico;
