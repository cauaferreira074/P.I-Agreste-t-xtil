import { useState, useEffect } from "react";

function Estoque({ tecidos, setTecidos }) {



    // Estados dos campos
    const [nome, setNome] = useState("");
    const [cor, setCor] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [tipoMovimentacao, setTipoMovimentacao] = useState("entrada");
    const [tecidoSelecionado, setTecidoSelecionado] = useState("");
    const [quantidadeMovimentacao, setQuantidadeMovimentacao] = useState("");
    const [historico, setHistorico] = useState(() => {
        const dadosSalvos = localStorage.getItem("agreste_historico");

        return dadosSalvos
            ? JSON.parse(dadosSalvos)
            : [];
    });

    const [editandoId, setEditandoId] = useState(null);

    function movimentarEstoque(evento) {
        evento.preventDefault();

        const quantidadeMovimentada = Number(quantidadeMovimentacao);

        if (!tecidoSelecionado || quantidadeMovimentada <= 0) {
            alert("Selecione um tecido e informe uma quantidade válida.");
            return;
        }

        const tecido = tecidos.find(
            item => item.id === Number(tecidoSelecionado)
        );

        if (!tecido) return;

        if (
            tipoMovimentacao === "saida" &&
            quantidadeMovimentada > tecido.quantidade
        ) {
            alert("Quantidade insuficiente no estoque!");
            return;
        }

        setTecidos(atuais =>
            atuais.map(item => {
                if (item.id === tecido.id) {
                    return {
                        ...item,
                        quantidade:
                            tipoMovimentacao === "entrada"
                                ? item.quantidade + quantidadeMovimentada
                                : item.quantidade - quantidadeMovimentada
                    };
                }

                return item;
            })
        );

        const novaMovimentacao = {
            id: Date.now(),
            tecido: tecido.nome,
            cor: tecido.cor,
            tipo: tipoMovimentacao,
            quantidade: quantidadeMovimentada,
            data: new Date().toLocaleString("pt-BR")
        };

        setHistorico(atuais => [novaMovimentacao, ...atuais]);

        setQuantidadeMovimentacao("");
        setTecidoSelecionado("");

        alert("Movimentação realizada com sucesso!");
    }

    function cadastrarTecido(evento) {
        evento.preventDefault();

        if (!nome || !cor || !quantidade || Number(quantidade) <= 0) {
            alert("Preencha todos os campos corretamente!");
            return;
        }

        const novoTecido = {
            id: Date.now(),
            estoqueMinimo: 20,
            nome: nome,
            cor: cor,
            quantidade: Number(quantidade),
            unidade: "metros"
        };

        setTecidos(atuais => [...atuais, novoTecido]);

        setNome("");
        setCor("");
        setQuantidade("");
    }

    const tecidosBaixos = tecidos.filter(
        tecido => tecido.quantidade <= tecido.estoqueMinimo
    );


    useEffect(() => {
        localStorage.setItem(
            "agreste_historico",
            JSON.stringify(historico)
        );
    }, [historico]);

    function excluirTecido(id) {
        const confirmar = window.confirm(
            "Deseja realmente excluir este tecido?"
        );

        if (!confirmar) return;

        setTecidos(atuais =>
            atuais.filter(tecido => tecido.id !== id)
        );
    }

    function editarTecido(tecido) {
        setEditandoId(tecido.id);

        setNome(tecido.nome);
        setCor(tecido.cor);
        setQuantidade(String(tecido.quantidade));
    }

    function salvarEdicao(evento) {
        evento.preventDefault();

        if (!nome || !cor || !quantidade || Number(quantidade) <= 0) {
            alert("Preencha todos os campos corretamente!");
            return;
        }

        setTecidos(atuais =>
            atuais.map(tecido =>
                tecido.id === editandoId
                    ? {
                        ...tecido,
                        nome,
                        cor,
                        quantidade: Number(quantidade)
                    }
                    : tecido
            )
        );

        setEditandoId(null);
        setNome("");
        setCor("");
        setQuantidade("");
    }

    return (
        <main className="estoque">

            <header>
                <h2>Estoque</h2>
                <p>Controle de tecidos e matérias-primas.</p>
            </header>

            <section className="alerta-estoque">

                <h3>Alertas de estoque</h3>

                {tecidosBaixos.length > 0 ? (
                    tecidosBaixos.map(tecido => (
                        <p key={tecido.id}>
                            Atenção: {tecido.nome} ({tecido.cor})
                            está com apenas {tecido.quantidade} metros disponíveis.
                        </p>
                    ))
                ) : (
                    <p>Todos os tecidos estão com estoque adequado.</p>
                )}

            </section>

            <form onSubmit={editandoId ? salvarEdicao : cadastrarTecido}>

                <input
                    type="text"
                    placeholder="Nome do tecido"
                    value={nome}
                    onChange={evento => setNome(evento.target.value)}
                />

                <input
                    type="text"
                    placeholder="Cor"
                    value={cor}
                    onChange={evento => setCor(evento.target.value)}
                />

                <input
                    type="number"
                    placeholder="Quantidade em metros"
                    value={quantidade}
                    onChange={evento => setQuantidade(evento.target.value)}
                />

                <button type="submit">
                    {editandoId ? "Salvar alterações" : "Cadastrar tecido"}
                </button>

            </form>

            <h3>Movimentação de estoque</h3>

            <form onSubmit={movimentarEstoque}>

                <select
                    value={tecidoSelecionado}
                    onChange={evento => setTecidoSelecionado(evento.target.value)}
                >
                    <option value="">Selecione um tecido</option>

                    {tecidos.map(tecido => (
                        <option key={tecido.id} value={tecido.id}>
                            {tecido.nome} - {tecido.cor}
                        </option>
                    ))}
                </select>

                <select
                    value={tipoMovimentacao}
                    onChange={evento => setTipoMovimentacao(evento.target.value)}
                >
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                </select>

                <input
                    type="number"
                    placeholder="Quantidade em metros"
                    value={quantidadeMovimentacao}
                    onChange={evento => setQuantidadeMovimentacao(evento.target.value)}
                    min="0.01"
                    step="0.01"
                />

                <button type="submit">
                    Registrar movimentação
                </button>

            </form>

            <div className="tabela-pedidos">
                <table>
                    <thead>
                        <tr>
                            <th>Tecido</th>
                            <th>Cor</th>
                            <th>Quantidade</th>
                            <th>Unidade</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tecidos.map(tecido => (
                            <tr key={tecido.id}>
                                <td>{tecido.nome}</td>
                                <td>{tecido.cor}</td>
                                <td>{tecido.quantidade}</td>
                                <td>{tecido.unidade}</td>
                                <td>
                                    <button onClick={() => excluirTecido(tecido.id)}>
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <section className="historico-estoque">

                <h3>Histórico de movimentações</h3>

                <div className="tabela-pedidos">
                    <table>
                        <thead>
                            <tr>
                                <th>Tecido</th>
                                <th>Cor</th>
                                <th>Tipo</th>
                                <th>Quantidade</th>
                                <th>Data</th>
                            </tr>
                        </thead>

                        <tbody>
                            {historico.map(movimentacao => (
                                <tr key={movimentacao.id}>
                                    <td>{movimentacao.tecido}</td>
                                    <td>{movimentacao.cor}</td>

                                    <td>
                                        {movimentacao.tipo === "entrada"
                                            ? "Entrada"
                                            : "Saída"}
                                    </td>

                                    <td>{movimentacao.quantidade} metros</td>
                                    <td>{movimentacao.data}</td>
                                </tr>
                            ))}

                            {historico.length === 0 && (
                                <tr>
                                    <td colSpan="5">
                                        Nenhuma movimentação registrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


            </section>


        </main >
    );
}

export default Estoque;