class AnaliseEstoque:

    def __init__(self, tecidos):
        self.tecidos = tecidos

    def verificarEstoqueBaixo(self):
        # Igual ao site: baixo quando a quantidade chega no estoque mínimo do próprio item
        produtos_baixos = []

        for tecido in self.tecidos:
            if tecido["quantidade"] <= tecido["estoqueMinimo"]:
                produtos_baixos.append(tecido["nome"])

        return produtos_baixos

    def verificarNecessidadedeReposicao(self):
        # Diz QUANTO comprar: completa até o dobro do estoque mínimo,
        # que é onde o dashboard passa a considerar o estoque "alto".
        produtos_reposicao = []

        for tecido in self.tecidos:
            if tecido["quantidade"] <= tecido["estoqueMinimo"]:
                alvo = tecido["estoqueMinimo"] * 2
                produtos_reposicao.append({
                    "nome": tecido["nome"],
                    "quantidade": tecido["quantidade"],
                    "estoqueMinimo": tecido["estoqueMinimo"],
                    "repor": alvo - tecido["quantidade"],
                    "unidade": tecido.get("unidade", ""),
                })

        return produtos_reposicao

    def classificarEstoque(self):
        # Mesmas faixas do dashboard.jsx
        niveis = {"baixo": 0, "medio": 0, "alto": 0}

        for tecido in self.tecidos:
            minimo = tecido["estoqueMinimo"]

            if tecido["quantidade"] <= minimo:
                niveis["baixo"] += 1
            elif tecido["quantidade"] <= minimo * 2:
                niveis["medio"] += 1
            else:
                niveis["alto"] += 1

        return niveis
