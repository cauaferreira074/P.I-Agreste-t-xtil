from etapas import ETAPAS_LOGISTICA, ETAPA_LOGISTICA_PADRAO


class Analiselogistica:

    def __init__(self, pedidos):
        # Igual ao site: só entram na logística os pedidos prontos na produção.
        # A etapa da logística fica no campo "statusLogistica" do próprio pedido.
        self.entregas = []

        for pedido in pedidos:
            if pedido["status"] == "pronto":
                self.entregas.append(pedido)

    def etapaDe(self, entrega):
        return entrega.get("statusLogistica") or ETAPA_LOGISTICA_PADRAO

    def analisarEntregas(self):
        return len(self.entregas)

    def contarTodasEtapas(self):
        contagem = {}

        for valor, nome in ETAPAS_LOGISTICA.items():
            quantidade = 0

            for entrega in self.entregas:
                if self.etapaDe(entrega) == valor:
                    quantidade += 1

            contagem[nome] = quantidade

        return contagem

    def verificarAtrasos(self):
        # Atrasada = marcada como atrasada e ainda não entregue
        atrasos = []

        for entrega in self.entregas:
            if entrega.get("atrasado", False) and self.etapaDe(entrega) != "entregue":
                atrasos.append(entrega["numero"])

        return atrasos

    def calcularTaxaDeEntregas(self):
        if len(self.entregas) == 0:
            return 0

        entregues = 0

        for entrega in self.entregas:
            if self.etapaDe(entrega) == "entregue":
                entregues += 1

        return round(entregues / len(self.entregas) * 100, 1)
