import { useCallback, useEffect, useState } from "react";
import Pedidos from "./pages/pedidos";
import Producao from "./pages/producao";
import { consultarDashboard, listarPedidos } from "./api";

const dashboardInicial = { totalPedidos: 0, recebidos: 0, prontos: 0, emProducao: 0, atrasados: 0 };

function App() {
  const [pagina, setPagina] = useState("Dashboard");
  const [dashboard, setDashboard] = useState(dashboardInicial);
  const [pedidos, setPedidos] = useState([]);
  const [erroDashboard, setErroDashboard] = useState("");

  const carregarDados = useCallback(async () => {
    try {
      const [resumo, lista] = await Promise.all([consultarDashboard(), listarPedidos()]);
      setDashboard(resumo);
      setPedidos(lista);
      setErroDashboard("");
    } catch (e) {
      setErroDashboard(`${e.message}. Verifique se o backend Java está rodando na porta 8080.`);
    }
  }, []);

  useEffect(() => { carregarDados(); }, [carregarDados, pagina]);

  return (
    <div className="aplicacao">
      <aside className="menu">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h2>Carcará tech</h2>
        <nav>
          <button onClick={() => setPagina("Dashboard")}>Dashboard</button>
          <button onClick={() => setPagina("Pedidos")}>Pedidos</button>
          <button onClick={() => setPagina("Producao")}>Produção</button>
          <button onClick={() => setPagina("Logística")}>Logística</button>
          <button onClick={() => setPagina("Relatórios")}>Relatórios</button>
        </nav>
      </aside>

      <main className="conteudo" id="dashboard">
        <header className="cabecalho">
          <h3>Com a carcará tech sua gestão é organizada!</h3>
          <div className="usuario"><div className="perfil"><img src="/perfil.jpeg" alt="Foto de perfil" className="perfil" /></div></div>
        </header>

        {pagina === "Pedidos" ? (
          <Pedidos aoAlterarPedidos={carregarDados} />
        ) : pagina === "Producao" ? (
          <Producao pedidos={pedidos} />
        ) : pagina === "Dashboard" ? (
          <>
            <header><h2>Dashboard</h2><p>Acompanhe os cards da sua operação</p></header>
            {erroDashboard && <p role="alert" style={{ color: "#b42318" }}>{erroDashboard}</p>}
            <section className="cards">
              <article className="card"><h3>Produtos recebidos</h3><span>{dashboard.recebidos}</span></article>
              <article className="card"><h3>Prontos</h3><span>{dashboard.prontos}</span></article>
              <article className="card"><h3>Em produção</h3><span>{dashboard.emProducao}</span></article>
              <article className="card"><h3>Atrasados</h3><span>{dashboard.atrasados}</span></article>
              <article className="card"><h3>Total de pedidos</h3><span>{dashboard.totalPedidos}</span></article>
            </section>
            <div className="tabela">
              <section className="grafico">Os indicadores acima são atualizados a partir dos pedidos cadastrados.</section>
              <section className="ultimosPedidos">
                <h3>Últimos pedidos</h3>
                {pedidos.slice(0, 5).length === 0 ? <p>Nenhum pedido cadastrado.</p> : pedidos.slice(0, 5).map((p) => (
                  <p key={p.numero}>#{p.numero} — {p.cliente} — {p.quantidade} peças</p>
                ))}
              </section>
            </div>
          </>
        ) : (
          <section><h2>{pagina}</h2><p>Esta seção ainda não está conectada ao backend.</p></section>
        )}
      </main>
    </div>
  );
}

export default App;
