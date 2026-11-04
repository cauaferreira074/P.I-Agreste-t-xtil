
import { useState } from "react";
import AcompanhamentoLogistica from "./acompanhamentoLogistica";


const etapasLogistica = [
    { valor: "aguardando_expedicao", nome: "Aguardando expedição" },
    { valor: "separacao", nome: "Separação" },
    { valor: "conferencia", nome: "Conferência" },
    { valor: "despachado", nome: "Despachado" },
    { valor: "em_transporte", nome: "Em transporte" },
    { valor: "entregue", nome: "Entregue" }
];



function Logistica({ pedidos, setPedidos }) {
    const [pesquisa, setPesquisa] = useState("");

    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

    // Exibe somente pedidos que já estão prontos na produção
    const pedidosLogistica = pedidos.filter(pedido => {
        return pedido.status === "pronto";
    });

    // Pesquisa por número ou cliente
    const pedidosFiltrados = pedidosLogistica.filter(pedido => {
        const termo = pesquisa.toLowerCase();

        return (
            pedido.numero.toLowerCase().includes(termo) ||
            pedido.cliente.toLowerCase().includes(termo)
        );
    });

    // Atualiza a etapa logística
    function modificarLogistica(numero, novoStatus) {
        setPedidos(atuais =>
            atuais.map(pedido =>
                pedido.numero === numero
                    ? { ...pedido, statusLogistica: novoStatus }
                    : pedido
            )
        );
    }

    return (
        <main className="logistica">

            <header>
                <h2>Logística</h2>
                <p>Acompanhe a expedição e entrega dos pedidos.</p>
            </header>

            <input
                className="pesquisa-pedidos"
                type="search"
                placeholder="Procurar pedido..."
                value={pesquisa}
                onChange={evento => setPesquisa(evento.target.value)}
            />

            <div className="tabela-pedidos">
                <table>
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Cliente</th>
                            <th>Status</th>
                            <th>Previsão de entrega</th>
                            <th>Ação</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pedidosFiltrados.map(pedido => {
                            const statusAtual =
                                pedido.statusLogistica || "aguardando_expedicao";

                            const etapa = etapasLogistica.find(
                                item => item.valor === statusAtual
                            );

                            return (
                                <tr key={pedido.numero}
                                    onClick={() => setPedidoSelecionado(pedido)}
                                    style={{ cursor: "pointer" }}>
                                    <td>#{pedido.numero}</td>
                                    <td>{pedido.cliente}</td>
                                    <td>
                                        <span className={`status-logistica status-${statusAtual}`}>
                                            {etapa?.nome || statusAtual}
                                        </span>
                                    </td>
                                    <td>{pedido.prazo}</td>
                                    <td>
                                        <select
                                            value={statusAtual}
                                            onClick={evento => evento.stopPropagation()}
                                            onChange={evento =>
                                                modificarLogistica(
                                                    pedido.numero,
                                                    evento.target.value
                                                )
                                            }
                                        >
                                            {etapasLogistica.map(etapa => (
                                                <option
                                                    key={etapa.valor}
                                                    value={etapa.valor}
                                                >
                                                    {etapa.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            );
                        })}

                        {pedidosFiltrados.length === 0 && (
                            <tr>
                                <td colSpan="5">
                                    Nenhum pedido disponível para logística.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pedidoSelecionado && (
                <AcompanhamentoLogistica
                    pedido={pedidos.find(
                        p => p.numero === pedidoSelecionado.numero
                    )}
                    fechar={() => setPedidoSelecionado(null)}
                />
            )}

        </main>
    );
}

export default Logistica;

