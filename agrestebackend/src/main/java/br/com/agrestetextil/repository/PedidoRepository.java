package br.com.agrestetextil.repository;

public class PedidoRepository {
    package br.com.agrestetextil.repository;

import br.com.agrestetextil.model.Pedido;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.locks.ReentrantLock;

    @Repository
    public class PedidoRepository {

        private final Path arquivo;
        private final ObjectMapper mapper;
        private final ReentrantLock lock = new ReentrantLock();

        public PedidoRepository() throws IOException {
            this.mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
            Path pasta = Paths.get("dados");
            Files.createDirectories(pasta);
            this.arquivo = pasta.resolve("pedidos.json");

            if (Files.notExists(arquivo)) {
                Files.writeString(arquivo, "[]", StandardCharsets.UTF_8, StandardOpenOption.CREATE_NEW);
            }
        }

        public List<Pedido> listar() throws IOException {
            lock.lock();
            try {
                String conteudo = Files.readString(arquivo, StandardCharsets.UTF_8);
                if (conteudo.isBlank()) {
                    return new ArrayList<>();
                }
                List<Pedido> pedidos = mapper.readValue(conteudo, new TypeReference<>() {});
                return pedidos == null ? new ArrayList<>() : new ArrayList<>(pedidos);
            } finally {
                lock.unlock();
            }
        }

        public Optional<Pedido> buscar(String numero) throws IOException {
            return listar().stream()
                    .filter(p -> p.getNumero().equals(numero))
                    .findFirst();
        }

        public Pedido criar(Pedido novo) throws IOException {
            lock.lock();
            try {
                List<Pedido> lista = listar();
                lista.addFirst(novo);
                salvar(lista);
                return novo;
            } finally {
                lock.unlock();
            }
        }

        public Optional<Pedido> atualizarStatus(String numero, String status) throws IOException {
            lock.lock();
            try {
                List<Pedido> lista = listar();
                for (Pedido p : lista) {
                    if (p.getNumero().equals(numero)) {
                        p.setStatus(status);
                        salvar(lista);
                        return Optional.of(p);
                    }
                }
                return Optional.empty();
            } finally {
                lock.unlock();
            }
        }

        private void salvar(List<Pedido> pedidos) throws IOException {
            Path temporario = arquivo.resolveSibling("pedidos.tmp");
            Files.writeString(temporario, mapper.writeValueAsString(pedidos), StandardCharsets.UTF_8);
            try {
                Files.move(temporario, arquivo, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
            } catch (AtomicMoveNotSupportedException _) {
                Files.move(temporario, arquivo, StandardCopyOption.REPLACE_EXISTING);
            }
        }
    }

}
