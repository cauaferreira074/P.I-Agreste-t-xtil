import { useEffect, useState } from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "./pages/pages/cadastro";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Pedidos from "./pages/pedidos";
import Producao from "./pages/producao";
import Logistica from "./pages/logistica";
import Relatorio from "./pages/relatorio";
import Estoque from "./pages/estoque";
import Configuracoes from "./pages/configuracoes";
import Notificacoes from "./pages/notificacoes";


function Sistema() {


  const [autenticado, setAutenticado] = useState(false);




  function sair() {
    setAutenticado(false);
    setPagina("Dashboard");
  }

  function verificarLogin(email, senha) {
    const usuariosSalvos = JSON.parse(
      localStorage.getItem("agreste_usuarios") || "[]"
    );

    const usuarioEncontrado = usuariosSalvos.find(
      usuario =>
        usuario.email === email.trim().toLowerCase() &&
        usuario.senha === senha
    );

    if (usuarioEncontrado) {
      setAutenticado(true);
    } else {
      alert("E-mail ou senha incorretos!");
    }

    if (!autenticado) {
      return <Login onLogin={verificarLogin} />;
    }
  }




  const [pagina, setPagina] = useState("Dashboard");

  const [pedidos, setPedidos] = useState(() => {

    const pedidosSalvos = localStorage.getItem("agreste_pedidos");

    return pedidosSalvos
      ? JSON.parse(pedidosSalvos)
      : [];
  });

  const excluirPedido = (numero) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este pedido?"
    );

    if (!confirmar) return;

    const pedidoExcluido = pedidos.find(
      pedido => String(pedido.numero) === String(numero)
    );

    if (pedidoExcluido) {
      registrarHistoricoPedido({
        tipo: "exclusao",
        numero: pedidoExcluido.numero,
        pedido: pedidoExcluido
      });
    }

    const pedidosAtualizados = pedidos.filter(
      (pedido) => String(pedido.numero) !== String(numero)
    );

    console.log("Número recebido:", numero);
    console.log("Pedidos antes:", pedidos);
    console.log("Pedidos depois:", pedidosAtualizados);

    setPedidos(pedidosAtualizados);

    localStorage.setItem(
      "agreste_pedidos",
      JSON.stringify(pedidosAtualizados)
    );
  };

  useEffect(() => {
    localStorage.setItem(
      "agreste_pedidos",
      JSON.stringify(pedidos)
    );
  }, [pedidos]);

  const [historicoPedidos, setHistoricoPedidos] = useState(() => {
    const salvos = localStorage.getItem("agreste_historico_pedidos");
    return salvos ? JSON.parse(salvos) : [];
  });

  const [historicoEstoque, setHistoricoEstoque] = useState(() => {
    const salvos = localStorage.getItem("agreste_historico_estoque");
    return salvos ? JSON.parse(salvos) : [];
  });


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



  // Salvar histórico de pedidos
  useEffect(() => {
    localStorage.setItem(
      "agreste_historico_pedidos",
      JSON.stringify(historicoPedidos)
    );
  }, [historicoPedidos]);

  // Salvar histórico de estoque
  useEffect(() => {
    localStorage.setItem(
      "agreste_historico_estoque",
      JSON.stringify(historicoEstoque)
    );
  }, [historicoEstoque]);

  // Atualizar ícones
  useEffect(() => {
    const atualizarIcones = () => {
      if (window.lucide) {
        window.lucide.createIcons();
      }
    };

    atualizarIcones();

    const temporizador = setTimeout(atualizarIcones, 100);

    return () => clearTimeout(temporizador);
  }, [pagina]);

  const [notificacoes, setNotificacoes] = useState(() => {
    const salvas = localStorage.getItem("agreste_notificacoes");
    return salvas ? JSON.parse(salvas) : [];
  });


  if (!autenticado) {
    return <Login onLogin={verificarLogin} />;
  }

  function registrarHistoricoPedido(dados) {
    const registro = {
      id: Date.now(),
      data: new Date().toISOString(),
      ...dados
    };

    setHistoricoPedidos(atuais => [
      registro,
      ...atuais
    ]);
  }

  function registrarHistoricoEstoque(dados) {
    const registro = {
      id: Date.now(),
      data: new Date().toISOString(),
      ...dados
    };

    setHistoricoEstoque(atuais => [
      registro,
      ...atuais
    ]);
  }


  return (


    <div className="aplicacao">

      <aside className="menu">

        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" className="logo" />

        <h2>Carcará tech</h2>

        <nav>
          <button className={pagina === "Dashboard" ? "ativo" : ""} onClick={() => setPagina("Dashboard")}>
            <i className="lucide" data-lucide="layout-dashboard"></i>
            Dashboard
          </button>

          <button className={pagina === "Pedidos" ? "ativo" : ""} onClick={() => setPagina("Pedidos")}>
            <i className="lucide" data-lucide="shopping-cart"></i>
            Pedidos
          </button>

          <button className={pagina === "Producao" ? "ativo" : ""} onClick={() => setPagina("Producao")}>
            <i className="lucide" data-lucide="package"></i>
            Produção
          </button>

          <button className={pagina === "Logistica" ? "ativo" : ""} onClick={() => setPagina("Logistica")}>
            <i className="lucide" data-lucide="truck"></i>
            Logística
          </button>

          <button className={pagina === "Estoque" ? "ativo" : ""} onClick={() => setPagina("Estoque")}>
            <i className="lucide" data-lucide="archive"></i>
            Estoque
          </button>

          <button className={pagina === "Relatorio" ? "ativo" : ""} onClick={() => setPagina("Relatorio")}>
            <i className="lucide" data-lucide="bar-chart-3"></i>
            Relatórios
          </button>
        </nav>

      </aside>

      <main className="conteudo">


        <header className="cabecalho">

          <h3>Com a Carcará Tech sua gestão é organizada!</h3>

          <div className="barra-acoes">

            {/* NOTIFICAÇÕES */}
            <button
              onClick={() => setPagina("notificacoes")}
              className="noti"
            >
              <span className="material-symbols-outlined2 notificacao">
                notifications
              </span>

              {notificacoes.some((n) => !n.lida) && (
                <span className="indicador-vermelho"></span>
              )}
            </button>

            {/* CONFIGURAÇÕES */}
            <button
              onClick={() => setPagina("Configuracoes")}
              className="noti1"
            >
              <span className="material-symbols-outlined1">
                settings
              </span>
            </button>

            {/* USUÁRIO */}
            <div className="usuario">



            </div>

          </div>

        </header>



        {pagina === "Dashboard" ? (
          <Dashboard
            pedidos={pedidos}
            tecidos={tecidos}
            setPagina={setPagina}
            historicoPedidos={historicoPedidos}
            historicoEstoque={historicoEstoque}
          />
        ) : pagina === "Pedidos" ? (
          <Pedidos
            pedidos={pedidos}
            setPedidos={setPedidos}
            excluirPedido={excluirPedido}
            registrarHistoricoPedido={registrarHistoricoPedido}
          />
        ) : pagina === "Producao" ? (
          <Producao pedidos={pedidos} />
        ) : pagina === "Logistica" ? (
          <Logistica
            pedidos={pedidos}
            setPedidos={setPedidos}
            registrarHistoricoPedido={registrarHistoricoPedido}
          />
        ) : pagina === "Estoque" ? (
          <Estoque
            tecidos={tecidos}
            setTecidos={setTecidos}
            registrarHistoricoEstoque={registrarHistoricoEstoque}
          />
        ) : pagina === "Relatorio" ? (
          <Relatorio
            pedidos={pedidos}
            tecidos={tecidos}
          />
        ) : pagina === "Configuracoes" ? (
          <Configuracoes sair={sair} />
        ) : pagina === "notificacoes" ? (
          <Notificacoes
            pedidos={pedidos}
            tecidos={tecidos}
            notificacoes={notificacoes}
            setNotificacoes={setNotificacoes}
          />

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

function App() {
  return (
    <BrowserRouter basename="/P.I-Agreste-t-xtil">
      <Routes>
        <Route path="/" element={<Sistema />} />

        <Route
          path="/cadastro"
          element={<Cadastro />}
        />

        <Route
          path="/dashboard/*"
          element={<Sistema />}
        />
      </Routes>
    </BrowserRouter>
  );
}


export default App