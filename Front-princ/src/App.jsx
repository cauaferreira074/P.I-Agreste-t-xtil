import { useEffect, useState } from "react";
import './App.css';
import Dashboard from "./pages/dashboard";
import Pedidos from "./pages/pedidos";
import Producao from "./pages/producao";
import Logistica from "./pages/logistica";
import Relatorio from "./pages/relatorio";
import Estoque from "./pages/estoque";
import Configuracoes from "./pages/configuracoes";
import Notificacoes from "./pages/notificacoes";



function App() {

  
  const [pagina, setPagina] = useState("Dashboard");

  const [pedidos, setPedidos] = useState(() => {
    const pedidosSalvos = localStorage.getItem("agreste_pedidos");

    return pedidosSalvos
      ? JSON.parse(pedidosSalvos)
      : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "agreste_pedidos",
      JSON.stringify(pedidos)
    );
  }, [pedidos]);


  const [tecidos, setTecidos] = useState(() => {
    const salvos = localStorage.getItem("agreste_estoque");

    return salvos ? JSON.parse(salvos) : [
      {
        id: 1,
        nome: "Jeans",
        cor: "Azul",
        quantidade: 150,
        estoqueMinimo: 30,
        unidade: "metros"
      },
      {
        id: 2,
        nome: "Algodão",
        cor: "Branco",
        quantidade: 80,
        estoqueMinimo: 20,
        unidade: "metros"
      },
      {
        id: 3,
        nome: "Malha",
        cor: "Preta",
        quantidade: 45,
        estoqueMinimo: 20,
        unidade: "metros"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(
      "agreste_react_pedidos",
      JSON.stringify(pedidos)
    );
  }, [pedidos]);

  useEffect(() => {
    window.lucide.createIcons();
  }, []);

  



  return (
    <div className="aplicacao">

      <aside className="menu">

        <img src="/logo.png" alt="Logo" className="logo" />

        <h2>Carcará tech</h2>

        <nav>
          <button onClick={() => setPagina("Dashboard")}>
            <i className="lucide" data-lucide="layout-dashboard"></i>
            Dashboard
          </button>

          <button onClick={() => setPagina("Pedidos")}>
            <i className="lucide" data-lucide="shopping-cart"></i>
            Pedidos
          </button>

          <button onClick={() => setPagina("Producao")}>
            <i className="lucide" data-lucide="package"></i>
            Produção
          </button>

          <button onClick={() => setPagina("Logistica")}>
            <i className="lucide" data-lucide="truck"></i>
            Logística
          </button>

          <button onClick={() => setPagina("Relatorio")}>
            <i className="lucide" data-lucide="bar-chart-3"></i>
            Relatórios
          </button>

          <button onClick={() => setPagina("Estoque")}>
            <i className="lucide" data-lucide="archive"></i>
            Estoque
          </button>
        </nav>

      </aside>

      <main className="conteudo">

        <header className="cabecalho">
          <h3>Com a Carcará Tech sua gestão é organizada!</h3>

          <div className="usuario">
            <div className="perfil">
              <button onClick={() => setPagina("notificacoes")} className="noti">
                <span className="material-symbols-outlined notificacao" style={{ fontSize: "60px", color: "white" }}>
                  notifications
                </span>
              </button>

              <button onClick={() => setPagina("Configuracoes")} className="noti">
                <span className="material-symbols-outlined" style={{ fontSize: "60px", color: "white" }}>
                  settings
                </span>
              </button>
              <img
                src="/perfil.jpeg"
                alt="Foto de perfil"
                className="perfil"
              />
              <div className="usuario-info">
                <h4 style={{ fontSize: "30px" }}>Gabriel</h4>
                <p>Administrador</p>
              </div>
            </div>
          </div>

        </header>

        {pagina === "Dashboard" ? (
          <Dashboard
            pedidos={pedidos}
            tecidos={tecidos}
            setPagina={setPagina}
          />
        ) : pagina === "Pedidos" ? (
          <Pedidos
            pedidos={pedidos}
            setPedidos={setPedidos}
          />
        ) : pagina === "Producao" ? (
          <Producao />
        ) : pagina === "Logistica" ? (
          <Logistica
            pedidos={pedidos}
            setPedidos={setPedidos}
          />
        ) : pagina === "Estoque" ? (
          <Estoque
            tecidos={tecidos}
            setTecidos={setTecidos}
          />
        ) : pagina === "Relatorio" ? (
          <Relatorio pedidos={pedidos} />
        ) : pagina === "Configuracoes" ? (
          <Configuracoes />
        ) : pagina === "notificacoes" ? (
          <Notificacoes />

        ) : (
          <Dashboard
            pedidos={pedidos}
            tecidos={tecidos}
            setPagina={setPagina}
          />
        )}

      </main>
    </div>
  );
}

export default App;