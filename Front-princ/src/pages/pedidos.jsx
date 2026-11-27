
import { useState } from "react";
import Acompanhamento from "./acompanhamento";

const statusDisponiveis = [
  { valor: "recebido", nome: "Recebido" },
  { valor: "corte", nome: "Corte" },
  { valor: "costura", nome: "Costura" },
  { valor: "acabamento", nome: "Acabamento" },
  { valor: "conferencia", nome: "Conferência" },
  { valor: "pronto", nome: "Pronto" },
  { valor: "enviado", nome: "Enviado" },
];

function dataFormatada(data) {
  if (!data) return "—";

  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function Pedidos({
  pedidos = [],
  setPedidos,
  setAnimar,
  excluirPedido,
  registrarHistoricoPedido
}) {
  const [pesquisa, setPesquisa] = useState("");
  const [formularioAberto, setFormularioAberto] = useState(false);

  const [formulario, setFormulario] = useState({
    numero: "",
    cliente: "",
    quantidade: "",
    prazo: "",
  });

  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  function atualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario(atual => ({
      ...atual,
      [name]: value,
    }));
  }

  function editarPedido(pedido) {
    setFormulario({
      numero: pedido.numero,
      cliente: pedido.cliente,
      quantidade: pedido.quantidade,
      prazo: pedido.prazo,
    });

    setPedidoSelecionado(pedido);
    setModoEdicao(true);
    setFormularioAberto(true);
  }

  function salvarEdicao(evento) {
    evento.preventDefault();

    const numeroOriginal = pedidoSelecionado.numero;
    const numeroNovo = formulario.numero.trim().padStart(5, "0");

    const numeroExiste = pedidos.some(
      pedido =>
        pedido.numero === numeroNovo &&
        pedido.numero !== numeroOriginal
    );

    if (numeroExiste) {
      alert("Já existe um pedido com esse número.");
      return;
    }

    const pedidosAtualizados = pedidos.map(pedido =>
      pedido.numero === numeroOriginal
        ? {
            ...pedido,
            numero: numeroNovo,
            cliente: formulario.cliente.trim(),
            quantidade: Number(formulario.quantidade),
            prazo: formulario.prazo,
          }
        : pedido
    );

    setPedidos(pedidosAtualizados);

    if (pedidoSelecionado.prazo !== formulario.prazo) {
      registrarHistoricoPedido({
        tipo: "alteracao_prazo",
        numero: numeroOriginal,
        prazoAnterior: pedidoSelecionado.prazo,
        prazoNovo: formulario.prazo
      });
    }

    setFormulario({
      numero: "",
      cliente: "",
      quantidade: "",
      prazo: "",
    });

    setPedidoSelecionado(null);
    setModoEdicao(false);
    setFormularioAberto(false);
  }

  function registrarPedido(evento) {
    evento.preventDefault();

    const numero = formulario.numero.trim().padStart(5, "0");

    if (pedidos.some(pedido => pedido.numero === numero)) {
      alert("Já existe um pedido com esse número.");
      return;
    }

    const novoPedido = {
      ...formulario,
      numero,
      quantidade: Number(formulario.quantidade),
      status: "recebido",
      criadoEm: new Date().toISOString()
    };

    setPedidos(atuais => [novoPedido, ...atuais]);

    registrarHistoricoPedido({
      tipo: "criacao",
      numero: novoPedido.numero,
      statusNovo: novoPedido.status
    });

    setFormulario({
      numero: "",
      cliente: "",
      quantidade: "",
      prazo: "",
    });

    setFormularioAberto(false);
  }

  function modificarStatus(numero, novoStatus) {
    const pedidoAtual = pedidos.find(
      pedido => pedido.numero === numero
    );

    if (!pedidoAtual || pedidoAtual.status === novoStatus) {
      return;
    }

    setPedidos(atuais =>
      atuais.map(pedido =>
        pedido.numero === numero
          ? { ...pedido, status: novoStatus }
          : pedido
      )
    );

    registrarHistoricoPedido({
      tipo: "alteracao_status",
      numero,
      statusAnterior: pedidoAtual.status,
      statusNovo: novoStatus
    });

    setAnimar?.(animacao => animacao + 1);
  }

  const pedidosFiltrados = pedidos.filter(pedido => {
    const termo = pesquisa.toLowerCase();

    return (
      pedido.numero.toLowerCase().includes(termo) ||
      pedido.cliente.toLowerCase().includes(termo) ||
      pedido.status.toLowerCase().includes(termo)
    );
  });

  return (
    <section className="p-pedidos">

      <div className="cabecalho-pedidos">
        <div>
          <h1>Pedidos</h1>
          <p>Gerencie os pedidos da Agreste Têxtil.</p>
        </div>

        <button
          type="button"
          className="botao-novo"
          onClick={() => setFormularioAberto(!formularioAberto)}
        >
          {formularioAberto ? "Cancelar" : "+ Novo pedido"}
        </button>
      </div>

      <input
        className="pesquisa-pedidos"
        type="search"
        placeholder="Procurar pedido..."
        value={pesquisa}
        onChange={evento => setPesquisa(evento.target.value)}
      />

      {formularioAberto && (
        <form
          className="formulario-pedido"
          onSubmit={modoEdicao ? salvarEdicao : registrarPedido}
        >
          <h2>{modoEdicao ? "Editar pedido" : "Novo pedido"}</h2>

          <div className="campos-pedido">

            <div className="campo">
              <label htmlFor="numero">Número do pedido</label>
              <input
                id="numero"
                name="numero"
                type="number"
                min="1"
                max="99999"
                placeholder="Ex.: 128"
                value={formulario.numero}
                onChange={atualizarCampo}
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="cliente">Cliente</label>
              <input
                id="cliente"
                name="cliente"
                type="text"
                placeholder="Nome da loja"
                value={formulario.cliente}
                onChange={atualizarCampo}
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="quantidade">Quantidade de peças</label>
              <input
                id="quantidade"
                name="quantidade"
                type="number"
                min="1"
                placeholder="Digite a quantidade"
                value={formulario.quantidade}
                onChange={atualizarCampo}
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="prazo">Prazo</label>
              <input
                id="prazo"
                name="prazo"
                type="date"
                value={formulario.prazo}
                onChange={atualizarCampo}
                required
              />
            </div>

          </div>

          <button type="submit" className="botao-novo">
            {modoEdicao ? "Salvar alterações" : "Registrar pedido"}
          </button>
        </form>
      )}

      <div className="tabela-pedidos">
        <table>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Quantidade</th>
              <th>Prazo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {pedidosFiltrados.length > 0 ? (
              pedidosFiltrados.map(pedido => {
                const statusAtual = statusDisponiveis.find(
                  status => status.valor === pedido.status
                );

                return (
                  <tr
                    key={pedido.numero}
                    onClick={() => setPedidoSelecionado(pedido)}
                    className="linha-pedido"
                  >
                    <td>#{pedido.numero}</td>
                    <td>{pedido.cliente}</td>
                    <td>{pedido.quantidade} peças</td>
                    <td>{dataFormatada(pedido.prazo)}</td>

                    <td>
                      <span className={`status-pedido status-${pedido.status}`}>
                        {statusAtual?.nome ?? pedido.status}
                      </span>
                    </td>

                    <td>
                      <select
                        aria-label={`Alterar status do pedido ${pedido.numero}`}
                        value={pedido.status}
                        onClick={evento => evento.stopPropagation()}
                        onChange={evento =>
                          modificarStatus(pedido.numero, evento.target.value)
                        }
                      >
                        {statusDisponiveis.map(status => (
                          <option key={status.valor} value={status.valor}>
                            {status.nome}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        className="botao-excluir"
                        onClick={evento => {
                          evento.stopPropagation();
                          excluirPedido(pedido.numero);
                          setPedidoSelecionado(null);
                        }}
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>

                      <button
                        type="button"
                        className="botao-editar"
                        title="Editar pedido"
                        onClick={evento => {
                          evento.stopPropagation();
                          editarPedido(pedido);
                        }}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="estado-vazio">
                <td colSpan={6}>Nenhum pedido encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Acompanhamento do pedido selecionado */}
      {pedidoSelecionado && (
        <Acompanhamento
          pedido={pedidos.find(
            pedido => pedido.numero === pedidoSelecionado.numero
          ) || pedidoSelecionado}
        />
      )}

      <section className="painel-pedidos">

        <div className="painel-pedidos-texto">
          <span className="painel-pedidos-etiqueta">
            AGRESTE TÊXTIL
          </span>

          <h2>Cada pedido conta.</h2>

          <p>
            Organize suas demandas, acompanhe os prazos
            e mantenha sua produção em movimento.
          </p>

          <div className="painel-pedidos-detalhe">
            <span className="material-symbols-outlined">
              assignment_turned_in
            </span>

            <span>
              Controle e organização em cada pedido.
            </span>
          </div>
        </div>

        <div className="painel-pedidos-ilustracao">
          <span className="material-symbols-outlined">
            receipt_long
          </span>
          <span className="material-symbols-outlined">
            inventory_2
          </span>
        </div>

      </section>

    </section>
  );
}

export default Pedidos;
