const API_URL = "http://localhost:8080/api";

async function requisicao(endpoint, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${endpoint}`, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      ...(opcoes.headers || {}),
    },
  });

  const texto = await resposta.text();
  let dados = null;
  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = texto;
    }
  }

  if (!resposta.ok) {
    throw new Error(dados?.erro || `Erro HTTP ${resposta.status}`);
  }

  return dados;
}

export function listarPedidos() {
  return requisicao("/pedidos");
}

export function criarPedido(pedido) {
  return requisicao("/pedidos", {
    method: "POST",
    body: JSON.stringify(pedido),
  });
}

export function atualizarStatusPedido(numero, status) {
  return requisicao(`/pedidos/${encodeURIComponent(numero)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function consultarDashboard() {
  return requisicao("/dashboard");
}
