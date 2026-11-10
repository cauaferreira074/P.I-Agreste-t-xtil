class Indicadores:

    def __init__(self, producao, estoque, logistica):
        self.producao = producao
        self.estoque = estoque
        self.logistica = logistica

    def quantidadeRecebidos(self):
        return self.producao.contarPorEtapa("recebido")

    def quantidadeProntos(self):
        return self.producao.contarPorEtapa("pronto")

    def quantidadeEnviados(self):
        return self.producao.contarPorEtapa("enviado")

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

    def gerarDados(self):
        # Junta tudo num dicionário só, que o Relatorio usa
        return {
            "pedidos_recebidos": self.quantidadeRecebidos(),
            "pedidos_em_producao": self.quantidadeEmProducao(),
            "pedidos_prontos": self.quantidadeProntos(),
            "pedidos_enviados": self.quantidadeEnviados(),
            "pedidos_atrasados": self.quantidadeAtrasados(),
            "pedidos_por_etapa": self.producao.contarTodasEtapas(),
            "etapa_atual": self.producao.identificarEtapaAtual(),
            "estoque_baixo": self.estoque.verificarEstoqueBaixo(),
            "estoque_niveis": self.estoque.classificarEstoque(),
            "reposicao": self.estoque.verificarNecessidadedeReposicao(),
            "total_entregas": self.quantidadeEntregas(),
            "entregas_por_etapa": self.logistica.contarTodasEtapas(),
            "entregas_atrasadas": self.logistica.verificarAtrasos(),
            "taxa_entregas": self.taxaEntregas(),
        }
