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
        <div className='planoFundo'>

            <div className='loginFundo'>


                <div className='loginEsquerdo'>


                    <div>
                        <img className='logoo' src="/P.I-Agreste-t-xtil/logo.png" alt="logo" />

                        <h2 className='nomet'>Bem vindo a Carcará Tech</h2>
                        <p className='nomep'>Entre na sua conta para continuar.</p>
                    </div>

                    <form onSubmit={fazerLogin}>


                        <div className='formulario'>
                            <label htmlFor="email">Email:</label>

                            <input
                                id='email'
                                placeholder="Digite seu email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className='formulario'>
                            <label htmlFor="senha">Senha:</label>

                            <input
                                id='senha'
                                placeholder="Digite sua senha"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <p>Esqueceu senha ?</p>

                        <button className='formButton' type="submit">
                            Entrar
                        </button>

                    </form>
                </div>

                <div className='LoginDireito'>

                    <img className='logoo2' src="/P.I-Agreste-t-xtil/logo.png" alt="logo" />

                    <div className='blocoCria'>

                        <h3 className='AindaNao'>Ainda não possui uma conta?</h3>

                        <h2 className='criarH2'>Faça parte da Carcará tech</h2>
                        <p className='textConta'>Tenha mais controle e organização na gestão têxtil.</p>



                        <button
                            type="button"
                            onClick={() => navigate("/cadastro")}
                            className='criarConta'>Criar conta

                        </button>
                    </div>





                </div>


            </div>

        </div >
    );
}

export default Login;
