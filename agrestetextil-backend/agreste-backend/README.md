# Backend Java puro — Agreste Têxtil

API HTTP criada com `com.sun.net.httpserver.HttpServer` do JDK, sem Spring Boot e sem framework de backend. Gson é usado apenas para converter objetos Java para JSON e vice-versa.

## O que foi identificado no frontend
- A versão React contém a tela de pedidos com número, cliente, quantidade, prazo e status; atualmente usa `localStorage` e dados simulados.
- A tela de produção representa o fluxo Recebido → Corte → Costura → Acabamento → Conferência → Pronto → Enviado.
- O dashboard precisa de contagens de recebidos, prontos, em produção e atrasados.
- Estoque, logística e relatórios ainda não têm um modelo de dados completo definido, então não inventei regras para eles nesta primeira versão.

## Endpoints
- `GET /api/health` — estado da API.
- `GET /api/pedidos` — lista todos os pedidos.
- `POST /api/pedidos` — cria pedido; recebe `numero`, `cliente`, `quantidade`, `prazo` (`AAAA-MM-DD`). O status inicial é `recebido`.
- `PATCH /api/pedidos/{numero}/status` — atualiza status. Corpo: `{"status":"corte"}`.
- `GET /api/dashboard` — retorna `totalPedidos`, `recebidos`, `prontos`, `emProducao` e `atrasados`.

Status aceitos: `recebido`, `corte`, `costura`, `acabamento`, `conferencia`, `pronto`, `enviado`.

## Requisitos e execução
- JDK 17+ e Maven 3.8+.
- A primeira execução do Maven precisa baixar Gson da internet.
- Dentro desta pasta, execute:

```bash
mvn clean package
mvn exec:java -Dexec.mainClass="br.com.agrestetextil.Servidor"
```

A API fica em `http://localhost:8080`. Os dados são persistidos em `dados/pedidos.json`, criado automaticamente. Essa persistência em arquivo simplifica a execução acadêmica; não é indicada para múltiplos servidores ou uso de produção.

## Testes com curl
```bash
curl http://localhost:8080/api/health
curl http://localhost:8080/api/pedidos
curl -X POST http://localhost:8080/api/pedidos -H "Content-Type: application/json" -d '{"numero":"128","cliente":"Loja Exemplo","quantidade":250,"prazo":"2026-12-15"}'
curl -X PATCH http://localhost:8080/api/pedidos/00128/status -H "Content-Type: application/json" -d '{"status":"corte"}'
curl http://localhost:8080/api/dashboard
```

## Conectar o frontend React
A página `agreste-react/src/pages/pedidos.jsx` ainda usa `localStorage`. Para integrá-la, substitua o carregamento inicial por uma chamada `fetch('http://localhost:8080/api/pedidos')`, e use:

```js
// Criar pedido
await fetch('http://localhost:8080/api/pedidos', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ numero, cliente, quantidade: Number(quantidade), prazo })
});

// Alterar status
await fetch(`http://localhost:8080/api/pedidos/${numero}/status`, {
  method: 'PATCH', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: novoStatus })
});
```

Execute o frontend em outro terminal com `npm install` e `npm run dev` dentro de `agreste-react/`. CORS está habilitado para desenvolvimento local. Ainda é necessário fazer a alteração de integração no React: o backend foi criado, mas a interface original não foi sobrescrita automaticamente.

## Limitações
- Não há login/autenticação.
- A API ainda não implementa CRUD de estoque, rotas/logística ou relatórios detalhados porque as regras dessas áreas não estão especificadas no frontend fornecido.
- Não exponha esse servidor publicamente sem autenticação, validações e configuração de segurança adicionais.
