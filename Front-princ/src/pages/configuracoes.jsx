import React, { useState, useEffect } from "react";


function Configuracoes() {

    const [config, setConfig] = useState(() => {
        const salva = localStorage.getItem("agreste_config");
        return salva ? JSON.parse(salva) : {
            notificacoes: true,
            alertasEstoque: true,
            alertasPedidos: true,
            nomeEmpresa: "Agreste Têxtil"
        };
    });

    function atualizarConfig(campo, valor) {
        setConfig(prev => ({
            ...prev,
            [campo]: valor
        }));
    }

    function salvarConfiguracoes(e) {
        e.preventDefault();
        localStorage.setItem("agreste_config", JSON.stringify(config));
        alert("Configurações salvas com sucesso!");
    }

    return (
        <div className="config-container">

            <div className="config-header">
                <div>
                    <h1>Configurações</h1>
                    <p>Gerencie as preferências do sistema.</p>
                </div>
            </div>

            <form onSubmit={salvarConfiguracoes}>

                {/* INFORMAÇÕES DA EMPRESA */}
                <section className="config-card">

                    <div className="config-title">
                        <span className="material-symbols-outlined">
                            business
                        </span>

                        <div>
                            <h2>Informações da empresa</h2>
                            <p>Dados gerais do sistema.</p>
                        </div>
                    </div>

                    <div className="config-field">
                        <label>Nome da empresa</label>

                        <input
                            type="text"
                            value={config.nomeEmpresa}
                            onChange={e =>
                                atualizarConfig("nomeEmpresa", e.target.value)
                            }
                        />
                    </div>

                </section>


                {/* NOTIFICAÇÕES */}
                <section className="config-card">

                    <div className="config-title">
                        <span className="material-symbols-outlined">
                            notifications
                        </span>

                        <div>
                            <h2>Notificações</h2>
                            <p>Controle os avisos do sistema.</p>
                        </div>
                    </div>

                    <div className="config-option">
                        <div>
                            <h3>Notificações gerais</h3>
                            <p>Ativar notificações do sistema.</p>
                        </div>

                        <input
                            type="checkbox"
                            checked={config.notificacoes}
                            onChange={e =>
                                atualizarConfig("notificacoes", e.target.checked)
                            }
                        />
                    </div>

                    <div className="config-option">
                        <div>
                            <h3>Alertas de estoque</h3>
                            <p>Receber avisos sobre o estoque.</p>
                        </div>

                        <input
                            type="checkbox"
                            checked={config.alertasEstoque}
                            onChange={e =>
                                atualizarConfig("alertasEstoque", e.target.checked)
                            }
                        />
                    </div>

                    <div className="config-option">
                        <div>
                            <h3>Atualizações de pedidos</h3>
                            <p>Receber avisos sobre pedidos.</p>
                        </div>

                        <input
                            type="checkbox"
                            checked={config.alertasPedidos}
                            onChange={e =>
                                atualizarConfig("alertasPedidos", e.target.checked)
                            }
                        />
                    </div>

                </section>


                {/* SISTEMA */}
                <section className="config-card">

                    <div className="config-title">
                        <span className="material-symbols-outlined">
                            settings
                        </span>

                        <div>
                            <h2>Sobre o sistema</h2>
                            <p>Informações da aplicação.</p>
                        </div>
                    </div>

                    <div className="config-info">
                        <span>Nome do sistema</span>
                        <strong>Agreste Têxtil</strong>
                    </div>

                    <div className="config-info">
                        <span>Versão</span>
                        <strong>1.0.0</strong>
                    </div>

                </section>


                <div className="config-actions">
                    <button type="submit">
                        <span className="material-symbols-outlined">
                            save
                        </span>
                        Salvar alterações
                    </button>
                </div>

            </form>

        </div>
    );
}

export default Configuracoes;