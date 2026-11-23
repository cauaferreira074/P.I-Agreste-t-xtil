
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cadastro.css";

function Cadastro() {

    const navigate = useNavigate();

    const [dados, setDados] = useState({
        nome: "",
        empresa: "",
        email: "",
        senha: "",
        confirmarSenha: ""
    });

    const [aceitouTermos, setAceitouTermos] = useState(false);

    function atualizarCampo(campo, valor) {
        setDados(prev => ({
            ...prev,
            [campo]: valor
        }));
    }

    function criarConta(e) {
        e.preventDefault();

        if (dados.senha.length < 8) {
            alert("A senha deve ter pelo menos 8 caracteres.");
            return;
        }

        if (dados.senha !== dados.confirmarSenha) {
            alert("As senhas não coincidem.");
            return;
        }

        if (!aceitouTermos) {
            alert("Aceite os Termos de Uso.");
            return;
        }

        alert("Validação concluída! Conecte o cadastro ao sistema de autenticação para criar a conta.");
    }

    return (

        <div className="cadastro-pagina">

            <div className="cadastro-container">

                {/* LADO ESQUERDO */}

                <div className="cadastro-apresentacao">

                    <img
                        src="/P.I-Agreste-t-xtil/logo.png"
                        alt="Agreste Têxtil"
                        className="cadastro-logo"
                    />

                    <h1>Agreste Têxtil</h1>

                    <p>
                        Gestão inteligente para o setor têxtil.
                    </p>

                    <div className="cadastro-convite">

                        <h2>Já possui uma conta?</h2>

                        <p>
                            Acesse sua conta e continue
                            gerenciando sua empresa.
                        </p>

                        <button
                            type="button"
                            className="cadastro-botao-voltar"
                            onClick={() => navigate("/")}
                        >
                            Fazer login
                        </button>

                    </div>

                </div>

                {/* LADO DIREITO */}

                <div className="cadastro-formulario-area">

                    <div className="cadastro-titulo">

                        <h2>Criar conta</h2>

                        <p>
                            Cadastre-se para acessar o Agreste Têxtil.
                        </p>

                    </div>

                    <form
                        className="cadastro-form"
                        onSubmit={criarConta}
                    >

                        <div className="cadastro-campo">

                            <label>Nome completo</label>

                            <input
                                type="text"
                                placeholder="Digite seu nome completo"
                                value={dados.nome}
                                onChange={e =>
                                    atualizarCampo("nome", e.target.value)
                                }
                                required
                            />

                        </div>

                        <div className="cadastro-campo">

                            <label>Nome da empresa</label>

                            <input
                                type="text"
                                placeholder="Digite o nome da empresa"
                                value={dados.empresa}
                                onChange={e =>
                                    atualizarCampo("empresa", e.target.value)
                                }
                                required
                            />

                        </div>

                        <div className="cadastro-campo">

                            <label>E-mail</label>

                            <input
                                type="email"
                                placeholder="Digite seu e-mail"
                                value={dados.email}
                                onChange={e =>
                                    atualizarCampo("email", e.target.value)
                                }
                                required
                            />

                        </div>

                        <div className="cadastro-campo">

                            <label>Senha</label>

                            <input
                                type="password"
                                placeholder="Crie uma senha"
                                value={dados.senha}
                                onChange={e =>
                                    atualizarCampo("senha", e.target.value)
                                }
                                minLength={8}
                                required
                            />

                        </div>

                        <div className="cadastro-campo">

                            <label>Confirmar senha</label>

                            <input
                                type="password"
                                placeholder="Digite novamente sua senha"
                                value={dados.confirmarSenha}
                                onChange={e =>
                                    atualizarCampo(
                                        "confirmarSenha",
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                        <div className="cadastro-aceite">

                            <input
                                type="checkbox"
                                id="termosCadastro"
                                checked={aceitouTermos}
                                onChange={e =>
                                    setAceitouTermos(e.target.checked)
                                }
                            />

                            <label htmlFor="termosCadastro">
                                Li e aceito os Termos de Uso.
                            </label>

                        </div>

                        <button
                            type="submit"
                            className="cadastro-botao-criar"
                        >
                            Criar minha conta
                        </button>

                    </form>

                </div>

            </div>

        </div>

    );
}

export default Cadastro;
