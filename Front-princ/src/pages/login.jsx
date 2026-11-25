
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function fazerLogin(event) {
        event.preventDefault();

        const emailFormatado = email.trim().toLowerCase();

        if (!emailFormatado || !password) {
            alert("Preencha seu e-mail e sua senha.");
            return;
        }

        onLogin(emailFormatado, password);
    }

    return (
        <main className="planoFundo">

            <div className="loginFundo">

                {/* LADO ESQUERDO */}

                <section className="loginEsquerdo">

                    <img
                        className="logoo"
                        src="/P.I-Agreste-t-xtil/logo.png"
                        alt="Logo Carcará Tech"
                    />

                    <div className="loginApresentacao">
                        <h1>Sua produção, conectada.</h1>

                        <p>
                            Mais controle, organização e eficiência
                            para a gestão têxtil.
                        </p>
                    </div>

                </section>

                {/* LADO DIREITO */}

                <section className="loginDireito">

                    <div className="loginConteudo">

                        <h2>Bem-vindo ao Carcará Tech</h2>

                        <h3>Entre na sua conta para continuar.</h3>

                        <form onSubmit={fazerLogin}>

                            <div className="formulario">
                                <label htmlFor="email">Email</label>

                                <input
                                    id="email"
                                    placeholder="Digite seu email"
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="formulario">
                                <label htmlFor="senha">Senha</label>

                                <input
                                    id="senha"
                                    placeholder="Digite sua senha"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="loginRecuperar">
                                <button type="button">
                                    Esqueceu senha?
                                </button>
                            </div>

                            <button
                                className="formButton"
                                type="submit"
                            >
                                Entrar
                            </button>

                            <p className="criar-conta">
                                Não tem uma conta?

                                <button
                                    type="button"
                                    onClick={() => navigate("/cadastro")}
                                >
                                    Criar conta
                                </button>
                            </p>

                        </form>

                    </div>

                </section>

            </div>

        </main>
    );
}

export default Login;
