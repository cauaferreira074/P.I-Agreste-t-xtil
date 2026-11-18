import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Login() {


    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function fazerLogin(event) {

        navigate("/dashboard");

        event.preventDefault();

        console.log('Email:', email);
        console.log('Tentativa de login');
    }

    return (
        <div className='planoFundo'>

            <div className='loginFundo'>


                <div className='loginDireito'>

                    <img className='logoo' src="logo.png" alt="logo" />

                    <h2 className='nomet'>Bem vindo a Carcará Tech</h2>
                    <p className='nomep'>Entre na sua conta para continuar.</p>
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

                        <button className='formButton' type="submit">
                            Entrar
                        </button>

                    </form>
                </div>
            </div>

        </div >
    );
}

export default Login;
