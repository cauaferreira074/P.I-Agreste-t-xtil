class Relatorio:

    def __init__(self, periodo, dados):
        self.periodo = periodo
        self.dados = dados

    def gerarRelatorio(self):

        print("\n===== RELATORIO =====")
        print("Periodo:", self.periodo)

        print("\n--- Producao ---")
        print("Pedidos em producao:",
              self.dados["pedidos_em_producao"])

        print("Pedidos prontos:",
              self.dados["pedidos_prontos"])

        print("Pedidos atrasados:",
              self.dados["pedidos_atrasados"])

        print("\n--- Estoque ---")
        print("Produtos com estoque baixo:",
              self.dados["estoque_baixo"])

        print("\n--- Logistica ---")
        print("Total de entregas:",
              self.dados["total_entregas"])

        print("Entregas atrasadas:",
              self.dados["entregas_atrasadas"])

        print("Taxa de entregas:",
              self.dados["taxa_entregas"], "%")

    def exibirDados(self):
        print(self.dados)