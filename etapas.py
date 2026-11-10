# Nomes das etapas IGUAIS aos usados no site (Front-princ/src/pages).
# A chave e o valor gravado no pedido; o texto e o nome que aparece na tela.

ETAPAS_PRODUCAO = {
    "recebido": "Recebido",
    "corte": "Corte",
    "costura": "Costura",
    "acabamento": "Acabamento",
    "conferencia": "Conferência",
    "pronto": "Pronto",
    "enviado": "Enviado",
}

# Etapas que contam como "em produção" (igual ao dashboard.jsx)
ETAPAS_EM_PRODUCAO = ["corte", "costura", "acabamento", "conferencia"]

ETAPAS_LOGISTICA = {
    "aguardando_expedicao": "Aguardando expedição",
    "separacao": "Separação",
    "conferencia": "Conferência",
    "despachado": "Despachado",
    "em_transporte": "Em transporte",
    "entregue": "Entregue",
}

# Quando o pedido ainda não tem statusLogistica, o site assume esta etapa
ETAPA_LOGISTICA_PADRAO = "aguardando_expedicao"
