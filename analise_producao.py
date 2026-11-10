class AnaliseProducao:
    def __init__(self, pedidos):
        self.pedidos = pedidos

    def contarPorEtapa(self, etapa):
        quantidade = 0

        for pedido in self.pedidos:
            if pedido["status"]== etapa:
                quantidade += 1

        return quantidade
    
    def contarEmProducao(self):
        etapas = ["Corte", "Costura", "Acabamento", "Conferência"]
        quantidade = 0
        for pedido in self.pedidos:
            if pedido["status"] in etapas:
                quantidade += 1

        return quantidade

    def contarAtrasados(self):
        quantidade = 0

        for pedido in self.pedidos:
            if pedido["status"] == "Atrasado":
                quantidade += 1

        return quantidade
    
    def identificarEtapaAtual(self):
        for pedido in self.pedidos:
            print(f"Pedido {pedido['numero']} -> {pedido['status']}")
