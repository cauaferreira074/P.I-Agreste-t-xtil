package br.com.agrestetextil;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class PedidoRepository {
    private final Path arquivo;
    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    private final Type tipoLista = new TypeToken<List<Pedido>>() {}.getType();
    public PedidoRepository() throws IOException {
        Path pasta = Paths.get("dados"); Files.createDirectories(pasta); arquivo = pasta.resolve("pedidos.json");
        if (Files.notExists(arquivo)) Files.writeString(arquivo, "[]", StandardCharsets.UTF_8, StandardOpenOption.CREATE_NEW);
    }
    public synchronized List<Pedido> listar() throws IOException {
        List<Pedido> pedidos = gson.fromJson(Files.readString(arquivo, StandardCharsets.UTF_8), tipoLista);
        return pedidos == null ? new ArrayList<>() : new ArrayList<>(pedidos);
    }
    public synchronized Optional<Pedido> buscar(String numero) throws IOException {
        return listar().stream().filter(p -> p.getNumero().equals(numero)).findFirst();
    }
    public synchronized Pedido criar(Pedido novo) throws IOException { List<Pedido> lista = listar(); lista.add(0, novo); salvar(lista); return novo; }
    public synchronized Optional<Pedido> atualizarStatus(String numero, String status) throws IOException {
        List<Pedido> lista = listar();
        for (Pedido p : lista) if (p.getNumero().equals(numero)) { p.setStatus(status); salvar(lista); return Optional.of(p); }
        return Optional.empty();
    }
    private void salvar(List<Pedido> pedidos) throws IOException {
        Path temporario = arquivo.resolveSibling("pedidos.tmp");
        Files.writeString(temporario, gson.toJson(pedidos), StandardCharsets.UTF_8);
        try { Files.move(temporario, arquivo, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE); }
        catch (AtomicMoveNotSupportedException e) { Files.move(temporario, arquivo, StandardCopyOption.REPLACE_EXISTING); }
    }
}
