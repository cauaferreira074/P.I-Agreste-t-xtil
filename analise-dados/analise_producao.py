from etapas import ETAPAS_PRODUCAO, ETAPAS_EM_PRODUCAO


class AnaliseProducao:
    def __init__(self, pedidos):
        self.pedidos = pedidos

    def contarPorEtapa(self, etapa):
        quantidade = 0

        for pedido in self.pedidos:
            if pedido["status"] == etapa:
                quantidade += 1

        return quantidade

    def contarTodasEtapas(self):
        # Ex.: {"Recebido": 1, "Corte": 1, "Costura": 1, ...}
        contagem = {}

        for valor, nome in ETAPAS_PRODUCAO.items():
            contagem[nome] = self.contarPorEtapa(valor)

        return contagem

    def contarEmProducao(self):
        quantidade = 0

        for pedido in self.pedidos:
            if pedido["status"] in ETAPAS_EM_PRODUCAO:
                quantidade += 1

        return quantidade

    def contarAtrasados(self):
        # No site, "atrasado" é um campo à parte (True/False), não uma etapa.
        # Um pedido pode estar na Costura e atrasado ao mesmo tempo.
        quantidade = 0

        for pedido in self.pedidos:
            if pedido.get("atrasado", False):
                quantidade += 1

        return quantidade

    def identificarEtapaAtual(self):
        # Devolve a lista em vez de imprimir, para o relatório poder usar
        etapas_atuais = []

        for pedido in self.pedidos:
            etapas_atuais.append({
                "numero": pedido["numero"],
                "etapa": ETAPAS_PRODUCAO.get(pedido["status"], pedido["status"]),
                "atrasado": pedido.get("atrasado", False),
            })

        return etapas_atuais
