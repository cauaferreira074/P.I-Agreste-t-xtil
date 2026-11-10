from analise_producao import AnaliseProducao
from analise_estoque import AnaliseEstoque
from analise_logistica import Analiselogistica
from relatorio import Relatorio
from indicadores import Indicadores

pedidos = [
    {"numero": "001", "status": "Corte"},
    {"numero": "002", "status": "Costura"},
    {"numero": "003", "status": "Pronto"},
    {"numero": "004", "status": "Acabamento"},
    {"numero": "005", "status": "Atrasado"},
    {"numero": "006", "status": "Pronto"},
    {"numero": "007", "status": "Atrasado"}
]

produtos = [
    {"nome": "Tecido", "quantidade": 20},
    {"nome": "Linha", "quantidade": 3},
    {"nome": "Aviamento", "quantidade": 8},
    {"nome": "Produto pronto", "quantidade": 2}
]

entregas = [
    {"numero": "001", "status": "Enviado"},
    {"numero": "002", "status": "Entregue"},
    {"numero": "003", "status": "Enviado"},
    {"numero": "004", "status": "Entregue"},
    {"numero": "005", "status": "Atrasado"}
]

analise_producao = AnaliseProducao(pedidos)

analise_estoque = AnaliseEstoque(produtos)

analise_logistica = Analiselogistica(entregas)

indicadores = Indicadores(analise_producao, analise_estoque, analise_logistica)


print("===== ANALISE DA PRODUCAO =====")

print("Pedidos em producao:",
      analise_producao.contarEmProducao())

print("Pedidos prontos:",
      analise_producao.contarPorEtapa("Pronto"))

print("Pedidos atrasados:",
      analise_producao.contarAtrasados())


print("\n===== ANALISE DO ESTOQUE =====")

print("Estoque baixo:",
      analise_estoque.verificarEstoqueBaixo())


print("\n===== ANALISE DA LOGISTICA =====")

print("Total de entregas:",
      analise_logistica.analisarEntregas())

print("Entregas atrasadas:",
      analise_logistica.verificarAtrasos())

print("Taxa de entregas:",
      analise_logistica.calcularTaxaDeEntregas(), "%")



dados_relatorio = {
    "pedidos_em_producao": analise_producao.contarEmProducao(),
    "pedidos_prontos": analise_producao.contarPorEtapa("Pronto"),
    "pedidos_atrasados": analise_producao.contarAtrasados(),
    "estoque_baixo": analise_estoque.verificarEstoqueBaixo(),
    "total_entregas": analise_logistica.analisarEntregas(),
    "entregas_atrasadas": analise_logistica.verificarAtrasos(),
    "taxa_entregas": analise_logistica.calcularTaxaDeEntregas()
}

relatorio = Relatorio("Setembro de 2026", dados_relatorio)

relatorio.gerarRelatorio()


print("\n===== INDICADORES =====")

print("Prontos:",
      indicadores.quantidadeProntos())

print("Em producao:",
      indicadores.quantidadeEmProducao())

print("Atrasados:",
      indicadores.quantidadeAtrasados())

print("Estoque baixo:",
      indicadores.quantidadeEstoqueBaixo())

print("Total de entregas:",
      indicadores.quantidadeEntregas())

print("Entregas atrasadas:",
      indicadores.quantidadeEntregasAtrasadas())

print("Taxa de entregas:",
      indicadores.taxaEntregas(), "%")