# Análise de Dados – Agreste Têxtil

Módulo em Python que analisa a **produção**, o **estoque** e a **logística** da Agreste Têxtil
e gera um relatório com os principais indicadores.

Os dados seguem o mesmo formato usado pelo site (`Front-princ/src/pages`), então os números
batem com o dashboard.

## Como rodar

Precisa de Python 3 (não usa bibliotecas externas). Na raiz do repositório:

```
python analise-dados/main.py
```

## Arquivos

| Arquivo | O que faz |
|---|---|
| `main.py` | Ponto de entrada: monta os dados, roda as análises e imprime o relatório |
| `etapas.py` | Nomes das etapas de produção e logística, iguais aos do site |
| `analise_producao.py` | Conta pedidos por etapa, em produção e atrasados; mostra a etapa atual de cada pedido |
| `analise_estoque.py` | Estoque baixo pelo `estoqueMinimo` de cada item, níveis baixo/médio/alto e quanto repor |
| `analise_logistica.py` | Entregas dos pedidos prontos, por etapa, atrasadas e taxa de entrega |
| `indicadores.py` | Junta os resultados das três análises (`gerarDados()`) |
| `relatorio.py` | Imprime o relatório final |

## Regras usadas

- **Em produção:** pedidos em corte, costura, acabamento ou conferência.
- **Atrasado:** campo `atrasado` do pedido (um pedido pode estar em produção e atrasado ao mesmo tempo).
- **Estoque baixo:** `quantidade <= estoqueMinimo`; médio até 2× o mínimo; acima disso, alto.
- **Reposição sugerida:** completar até 2× o estoque mínimo.
- **Logística:** só pedidos com status `pronto`; a etapa vem de `statusLogistica`
  (vazio = "Aguardando expedição"). Entrega atrasada = marcada como atrasada e ainda não entregue.
- **Taxa de entregas:** entregues ÷ total da logística × 100.

## Formato dos dados

```python
pedido = {"numero": "001", "cliente": "Loja Bela", "quantidade": 120,
          "status": "pronto", "atrasado": False, "statusLogistica": "entregue"}

tecido = {"nome": "Linha", "cor": "Preta", "quantidade": 3,
          "unidade": "rolos", "estoqueMinimo": 5}
```
