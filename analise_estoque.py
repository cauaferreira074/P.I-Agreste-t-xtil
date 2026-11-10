class AnaliseEstoque:

    def __init__(self, produtos):
        self.produtos = produtos

    def verificarEstoqueBaixo(self):
        produtos_baixos = []

        for produto in self.produtos:
            if produto["quantidade"] < 5:
                produtos_baixos.append(produto["nome"])

        return produtos_baixos

    def verificarNecessidadedeReposicao(self):
        produtos_reposicao = []

        for produto in self.produtos:
            if produto["quantidade"] < 5:
                produtos_reposicao.append(produto["nome"])

        return produtos_reposicao


