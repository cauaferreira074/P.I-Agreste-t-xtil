from datetime import date

from analise_producao import AnaliseProducao
from analise_estoque import AnaliseEstoque
from analise_logistica import Analiselogistica
from indicadores import Indicadores
from relatorio import Relatorio

# Dados de exemplo no MESMO formato que o site usa.
# (Próximo passo: ler isso de um arquivo em vez de escrever aqui.)
pedidos = [
    {"numero": "001", "cliente": "Loja Bela", "quantidade": 120, "status": "corte", "atrasado": False},
    {"numero": "002", "cliente": "Moda Sul", "quantidade": 80, "status": "costura", "atrasado": True},
    {"numero": "003", "cliente": "Ana Confec", "quantidade": 50, "status": "pronto", "atrasado": False,
     "statusLogistica": "entregue"},
    {"numero": "004", "cliente": "Loja Bela", "quantidade": 200, "status": "acabamento", "atrasado": False},
    {"numero": "005", "cliente": "Estilo PE", "quantidade": 60, "status": "recebido", "atrasado": True},
    {"numero": "006", "cliente": "Moda Sul", "quantidade": 90, "status": "pronto", "atrasado": False,
     "statusLogistica": "em_transporte"},
    {"numero": "007", "cliente": "Estilo PE", "quantidade": 40, "status": "pronto", "atrasado": True,
     "statusLogistica": "despachado"},
    {"numero": "008", "cliente": "Ana Confec", "quantidade": 70, "status": "conferencia", "atrasado": False},
    {"numero": "009", "cliente": "Loja Bela", "quantidade": 30, "status": "pronto", "atrasado": False,
     "statusLogistica": "entregue"},
    {"numero": "010", "cliente": "Moda Sul", "quantidade": 100, "status": "enviado", "atrasado": False},
]

tecidos = [
    {"nome": "Algodão", "cor": "Branco", "quantidade": 20, "unidade": "m", "estoqueMinimo": 10},
    {"nome": "Linha", "cor": "Preta", "quantidade": 3, "unidade": "rolos", "estoqueMinimo": 5},
    {"nome": "Viscose", "cor": "Azul", "quantidade": 50, "unidade": "m", "estoqueMinimo": 10},
    {"nome": "Aviamento", "cor": "Prata", "quantidade": 8, "unidade": "pacotes", "estoqueMinimo": 10},
    {"nome": "Jeans", "cor": "Azul", "quantidade": 15, "unidade": "m", "estoqueMinimo": 6},
]

MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
         "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

hoje = date.today()
periodo = f"{MESES[hoje.month - 1]} de {hoje.year}"

analise_producao = AnaliseProducao(pedidos)
analise_estoque = AnaliseEstoque(tecidos)
analise_logistica = Analiselogistica(pedidos)

indicadores = Indicadores(analise_producao, analise_estoque, analise_logistica)

relatorio = Relatorio(periodo, indicadores)
relatorio.gerarRelatorio()
