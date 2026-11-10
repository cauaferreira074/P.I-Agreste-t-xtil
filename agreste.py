class Relatorio:
    def __init__(self,periodo,dados):
        self.periodo = periodo
        self.dados = dados

    def gerarRelatorio(self):
        return f"Relatório - período: {self.periodo}\nDados: {self.dados}"

    def exibirDados(self):
        print(self.dados)


    