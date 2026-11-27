# Agreste Têxtil — Backend API (Java 25 + Spring Boot)

API REST desenvolvida em **Java 25** com **Spring Boot 3.5** para gerenciamento de pedidos e acompanhamento de produção da **Agreste Têxtil**, integrada ao front-end em **React (Vite)**.

---

## Arquitetura do Projeto

O sistema segue o padrão **MVC (Model-View-Controller)** organizado em camadas desacopladas:

* **`controller/`**: Expõe os endpoints REST (`/api/pedidos`, `/api/dashboard`, `/api/health`) e trata as requisições HTTP.
* **`service/`**: Contém as regras de negócio, formatação de códigos (`00001`), validação de datas e cálculo de indicadores.
* **`repository/`**: Gerencia a leitura e gravação atômica dos dados em `dados/pedidos.json` com controle de concorrência (`ReentrantLock`).
* **`model/` & `dto/`**: Define a entidade `Pedido` e os objetos de transferência de dados (`DashboardResponse`, `StatusUpdateRequest`).
* **`exception/`**: Centraliza o tratamento de erros HTTP (`400`, `404`, `409`, `500`) retornando respostas padronizadas em JSON.
* **`config/`**: Configura o CORS para comunicação com o front-end React.

---

## Endpoints Disponíveis

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Verifica se a API está online (`{"status": "ok"}`). |
| `GET` | `/api/pedidos` | Lista todos os pedidos cadastrados. |
| `POST` | `/api/pedidos` | Cria um novo pedido com status inicial `recebido`. |
| `PATCH` | `/api/pedidos/{numero}/status` | Atualiza a etapa de produção de um pedido. |
| `GET` | `/api/dashboard` | Retorna os totais: `totalPedidos`, `recebidos`, `prontos`, `emProducao` e `atrasados`. |

### Fluxo de Status Aceitos
`recebido` → `corte` → `costura` → `acabamento` → `conferencia` → `pronto` → `enviado`

---

## Requisitos e Como Executar

* **JDK 25** instalado
* **Maven 3.8+** (ou integração Maven do IntelliJ IDEA)

### Pelo IntelliJ IDEA
1. Abra a pasta `agrestebackend` no IntelliJ.
2. Certifique-se de que o **SDK** do projeto está configurado para **Java 25** (*File > Project Structure*).
3. Aguarde o Maven baixar as dependências do Spring Boot.
4. Execute a classe **`br.com.agrestetextil.AgresteTextilApplication`**.

### Pelo Terminal
```bash
cd agrestebackend
mvn spring-boot:run
```

A API ficará disponível em **`http://localhost:8080`**. Os dados são persistidos automaticamente no arquivo `dados/pedidos.json`.

---

## Exemplos de Uso (`curl`)

```bash
# Verificar status da API
curl http://localhost:8080/api/health

# Cadastrar um novo pedido
curl -X POST http://localhost:8080/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{"numero":"128","cliente":"Confecções Agreste","quantidade":250,"prazo":"2026-12-15"}'

# Atualizar status de um pedido
curl -X PATCH http://localhost:8080/api/pedidos/00128/status \
  -H "Content-Type: application/json" \
  -d '{"status":"corte"}'

# Consultar indicadores do dashboard
curl http://localhost:8080/api/dashboard
```

---

## Integração com o Front-end (React)

1. Mantenha o back-end rodando em `http://localhost:8080`.
2. Em outro terminal, acesse a pasta do front-end (`agreste-react`) e inicie o servidor Vite:
   ```bash
   npm install
   npm run dev
   ```
3. Acesse **`http://localhost:5173`** no navegador.
