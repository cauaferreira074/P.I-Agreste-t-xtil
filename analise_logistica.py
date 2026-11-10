class Analiselogistica:

    def __init__(self, entregas):
        self.entregas = entregas

    def analisarEntregas(self):
        quantidade = 0

        for entrega in self.entregas:
            quantidade += 1

        return quantidade

    def verificarAtrasos(self):
        atrasos = []

        for entrega in self.entregas:
            if entrega["status"] == "Atrasado":
                atrasos.append(entrega["numero"])

        return atrasos

    def calcularTaxaDeEntregas(self):
        if len(self.entregas) == 0:
            return 0

        entregues = 0

        for entrega in self.entregas:
            if entrega["status"] == "Entregue":
                entregues += 1

        return entregues / len(self.entregas) * 100
