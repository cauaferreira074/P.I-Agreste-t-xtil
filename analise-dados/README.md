# Análise de Dados – Agreste Têxtil

Módulo em Python que analisa a **produção**, o **estoque** e a **logística** da Agreste Têxtil
e gera um relatório com os principais indicadores.

As regras de cálculo e o formato dos dados são os mesmos do site (`Front-princ/src/pages`).
Com os mesmos dados, os números batem com o dashboard.

> **Dados de exemplo:** por enquanto os pedidos e tecidos estão escritos dentro do `main.py`
> (10 pedidos e 5 tecidos fictícios). A análise ainda não lê os dados reais do sistema.

## Como rodar

Precisa de Python 3 (não usa bibliotecas externas). Na raiz do repositório:

```
python analise-dados/main.py
```

O período do relatório é o mês atual (ex.: "Novembro de 2026").

## Arquivos

| Arquivo | O que faz |
|---|---|
| `main.py` | Ponto de entrada: tem os dados de exemplo, roda as análises e imprime o relatório |
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
- **Taxa de entregas:** entregues ÷ total da logística × 100, com 1 casa decimal.

## Formato dos dados

```python
pedido = {"numero": "001", "cliente": "Loja Bela", "quantidade": 120,
          "status": "pronto", "atrasado": False, "statusLogistica": "entregue"}

tecido = {"nome": "Linha", "cor": "Preta", "quantidade": 3,
          "unidade": "rolos", "estoqueMinimo": 5}
```
