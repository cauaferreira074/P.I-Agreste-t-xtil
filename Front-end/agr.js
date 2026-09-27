

const botaoNovoPedido = document.getElementById("novoPedido");

const formulario = document.getElementById("formularioPedido");

botaoNovoPedido.addEventListener("click", function () {


    formulario.style.display = "block";

});

const botaoFechar = document.getElementById("fecharFormulario");

botaoFechar.addEventListener("click", function () {

    formulario.style.display = "none";

});



const botaoRegistrar = document.getElementById("registrarPedido");

botaoRegistrar.addEventListener("click", function () {

    let numero = document.getElementById("numeroPedido").value;
    let cliente = document.getElementById("nomeCliente").value;
    let quantidade = document.getElementById("quantidadeProduto").value;
    let prazo = document.getElementById("prazoPedido").value;

    console.log(numero);
    console.log(cliente);
    console.log(quantidade);
    console.log(prazo);


    let tabela = document.getElementById("listaPedidos");
    tabela.insertAdjacentHTML("afterbegin", `

       
        <tr>

            <td>${numero}</td>

            <td>${cliente}</td>

            <td>${quantidade} Peças</td>

            <td>${prazo}</td>

            <td>
                <div class="status-rece">
                    Recebido
                </div>
            </td>

            <td class="status">

                <select>

                    <option>Modificar</option>
                    <option>Recebido</option>
                    <option>Corte</option>
                    <option>Costura</option>
                    <option>Acabamento</option>
                    <option>Conferência</option>
                    <option>Pronto</option>
                    <option>Enviado</option>

                </select>

            </td>

        </tr>

    `);


    if (numero === "") {
        alert("Digite o número do pedido");
        return;
    }

    if (quantidade <= 0) {
        alert("A quantidade deve ser maior que zero.");
        return;
    }

    if (cliente === "") {
        alert("Digite o nome do cliente.");
        return;
    }


});

