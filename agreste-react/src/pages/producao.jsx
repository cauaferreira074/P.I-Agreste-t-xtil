


function Producao() {



    function renderizarColuna(status, titulo, classe) {
        const pedidosDaColuna = pedidos.filter(
            (pedido) => pedido.status === status
        );

        return (
            <div className={classe}>
                <div className="coluna-cabecalho">
                    <h3>{titulo}</h3>
                    <strong>({pedidosDaColuna.length})</strong>
                </div>

                {pedidosDaColuna.map((pedido) => (
                    <div className="pedido-id" key={pedido.numero}>
                        <strong>#{pedido.numero}</strong>
                        <p>{pedido.cliente}</p>
                        <span>{pedido.quantidade} peças</span>
                    </div>
                ))}
            </div>
        );
    }

    return (

        <section id="painel">
            <div className="conteudo-painel1">


                <div className="coluna-cabecalho1">
                    <span>.</span>
                    <h3>Recebidos</h3>
                    <strong>( 3 )</strong>
                </div>

                <div className="pedido-id">
                    <strong>#00123</strong>
                    <p>LojaF</p>
                    <span>200 peças</span>
                </div>

                <div className="pedido-id">
                    <strong>#00124</strong>
                    <p>LojaG</p>
                    <span>150 peças</span>
                </div>

                <div className="pedido-id">
                    <strong>#00129</strong>
                    <p>LojaE</p>
                    <span>600 peças</span>
                </div>

                <a href="#">ver mais</a>

            </div>


            <div className="conteudo-painel2">


                <div className="coluna-cabecalho2">
                    <span>.</span>
                    <h3>Corte</h3>
                    <strong>( 4 )</strong>
                </div>


                <div className="pedido-id">
                    <strong>#00126</strong>
                    <p>LojaB</p>
                    <span>300 peças</span>
                </div>

                <div className="pedido-id">
                    <strong>#00130</strong>
                    <p>LojaH</p>
                    <span>400 peças</span>
                </div>

                <div className="pedido-id">
                    <strong>#00132</strong>
                    <p>LojaI</p>
                    <span>250 peças</span>
                </div>

                <a href="#">ver mais</a>

            </div>

            <div className="conteudo-painel3">


                <div className="coluna-cabecalho3">
                    <span>.</span>
                    <h3>Costura</h3>
                    <strong>( 3 )</strong>
                </div>



                <div className="pedido-id">
                    <strong>#00125</strong>
                    <p>LojaA</p>
                    <span>250 peças</span>
                </div>

                <div className="pedido-id">
                    <strong>#00128</strong>
                    <p>LojaD</p>
                    <span>400 peças</span>
                </div>

                <a href="#">ver mais</a>

            </div>

            <div className="conteudo-painel4">


                <div className="coluna-cabecalho4">
                    <span>.</span>
                    <h3>Acabamento</h3>
                    <strong>( 2 )</strong>
                </div>


                <div className="pedido-id">
                    <strong>#00127</strong>
                    <p>LojaT</p>
                    <span>200 peças</span>
                </div>

                <div className="pedido-id">
                    <strong>#00131</strong>
                    <p>LojaN</p>
                    <span> 100 peças</span>
                </div>

                <a href="#">ver mais</a>

            </div>

        </section>


    );





}

export default Producao;