package br.com.agrestetextil.service;

public class PedidoService {
    package br.com.agrestetextil.service;

import br.com.agrestetextil.dto.DashboardResponse;
import br.com.agrestetextil.exception.ConflitoException;
import br.com.agrestetextil.exception.NaoEncontradoException;
import br.com.agrestetextil.model.Pedido;
import br.com.agrestetextil.repository.PedidoRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;
import java.util.Set;

    @Service
    public class PedidoService {

        private static final Set<String> STATUS_VALIDOS = Set.of(
                "recebido", "corte", "costura", "acabamento", "conferencia", "pronto", "enviado"
        );

        private static final Set<String> STATUS_EM_PRODUCAO = Set.of(
                "corte", "costura", "acabamento", "conferencia"
        );

        private static final Set<String> STATUS_FINALIZADOS = Set.of(
                "enviado", "pronto"
        );

        private final PedidoRepository repository;

        public PedidoService(PedidoRepository repository) {
            this.repository = repository;
        }

        public List<Pedido> listar() throws IOException {
            return repository.listar();
        }

        public Pedido criar(Pedido pedido) throws IOException {
            if (pedido == null) {
                throw new IllegalArgumentException("O corpo JSON é obrigatório.");
            }

            String numero = limpar(pedido.getNumero());
            String cliente = limpar(pedido.getCliente());
            String prazo = limpar(pedido.getPrazo());

            if (numero.isBlank()) {
                throw new IllegalArgumentException("O número do pedido é obrigatório.");
            }
            if (!numero.matches("\\d{1,5}")) {
                throw new IllegalArgumentException("O número deve conter de 1 a 5 dígitos.");
            }

            numero = String.format(Locale.ROOT, "%05d", Integer.parseInt(numero));

            if (cliente.isBlank()) {
                throw new IllegalArgumentException("O nome do cliente é obrigatório.");
            }
            if (pedido.getQuantidade() <= 0) {
                throw new IllegalArgumentException("A quantidade deve ser maior que zero.");
            }

            try {
                LocalDate.parse(prazo);
            } catch (DateTimeParseException | NullPointerException _) {
                throw new IllegalArgumentException("O prazo deve estar no formato AAAA-MM-DD.");
            }

            if (repository.buscar(numero).isPresent()) {
                throw new ConflitoException("Já existe um pedido com esse número.");
            }

            return repository.criar(new Pedido(numero, cliente, pedido.getQuantidade(), prazo, "recebido"));
        }

        public Pedido atualizarStatus(String numero, String status) throws IOException {
            String normalizado = limpar(status).toLowerCase(Locale.ROOT);
            if (!STATUS_VALIDOS.contains(normalizado)) {
                throw new IllegalArgumentException("Status inválido. Valores aceitos: " + String.join(", ", STATUS_VALIDOS));
            }
            return repository.atualizarStatus(numero, normalizado)
                    .orElseThrow(() -> new NaoEncontradoException("Pedido não encontrado: " + numero));
        }

        public DashboardResponse dashboard() throws IOException {
            List<Pedido> pedidos = repository.listar();
            LocalDate hoje = LocalDate.now();

            long recebidos = pedidos.stream()
                    .filter(p -> "recebido".equals(p.getStatus()))
                    .count();

            long prontos = pedidos.stream()
                    .filter(p -> "pronto".equals(p.getStatus()))
                    .count();

            long producao = pedidos.stream()
                    .filter(p -> STATUS_EM_PRODUCAO.contains(p.getStatus()))
                    .count();

            long atrasados = pedidos.stream()
                    .filter(p -> {
                        try {
                            return !STATUS_FINALIZADOS.contains(p.getStatus())
                                    && p.getPrazo() != null
                                    && LocalDate.parse(p.getPrazo()).isBefore(hoje);
                        } catch (Exception _) {
                            return false;
                        }
                    })
                    .count();

            return new DashboardResponse(pedidos.size(), recebidos, prontos, producao, atrasados);
        }

        private static String limpar(String s) {
            return s == null ? "" : s.trim();
        }
    }

}
