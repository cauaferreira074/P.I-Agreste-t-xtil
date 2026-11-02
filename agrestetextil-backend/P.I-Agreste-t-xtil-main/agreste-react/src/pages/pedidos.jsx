import { useEffect, useState } from "react";
import { atualizarStatusPedido, criarPedido, listarPedidos } from "../api";

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

function Pedidos({ aoAlterarPedidos }) {
  const [pedidos, setPedidos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [formulario, setFormulario] = useState({ numero: "", cliente: "", quantidade: "", prazo: "" });

  async function carregarPedidos() {
    setCarregando(true);
    try {
      const dados = await listarPedidos();
      setPedidos(dados);
      setErro("");
    } catch (e) {
      setErro(`${e.message}. Confira se o backend Java está rodando em http://localhost:8080.`);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregarPedidos(); }, []);

  function atualizarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  async function registrarPedido(evento) {
    evento.preventDefault();
    setSalvando(true);
    setErro("");
    try {
      const novoPedido = await criarPedido({
        numero: formulario.numero.trim(),
        cliente: formulario.cliente.trim(),
        quantidade: Number(formulario.quantidade),
        prazo: formulario.prazo,
      });
      setPedidos((atuais) => [novoPedido, ...atuais.filter((p) => p.numero !== novoPedido.numero)]);
      setFormulario({ numero: "", cliente: "", quantidade: "", prazo: "" });
      setFormularioAberto(false);
      aoAlterarPedidos?.();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  async function modificarStatus(numero, novoStatus) {
    setErro("");
    const anteriores = pedidos;
    setPedidos((atuais) => atuais.map((p) => p.numero === numero ? { ...p, status: novoStatus } : p));
    try {
      const atualizado = await atualizarStatusPedido(numero, novoStatus);
      setPedidos((atuais) => atuais.map((p) => p.numero === numero ? atualizado : p));
      aoAlterarPedidos?.();
    } catch (e) {
      setPedidos(anteriores);
      setErro(e.message);
    }
  }

  const termo = pesquisa.toLowerCase();
  const pedidosFiltrados = pedidos.filter((pedido) =>
    pedido.numero.toLowerCase().includes(termo) ||
    pedido.cliente.toLowerCase().includes(termo) ||
    pedido.status.toLowerCase().includes(termo)
  );

  return (
    <section className="p-pedidos">
      <div className="cabecalho-pedidos">
        <div>
          <h1>Pedidos</h1>
          <p>Gerencie os pedidos da Agreste Têxtil.</p>
        </div>
        <button type="button" className="botao-novo" onClick={() => setFormularioAberto(!formularioAberto)}>
          {formularioAberto ? "Cancelar" : "+ Novo pedido"}
        </button>
      </div>

      {erro && <p role="alert" style={{ color: "#b42318", margin: "12px 0" }}>{erro}</p>}

      <input className="pesquisa-pedidos" type="search" placeholder="Procurar pedido..." value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} />

      {formularioAberto && (
        <form className="formulario-pedido" onSubmit={registrarPedido}>
          <h2>Novo pedido</h2>
          <div className="campos-pedido">
            <div className="campo">
              <label htmlFor="numero">Número do pedido</label>
              <input id="numero" name="numero" type="number" min="1" max="99999" placeholder="Ex.: 128" value={formulario.numero} onChange={atualizarCampo} required />
            </div>
            <div className="campo">
              <label htmlFor="cliente">Cliente</label>
              <input id="cliente" name="cliente" type="text" placeholder="Nome da loja" value={formulario.cliente} onChange={atualizarCampo} required />
            </div>
            <div className="campo">
              <label htmlFor="quantidade">Quantidade de peças</label>
              <input id="quantidade" name="quantidade" type="number" min="1" placeholder="Digite a quantidade" value={formulario.quantidade} onChange={atualizarCampo} required />
            </div>
            <div className="campo">
              <label htmlFor="prazo">Prazo</label>
              <input id="prazo" name="prazo" type="date" value={formulario.prazo} onChange={atualizarCampo} required />
            </div>
          </div>
          <button type="submit" className="botao-novo" disabled={salvando}>
            {salvando ? "Salvando..." : "Registrar pedido"}
          </button>
        </form>
      )}

      <div className="tabela-pedidos">
        <table>
          <thead><tr><th>Pedido</th><th>Cliente</th><th>Quantidade</th><th>Prazo</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {carregando ? (
              <tr><td colSpan="6">Carregando pedidos...</td></tr>
            ) : pedidosFiltrados.map((pedido) => {
              const statusAtual = statusDisponiveis.find((s) => s.valor === pedido.status);
              return (
                <tr key={pedido.numero}>
                  <td>#{pedido.numero}</td><td>{pedido.cliente}</td><td>{pedido.quantidade} peças</td><td>{dataFormatada(pedido.prazo)}</td>
                  <td><span className={`status-pedido status-${pedido.status}`}>{statusAtual?.nome ?? pedido.status}</span></td>
                  <td><select aria-label={`Alterar status do pedido ${pedido.numero}`} value={pedido.status} onChange={(e) => modificarStatus(pedido.numero, e.target.value)}>
                    {statusDisponiveis.map((status) => <option key={status.valor} value={status.valor}>{status.nome}</option>)}
                  </select></td>
                </tr>
              );
            })}
            {!carregando && pedidosFiltrados.length === 0 && <tr><td colSpan="6">Nenhum pedido encontrado.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Pedidos;
