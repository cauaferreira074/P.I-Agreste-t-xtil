
import React, { useState, useEffect } from "react";

function Configuracoes({ sair }) {

    const [config, setConfig] = useState(() => {
        try {
            const salva = localStorage.getItem("agreste_config");

            return salva ? JSON.parse(salva) : {
                notificacoes: true,
                alertasEstoque: true,
                alertasPedidos: true,
                nomeEmpresa: "Agreste Têxtil",
                nomeUsuario: "",
                email: "",
                fotoPerfil: ""
            };
        } catch {
            return {
                notificacoes: true,
                alertasEstoque: true,
                alertasPedidos: true,
                nomeEmpresa: "Agreste Têxtil",
                nomeUsuario: "",
                email: "",
                fotoPerfil: ""
            };
        }
    });

    const [secao, setSecao] = useState("perfil");

    const [senha, setSenha] = useState({
        atual: "",
        nova: "",
        confirmar: ""
    });

    const [mensagem, setMensagem] = useState("");

    const perguntas = [
        {
            pergunta: "Como cadastrar um pedido?",
            resposta: "Acesse a página de Pedidos, selecione a opção de cadastrar e preencha as informações solicitadas."
        },
        {
            pergunta: "Como acompanhar a produção?",
            resposta: "Acesse a página de Produção para visualizar as etapas de fabricação e acompanhar o andamento dos pedidos."
        },
        {
            pergunta: "Como consultar o estoque?",
            resposta: "Entre na seção Estoque para consultar os tecidos disponíveis e as informações dos materiais cadastrados."
        },
        {
            pergunta: "Como acompanhar a logística?",
            resposta: "Na página Logística, você pode acompanhar os pedidos e suas etapas de expedição e entrega."
        },
        {
            pergunta: "Como visualizar os relatórios?",
            resposta: "Acesse Relatórios para consultar informações e indicadores relacionados à operação da empresa."
        },
        {
            pergunta: "Como alterar meus dados?",
            resposta: "Acesse Configurações e entre na seção Meu perfil para atualizar suas informações."
        }
    ];

    function atualizarConfig(campo, valor) {
        setConfig(prev => ({
            ...prev,
            [campo]: valor
        }));
    }

    function salvarConfiguracoes(e) {
        e.preventDefault();

        localStorage.setItem(
            "agreste_config",
            JSON.stringify(config)
        );

        alert("Configurações salvas com sucesso!");
    }

    // ALTERAR FOTO DE PERFIL
    function alterarFoto(e) {
        const arquivo = e.target.files[0];

        if (!arquivo) return;

        if (!arquivo.type.startsWith("image/")) {
            alert("Selecione um arquivo de imagem válido.");
            return;
        }

        if (arquivo.size > 2 * 1024 * 1024) {
            alert("A imagem deve ter no máximo 2 MB.");
            return;
        }

        const leitor = new FileReader();

        leitor.onload = () => {
            atualizarConfig("fotoPerfil", leitor.result);
        };

        leitor.readAsDataURL(arquivo);
    }

    // SALVAR PERFIL
    function salvarPerfil(e) {
        e.preventDefault();

        localStorage.setItem(
            "agreste_config",
            JSON.stringify(config)
        );

        alert("Perfil atualizado com sucesso!");
    }

    // ALTERAR SENHA
    function alterarSenha(e) {
        e.preventDefault();

        if (!senha.atual || !senha.nova || !senha.confirmar) {
            alert("Preencha todos os campos.");
            return;
        }

        if (senha.nova.length < 8) {
            alert("A nova senha deve ter pelo menos 8 caracteres.");
            return;
        }

        if (senha.nova !== senha.confirmar) {
            alert("As senhas não coincidem.");
            return;
        }

        alert(
            "Validação concluída! Para atualizar a senha de acesso, é necessário conectar esta funcionalidade ao sistema de autenticação."
        );

        setSenha({
            atual: "",
            nova: "",
            confirmar: ""
        });
    }

    return (
        <div className="config-container">

            <div className="config-header">
                <div>
                    <h1>Configurações</h1>
                    <p>Gerencie sua conta e as preferências do sistema.</p>
                </div>
            </div>

            {/* NAVEGAÇÃO DAS CONFIGURAÇÕES */}

            <div className="config-menu">

                <button
                    type="button"
                    className={secao === "perfil" ? "ativo" : ""}
                    onClick={() => setSecao("perfil")}
                >
                    <span className="material-symbols-outlined figura">
                        person
                    </span>
                    Meu perfil
                </button>

                <button
                    type="button"
                    className={secao === "seguranca" ? "ativo" : ""}
                    onClick={() => setSecao("seguranca")}
                >
                    <span className="material-symbols-outlined figura">
                        lock
                    </span>
                    Segurança
                </button>

                <button
                    type="button"
                    className={secao === "preferencias" ? "ativo" : ""}
                    onClick={() => setSecao("preferencias")}
                >
                    <span className="material-symbols-outlined figura">
                        notifications
                    </span>
                    Preferências
                </button>

                <button
                    type="button"
                    className={secao === "faq" ? "ativo" : ""}
                    onClick={() => setSecao("faq")}
                >
                    <span className="material-symbols-outlined figura">
                        help
                    </span>
                    FAQ
                </button>

                <button
                    type="button"
                    className={secao === "termos" ? "ativo" : ""}
                    onClick={() => setSecao("termos")}
                >
                    <span className="material-symbols-outlined figura">
                        description
                    </span>
                    Termos de Uso
                </button>

                <button
                    type="button"
                    className={secao === "sistema" ? "ativo" : ""}
                    onClick={() => setSecao("sistema")}
                >
                    <span className="material-symbols-outlined figura">
                        settings
                    </span>
                    Sobre
                </button>

            </div>

            {/* MEU PERFIL */}

            {secao === "perfil" && (

                <section className="config-card">

                    <div className="config-title">
                        <span className="material-symbols-outlined figura">
                            account_circle
                        </span>

                        <div>
                            <h2>Meu perfil</h2>
                            <p>Gerencie suas informações pessoais.</p>
                        </div>
                    </div>

                    <form onSubmit={salvarPerfil}>

                        <div className="perfil-foto">

                            {config.fotoPerfil ? (
                                <img
                                    src={config.fotoPerfil}
                                    alt="Foto de perfil"
                                />
                            ) : (
                                <div className="perfil-avatar">
                                    <span className="material-symbols-outlined figura">
                                        person
                                    </span>
                                </div>
                            )}

                            <div>
                                <h3>Foto de perfil</h3>
                                <p>Escolha uma imagem para sua conta.</p>

                                <label className="botao-foto">
                                    Alterar foto

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={alterarFoto}
                                        hidden
                                    />
                                </label>

                                {config.fotoPerfil && (
                                    <button
                                        type="button"
                                        className="botao-remover-foto"
                                        onClick={() =>
                                            atualizarConfig("fotoPerfil", "")
                                        }
                                    >
                                        Remover foto
                                    </button>
                                )}
                            </div>

                        </div>

                        <div className="config-field">
                            <label>Nome completo</label>

                            <input
                                type="text"
                                placeholder="Digite seu nome"
                                value={config.nomeUsuario}
                                onChange={e =>
                                    atualizarConfig(
                                        "nomeUsuario",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="config-field">
                            <label>E-mail</label>

                            <input
                                type="email"
                                placeholder="Digite seu e-mail"
                                value={config.email}
                                onChange={e =>
                                    atualizarConfig(
                                        "email",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="config-actions">
                            <button type="submit">
                                <span className="material-symbols-outlined figura">
                                    save
                                </span>
                                Salvar perfil
                            </button>
                        </div>

                    </form>

                </section>
            )}

            {/* SEGURANÇA E SENHA */}

            {secao === "seguranca" && (

                <section className="config-card">

                    <div className="config-title">
                        <span className="material-symbols-outlined figura">
                            security
                        </span>

                        <div>
                            <h2>Segurança da conta</h2>
                            <p>Atualize sua senha de acesso.</p>
                        </div>
                    </div>

                    <form onSubmit={alterarSenha}>

                        <div className="config-field">
                            <label>Senha atual</label>

                            <input
                                type="password"
                                value={senha.atual}
                                onChange={e =>
                                    setSenha({
                                        ...senha,
                                        atual: e.target.value
                                    })
                                }
                                placeholder="Digite sua senha atual"
                                required
                            />
                        </div>

                        <div className="config-field">
                            <label>Nova senha</label>

                            <input
                                type="password"
                                value={senha.nova}
                                onChange={e =>
                                    setSenha({
                                        ...senha,
                                        nova: e.target.value
                                    })
                                }
                                placeholder="Digite sua nova senha"
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="config-field">
                            <label>Confirmar nova senha</label>

                            <input
                                type="password"
                                value={senha.confirmar}
                                onChange={e =>
                                    setSenha({
                                        ...senha,
                                        confirmar: e.target.value
                                    })
                                }
                                placeholder="Confirme sua nova senha"
                                required
                            />
                        </div>

                        <div className="config-actions">
                            <button type="submit">
                                <span className="material-symbols-outlined figura">
                                    lock_reset
                                </span>
                                Alterar senha
                            </button>
                        </div>

                    </form>

                </section>
            )}

            {/* PREFERÊNCIAS */}

            {secao === "preferencias" && (

                <form onSubmit={salvarConfiguracoes}>

                    <section className="config-card">

                        <div className="config-title">
                            <span className="material-symbols-outlined figura">
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
                                    atualizarConfig(
                                        "nomeEmpresa",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                    </section>

                    <section className="config-card">

                        <div className="config-title">
                            <span className="material-symbols-outlined figura">
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
                                    atualizarConfig(
                                        "notificacoes",
                                        e.target.checked
                                    )
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
                                    atualizarConfig(
                                        "alertasEstoque",
                                        e.target.checked
                                    )
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
                                    atualizarConfig(
                                        "alertasPedidos",
                                        e.target.checked
                                    )
                                }
                            />
                        </div>

                    </section>

                    <div className="config-actions">
                        <button type="submit">
                            <span className="material-symbols-outlined figura">
                                save
                            </span>
                            Salvar alterações
                        </button>
                    </div>

                </form>
            )}

            {/* FAQ */}

            {secao === "faq" && (

                <section className="config-card">

                    <div className="config-title">
                        <span className="material-symbols-outlined figura">
                            help
                        </span>

                        <div>
                            <h2>Perguntas frequentes</h2>
                            <p>Encontre respostas sobre o Agreste Têxtil.</p>
                        </div>
                    </div>

                    <div className="faq-list">

                        {perguntas.map((item, index) => (
                            <details className="faq-item" key={index}>

                                <summary>
                                    {item.pergunta}

                                    <span className="material-symbols-outlined figura">
                                        expand_more
                                    </span>
                                </summary>

                                <p>{item.resposta}</p>

                            </details>
                        ))}

                    </div>

                </section>
            )}

            {/* TERMOS DE USO */}

            {secao === "termos" && (

                <section className="config-card">

                    <div className="config-title">
                        <span className="material-symbols-outlined figura">
                            gavel
                        </span>

                        <div>
                            <h2>Termos de Uso</h2>
                            <p>Condições para utilização do sistema.</p>
                        </div>
                    </div>

                    <div className="termos-conteudo">

                        <h3>1. Objetivo do sistema</h3>
                        <p>
                            O Agreste Têxtil é um sistema desenvolvido para
                            auxiliar no gerenciamento de atividades
                            empresariais do setor têxtil, incluindo pedidos,
                            produção, estoque, logística e relatórios.
                        </p>

                        <h3>2. Utilização da plataforma</h3>
                        <p>
                            O usuário deve utilizar o sistema de maneira
                            responsável, fornecendo informações corretas e
                            evitando alterações indevidas nos registros.
                        </p>

                        <h3>3. Responsabilidade do usuário</h3>
                        <p>
                            O usuário é responsável pelas informações
                            inseridas e pelas ações realizadas durante a
                            utilização da plataforma.
                        </p>

                        <h3>4. Dados e informações</h3>
                        <p>
                            As informações cadastradas devem ser utilizadas
                            exclusivamente para as atividades relacionadas
                            à gestão da empresa e às finalidades do sistema.
                        </p>

                        <h3>5. Segurança</h3>
                        <p>
                            O acesso ao sistema deve ser realizado de forma
                            responsável. O usuário deve manter suas
                            credenciais protegidas e não compartilhá-las
                            indevidamente.
                        </p>

                        <h3>6. Atualizações</h3>
                        <p>
                            O sistema poderá receber melhorias, correções
                            e atualizações para aperfeiçoar sua utilização.
                        </p>

                        <h3>7. Considerações finais</h3>
                        <p>
                            Ao utilizar a plataforma, o usuário declara
                            estar ciente das orientações apresentadas
                            neste documento.
                        </p>

                        <p className="termos-data">
                            Agreste Têxtil — Versão 1.0.0
                        </p>

                    </div>

                </section>
            )}

            {/* SOBRE O SISTEMA */}

            {secao === "sistema" && (

                <section className="config-card">

                    <div className="config-title">
                        <span className="material-symbols-outlined figura">
                            info
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

                    <div className="config-info">
                        <span>Plataforma</span>
                        <strong>Gerenciamento Têxtil</strong>
                    </div>

                </section>
            )}

            {/* SAIR DA CONTA */}

            <button
                type="button"
                className="botao-sair"
                onClick={sair}
            >
                <span className="material-symbols-outlined figura">
                    logout
                </span>
                Sair da conta
            </button>

        </div>
    );
}

export default Configuracoes;
