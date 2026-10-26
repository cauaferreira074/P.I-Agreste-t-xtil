import { useState } from "react";
import Pedidos from "./pages/pedidos";
import Producao from "./pages/producao";



function App() {
  const [pagina, setPagina] = useState("Dashboard");

  const [pedidos, setPedidos] = useState([
    { id: 1, produto: "Camisa polo", status: "Recebido", atrasado: false },
    { id: 2, produto: "Calça jeans", status: "Pronto", atrasado: false },
    { id: 3, produto: "Camiseta", status: "Costura", atrasado: true },
    { id: 4, produto: "Jaqueta", status: "Corte", atrasado: false },
  ]);

  // Calcula os números dos cards
  const recebidos = pedidos.filter(
    (pedido) => pedido.status === "Recebido"
  ).length;

  const prontos = pedidos.filter(
    (pedido) => pedido.status === "Pronto"
  ).length;

  const emProducao = pedidos.filter(
    (pedido) =>
      ["Corte", "Costura", "Acabamento", "Conferência"]
        .includes(pedido.status)
  ).length;

  const atrasados = pedidos.filter(
    (pedido) => pedido.atrasado
  ).length;

  // Atualiza o status de um pedido
  function atualizarStatus(id, novoStatus) {
    setPedidos((listaAtual) =>
      listaAtual.map((pedido) =>
        pedido.id === id
          ? { ...pedido, status: novoStatus }
          : pedido
      )
    );
  }

  return (
    <div className="aplicacao">
      <anside className="menu">
        <h2>Agreste Têxtil</h2>

        <nav>
          <button onClick={() => setPagina("Dashboard")}>
            Dashboard
          </button>

          <button onClick={() => setPagina("Pedidos")}>
            Pedidos
          </button>

          <button onClick={() => setPagina("Producao")}>
            Produção
          </button>

          <button onClick={() => setPagina("Logística")}>
            Logística
          </button>

          <button onClick={() => setPagina("Relatórios")}>
            Relatórios
          </button>
        </nav>
      </anside>

      <main className="conteudo" id="dashboard">
        {pagina === "Pedidos" ? (
          <Pedidos />
        ) : pagina === "Producao" ? (
          <Producao />
        ) : (
          <>
            <header>
              <h2>Dashboard</h2>
              <p>Acompanhe os cards da sua operação</p>
            </header>

            <section className="cards">
              <article className="card">
                <h3>Produtos recebidos</h3>
                <span>{recebidos}</span>
              </article>

              <article className="card">
                <h3>Prontos</h3>
                <span>{prontos}</span>
              </article>

              <article className="card">
                <h3>Em produção</h3>
                <span>{emProducao}</span>
              </article>

              <article className="card">
                <h3>Atrasados</h3>
                <span>{atrasados}</span>
              </article>

              <article className="card">
                <h3>Estoque</h3>
                <span>0</span>
              </article>



            </section>

            <div className="tabela">

              <section className="grafico">grafico</section>

              <section className="ultimosPedidos">pedido</section>

            </div>
          </>
        )}

















      </main>














    </div>
  );



}

export default App;