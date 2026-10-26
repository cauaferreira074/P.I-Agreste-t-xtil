
import { useEffect, useState } from "react";

const statusDisponiveis = [
  { valor: "recebido", nome: "Recebido" },
  { valor: "corte", nome: "Corte" },
  { valor: "costura", nome: "Costura" },
  { valor: "acabamento", nome: "Acabamento" },
  { valor: "conferencia", nome: "Conferência" },
  { valor: "pronto", nome: "Pronto" },
  { valor: "enviado", nome: "Enviado" },
];

const pedidosIniciais = [
  { numero: "00121", cliente: "Loja A", quantidade: 500, prazo: "2026-09-20", status: "recebido" },
  { numero: "00122", cliente: "Loja B", quantidade: 300, prazo: "2026-09-30", status: "corte" },
  { numero: "00123", cliente: "Loja C", quantidade: 200, prazo: "2026-12-10", status: "pronto" },
  { numero: "00124", cliente: "Loja D", quantidade: 700, prazo: "2026-09-18", status: "costura" },
  { numero: "00125", cliente: "Loja E", quantidade: 450, prazo: "2026-09-10", status: "recebido" },
  { numero: "00126", cliente: "Loja F", quantidade: 490, prazo: "2026-09-15", status: "recebido" },
  { numero: "00127", cliente: "Loja G", quantidade: 690, prazo: "2026-09-25", status: "costura" },
];

function dataFormatada(data) {
  if (!data) return "—";

  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function Pedidos() {
  const [pedidos, setPedidos] = useState(() => {
    try {
      const salvos = localStorage.getItem("agreste_react_pedidos");
      return salvos ? JSON.parse(salvos) : pedidosIniciais;
    } catch {
      return pedidosIniciais;
    }
  });

  const [pesquisa, setPesquisa] = useState("");
  const [formularioAberto, setFormularioAberto] = useState(false);

  const [formulario, setFormulario] = useState({
    numero: "",
    cliente: "",
    quantidade: "",
    prazo: "",
  });

  useEffect(() => {
    localStorage.setItem("agreste_react_pedidos", JSON.stringify(pedidos));
  }, [pedidos]);

  function atualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((atual) => ({
      ...atual,
      [name]: value,
    }));
  }

  function registrarPedido(evento) {
    evento.preventDefault();

    const numero = formulario.numero.trim().padStart(5, "0");

    if (
      pedidos.some((pedido) => pedido.numero === numero)
    ) {
      alert("Já existe um pedido com esse número.");
      return;
    }

    const novoPedido = {
      ...formulario,
      numero,
      quantidade: Number(formulario.quantidade),
      status: "recebido",
    };

    setPedidos((atuais) => [novoPedido, ...atuais]);

    setFormulario({
      numero: "",
      cliente: "",
      quantidade: "",
      prazo: "",
    });

    setFormularioAberto(false);
  }

  function modificarStatus(numero, novoStatus) {
    setPedidos((atuais) =>
      atuais.map((pedido) =>
        pedido.numero === numero
          ? { ...pedido, status: novoStatus }
          : pedido
      )
    );
  }

  const pedidosFiltrados = pedidos.filter((pedido) => {
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
        onChange={(evento) => setPesquisa(evento.target.value)}
      />

      {formularioAberto && (
        <form className="formulario-pedido" onSubmit={registrarPedido}>
          <h2>Novo pedido</h2>

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
            Registrar pedido
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
            {pedidosFiltrados.map((pedido) => {
              const statusAtual = statusDisponiveis.find(
                (status) => status.valor === pedido.status
              );

              return (
                <tr key={pedido.numero}>
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
                      onChange={(evento) =>
                        modificarStatus(pedido.numero, evento.target.value)
                      }
                    >
                      {statusDisponiveis.map((status) => (
                        <option key={status.valor} value={status.valor}>
                          {status.nome}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}

            {pedidosFiltrados.length === 0 && (
              <tr>
                <td colSpan="6">Nenhum pedido encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Pedidos;

