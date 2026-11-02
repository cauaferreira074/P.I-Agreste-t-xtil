package br.com.agrestetextil;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParseException;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.Executors;

public class Servidor {
    private static final Gson GSON = new GsonBuilder().setPrettyPrinting().create();
    private final PedidoService service;
    public Servidor(PedidoService service) { this.service = service; }
    public static void main(String[] args) throws Exception {
        PedidoService service = new PedidoService(new PedidoRepository());
        HttpServer servidor = HttpServer.create(new InetSocketAddress("localhost", 8080), 0);
        servidor.createContext("/api", new Servidor(service)::tratar);
        servidor.setExecutor(Executors.newFixedThreadPool(8)); servidor.start();
        System.out.println("Agreste Têxtil API: http://localhost:8080");
        System.out.println("GET /api/health | GET/POST /api/pedidos | PATCH /api/pedidos/{numero}/status | GET /api/dashboard");
    }
    private void tratar(HttpExchange ex) throws IOException {
        cors(ex);
        if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) { ex.sendResponseHeaders(204, -1); ex.close(); return; }
        String metodo = ex.getRequestMethod(), caminho = ex.getRequestURI().getPath();
        try {
            if (caminho.equals("/api/health") && metodo.equals("GET")) { responder(ex, 200, Map.of("status", "ok", "mensagem", "API funcionando")); return; }
            if (caminho.equals("/api/pedidos") && metodo.equals("GET")) { responder(ex, 200, service.listar()); return; }
            if (caminho.equals("/api/pedidos") && metodo.equals("POST")) {
                Pedido p = GSON.fromJson(new String(ex.getRequestBody().readAllBytes(), StandardCharsets.UTF_8), Pedido.class);
                responder(ex, 201, service.criar(p)); return;
            }
            if (caminho.equals("/api/dashboard") && metodo.equals("GET")) { responder(ex, 200, service.dashboard()); return; }
            String inicio = "/api/pedidos/", fim = "/status";
            if (caminho.startsWith(inicio) && caminho.endsWith(fim) && metodo.equals("PATCH")) {
                String numero = caminho.substring(inicio.length(), caminho.length() - fim.length());
                Map<?, ?> body = GSON.fromJson(new String(ex.getRequestBody().readAllBytes(), StandardCharsets.UTF_8), Map.class);
                Object status = body == null ? null : body.get("status");
                responder(ex, 200, service.atualizarStatus(numero, status == null ? "" : status.toString())); return;
            }
            responder(ex, 404, Map.of("erro", "Endpoint não encontrado."));
        } catch (PedidoService.ConflitoException e) { responder(ex, 409, Map.of("erro", e.getMessage())); }
          catch (PedidoService.NaoEncontradoException e) { responder(ex, 404, Map.of("erro", e.getMessage())); }
          catch (IllegalArgumentException e) { responder(ex, 400, Map.of("erro", e.getMessage() == null ? "Requisição inválida." : e.getMessage())); }
          catch (JsonParseException e) { responder(ex, 400, Map.of("erro", "JSON inválido.")); }
          catch (Exception e) { e.printStackTrace(); responder(ex, 500, Map.of("erro", "Erro interno no servidor.")); }
        finally { ex.close(); }
    }
    private static void cors(HttpExchange ex) {
        ex.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        ex.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
        ex.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }
    private static void responder(HttpExchange ex, int status, Object objeto) throws IOException {
        byte[] bytes = GSON.toJson(objeto).getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        ex.sendResponseHeaders(status, bytes.length); ex.getResponseBody().write(bytes);
    }
}
