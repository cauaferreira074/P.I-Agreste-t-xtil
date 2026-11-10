class Relatorio:

    def __init__(self, periodo, indicadores):
        self.periodo = periodo
        self.indicadores = indicadores
        self.dados = indicadores.gerarDados()

    def gerarRelatorio(self):
        d = self.dados

        print("===== RELATORIO AGRESTE TEXTIL =====")
        print("Periodo:", self.periodo)

        print("\n--- Producao ---")
        print("Pedidos recebidos:", d["pedidos_recebidos"])
        print("Pedidos em producao:", d["pedidos_em_producao"])
        print("Pedidos prontos:", d["pedidos_prontos"])
        print("Pedidos enviados:", d["pedidos_enviados"])
        print("Pedidos atrasados:", d["pedidos_atrasados"])

        print("\nPedidos por etapa:")
        for etapa, quantidade in d["pedidos_por_etapa"].items():
            print(f"  {etapa}: {quantidade}")

        print("\nEtapa atual de cada pedido:")
        for pedido in d["etapa_atual"]:
            aviso = " (ATRASADO)" if pedido["atrasado"] else ""
            print(f"  Pedido {pedido['numero']} -> {pedido['etapa']}{aviso}")

        print("\n--- Estoque ---")
        niveis = d["estoque_niveis"]
        print(f"Niveis: baixo {niveis['baixo']} | medio {niveis['medio']} | alto {niveis['alto']}")
        print("Produtos com estoque baixo:", ", ".join(d["estoque_baixo"]) or "nenhum")

        if d["reposicao"]:
            print("Reposicao sugerida:")
            for item in d["reposicao"]:
                print(f"  {item['nome']}: tem {item['quantidade']}, "
                      f"minimo {item['estoqueMinimo']} -> comprar {item['repor']} {item['unidade']}")

        print("\n--- Logistica ---")
        print("Total de entregas:", d["total_entregas"])

        print("Entregas por etapa:")
        for etapa, quantidade in d["entregas_por_etapa"].items():
            print(f"  {etapa}: {quantidade}")

        print("Entregas atrasadas:", ", ".join(d["entregas_atrasadas"]) or "nenhuma")
        print("Taxa de entregas:", d["taxa_entregas"], "%")

    def exibirDados(self):
        print(self.dados)
