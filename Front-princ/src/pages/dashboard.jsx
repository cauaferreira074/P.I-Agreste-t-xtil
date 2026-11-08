import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";


function Dashboard({ pedidos = [], tecidos = [], setPagina, animar }) {

    const recebidos = pedidos.filter(
        pedido => pedido.status === "recebido"
    ).length;

    const prontos = pedidos.filter(
        pedido => pedido.status === "pronto"
    ).length;

    const emProducao = pedidos.filter(
        pedido => [
            "corte",
            "costura",
            "acabamento",
            "conferencia"
        ].includes(pedido.status)
    ).length;

    const atrasados = pedidos.filter(
        pedido => pedido.atrasado
    ).length;

    const estoqueBaixo = tecidos.filter(
        tecido => tecido.quantidade <= tecido.estoqueMinimo
    ).length;

    const estoqueMedio = tecidos.filter(
        tecido =>
            tecido.quantidade > tecido.estoqueMinimo &&
            tecido.quantidade <= tecido.estoqueMinimo * 2
    ).length;

    const estoqueAlto = tecidos.filter(
        tecido => tecido.quantidade > tecido.estoqueMinimo * 2
    ).length;

    const pedidosAtrasados = pedidos.filter(
        pedido => pedido.atrasado
    ).length;

    const recebidosNoPrazo = pedidos.filter(
        pedido => pedido.status === "recebido" && !pedido.atrasado
    ).length;

    const prontosNoPrazo = pedidos.filter(
        pedido => pedido.status === "pronto" && !pedido.atrasado
    ).length;

    const emProducaoNoPrazo = pedidos.filter(
        pedido =>
            ["corte", "costura", "acabamento", "conferencia"].includes(pedido.status) &&
            !pedido.atrasado
    ).length;



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

    console.log("Dados do gráfico:", dadosGrafico);

    console.log(
        "Total:",
        dadosGrafico.reduce((total, item) => total + item.quantidade, 0)
    );
    return (
        <>
            <header>
                <h2 className="dashboard">Dashboard</h2>
                <p>Acompanhe os cards da sua operação</p>
            </header>

            <section className="cards">

                <article className="card">
                    <h3>Pedidos recebidos</h3>
                    <span>{recebidos}</span>
                    <img key={animar} src="/recebidos.png" alt="Pedidos recebidos" className="img-card icone-pulo" />
                </article>

                <article className="card">
                    <h3>Prontos</h3>
                    <span>{prontos}</span>
                    <img key={animar} src="/prontos.png" alt="Pedidos prontos" className="img-card icone-pulo" />
                </article>

                <article className="card">
                    <h3>Em produção</h3>
                    <span>{emProducao}</span>
                    <img key={animar}
                        src="/producao.png" alt="Pedidos em produção" className="img-card icone-pulo" />
                </article>

                <article className="card">
                    <h3>Atrasados</h3>
                    <span>{atrasados}</span>
                    <img key={animar} src="/atrasados.png" alt="Pedidos atrasados" className="img-card icone-pulo" />
                </article>

                <article
                    className="card"
                    onClick={() => setPagina("Estoque")}
                    style={{ cursor: "pointer" }}
                >
                    <h3>Estoque</h3>

                    <p>Baixo: {estoqueBaixo}</p>

                    <p>Médio: {estoqueMedio}</p>

                    <p>Alto: {estoqueAlto}</p>

                    <small>Ver detalhes do estoque →</small>
                </article>

            </section>

            <div className="tabela">


                <section className="grafico-container">

                    <h3 className="visaoPedidos">Visão geral dos pedidos</h3>
                    <div style={{ width: "100%", height: "600px" }}>

                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>

                                <Pie
                                    data={dadosGrafico}
                                    dataKey="quantidade"
                                    nameKey="nome"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={190}
                                    fill="#8884d8"
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

                </section>

                <section className="ultimosPedidos">
                    <div className="tituloPedidos">
                        <div className="acompanhamentoPedidos">
                            <p>Acompanhe os pedidos recentes</p>
                        </div>

                        <span>{pedidos.length} pedidos</span>
                    </div>

                    {pedidos.length === 0 ? (
                        <p className="semPedidos">Nenhum pedido cadastrado.</p>
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
                                    {[...pedidos].slice(-5).reverse().map((pedido) => (
                                        <tr key={pedido.id}>
                                            <td>#{pedido.id}</td>
                                            <td>{pedido.cliente}</td>
                                            <td>
                                                <span className={`statusPedido ${pedido.status}`}>
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
