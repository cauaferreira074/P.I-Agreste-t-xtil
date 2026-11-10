class Indicadores:

    def __init__(self, producao, estoque, logistica):
        self.producao = producao
        self.estoque = estoque
        self.logistica = logistica

    def quantidadeProntos(self):
        return self.producao.contarPorEtapa("Pronto")

    def quantidadeEmProducao(self):
        return self.producao.contarEmProducao()

    def quantidadeAtrasados(self):
        return self.producao.contarAtrasados()

    def quantidadeEstoqueBaixo(self):
        return len(self.estoque.verificarEstoqueBaixo())

    def quantidadeEntregas(self):
        return self.logistica.analisarEntregas()

    def quantidadeEntregasAtrasadas(self):
        return len(self.logistica.verificarAtrasos())

    def taxaEntregas(self):
        return self.logistica.calcularTaxaDeEntregas()