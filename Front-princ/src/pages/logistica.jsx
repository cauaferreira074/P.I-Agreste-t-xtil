
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



function Logistica({
    pedidos,
    setPedidos,
    registrarHistoricoPedido
}) {
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

        const pedidoAtual = pedidos.find(
            pedido => String(pedido.numero) === String(numero)
        );

        if (
            !pedidoAtual ||
            (pedidoAtual.statusLogistica || "aguardando_expedicao") === novoStatus
        ) {
            return;
        }

        const statusAnterior =
            pedidoAtual.statusLogistica || "aguardando_expedicao";

        setPedidos(atuais =>
            atuais.map(pedido =>
                String(pedido.numero) === String(numero)
                    ? { ...pedido, statusLogistica: novoStatus }
                    : pedido
            )
        );

        registrarHistoricoPedido({
            tipo: "alteracao_logistica",
            numero,
            statusLogisticaAnterior: statusAnterior,
            statusLogisticaNovo: novoStatus
        });
    }

    return (
        <main className="logistica">

            <header>
                <h2>Logística</h2>
                <p>Acompanhe a expedição e entrega dos pedidos.</p>
            </header>

            <input
                className="pesquisa-logistica"
                type="search"
                placeholder="Procurar pedido..."
                value={pesquisa}
                onChange={evento => setPesquisa(evento.target.value)}
            />

            <div className="tabela-logistica">
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


            <section className="painel-logistica">

                <div className="painel-logistica-texto">
                    <span className="painel-logistica-etiqueta">
                        AGRESTE TÊXTIL
                    </span>

                    <h2>
                        Da produção até a entrega.
                    </h2>

                    <p>
                        Cada pedido percorre um caminho.
                        Acompanhe as etapas e mantenha sua operação organizada.
                    </p>

                    <div className="painel-logistica-detalhe">
                        <span className="material-symbols-outlined">
                            inventory_2
                        </span>

                        <span>
                            Organização, controle e eficiência logística.
                        </span>
                    </div>
                </div>

                <div className="painel-logistica-ilustracao">
                    <div className="logistica-circulo">
                        <span className="material-symbols-outlined">
                            local_shipping
                        </span>
                    </div>

                    <div className="logistica-linha"></div>

                    <div className="logistica-circulo secundario">
                        <span className="material-symbols-outlined">
                            package_2
                        </span>
                    </div>
                </div>

            </section>


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

