package br.com.agrestetextil;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;
import java.util.Set;

public class PedidoService {
    private static final Set<String> STATUS = Set.of("recebido", "corte", "costura", "acabamento", "conferencia", "pronto", "enviado");
    private final PedidoRepository repository;
    public PedidoService(PedidoRepository repository) { this.repository = repository; }
    public List<Pedido> listar() throws IOException { return repository.listar(); }
    public Pedido criar(Pedido pedido) throws IOException {
        if (pedido == null) throw new IllegalArgumentException("O corpo JSON é obrigatório.");
        String numero = limpar(pedido.getNumero()), cliente = limpar(pedido.getCliente()), prazo = limpar(pedido.getPrazo());
        if (numero.isBlank()) throw new IllegalArgumentException("O número do pedido é obrigatório.");
        if (!numero.matches("\\d{1,5}")) throw new IllegalArgumentException("O número deve conter de 1 a 5 dígitos.");
        numero = String.format(Locale.ROOT, "%05d", Integer.parseInt(numero));
        if (cliente.isBlank()) throw new IllegalArgumentException("O nome do cliente é obrigatório.");
        if (pedido.getQuantidade() <= 0) throw new IllegalArgumentException("A quantidade deve ser maior que zero.");
        try { LocalDate.parse(prazo); } catch (DateTimeParseException | NullPointerException e) { throw new IllegalArgumentException("O prazo deve estar no formato AAAA-MM-DD."); }
        if (repository.buscar(numero).isPresent()) throw new ConflitoException("Já existe um pedido com esse número.");
        return repository.criar(new Pedido(numero, cliente, pedido.getQuantidade(), prazo, "recebido"));
    }
    public Pedido atualizarStatus(String numero, String status) throws IOException {
        String normalizado = limpar(status).toLowerCase(Locale.ROOT);
        if (!STATUS.contains(normalizado)) throw new IllegalArgumentException("Status inválido. Valores aceitos: " + String.join(", ", STATUS));
        return repository.atualizarStatus(numero, normalizado).orElseThrow(() -> new NaoEncontradoException("Pedido não encontrado: " + numero));
    }
    public Dashboard dashboard() throws IOException {
        List<Pedido> pedidos = repository.listar(); LocalDate hoje = LocalDate.now();
        long recebidos = pedidos.stream().filter(p -> "recebido".equals(p.getStatus())).count();
        long prontos = pedidos.stream().filter(p -> "pronto".equals(p.getStatus())).count();
        long producao = pedidos.stream().filter(p -> Set.of("corte", "costura", "acabamento", "conferencia").contains(p.getStatus())).count();
        long atrasados = pedidos.stream().filter(p -> {
            try { return !Set.of("enviado", "pronto").contains(p.getStatus()) && p.getPrazo() != null && LocalDate.parse(p.getPrazo()).isBefore(hoje); }
            catch (Exception e) { return false; }
        }).count();
        return new Dashboard(pedidos.size(), recebidos, prontos, producao, atrasados);
    }
    private static String limpar(String s) { return s == null ? "" : s.trim(); }
    public record Dashboard(long totalPedidos, long recebidos, long prontos, long emProducao, long atrasados) {}
    public static class ConflitoException extends RuntimeException { public ConflitoException(String m) { super(m); } }
    public static class NaoEncontradoException extends RuntimeException { public NaoEncontradoException(String m) { super(m); } }
}
