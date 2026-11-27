package br.com.agrestetextil.controller;

public class PedidoController {
    package br.com.agrestetextil.controller;

import br.com.agrestetextil.dto.DashboardResponse;
import br.com.agrestetextil.dto.StatusUpdateRequest;
import br.com.agrestetextil.model.Pedido;
import br.com.agrestetextil.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

    @RestController
    @RequestMapping("/api")
    public class PedidoController {

        private final PedidoService service;

        public PedidoController(PedidoService service) {
            this.service = service;
        }

        @GetMapping("/health")
        public ResponseEntity<Map<String, String>> health() {
            return ResponseEntity.ok(Map.of(
                    "status", "ok",
                    "mensagem", "API funcionando"
            ));
        }

        @GetMapping("/pedidos")
        public ResponseEntity<List<Pedido>> listar() throws IOException {
            return ResponseEntity.ok(service.listar());
        }

        @PostMapping("/pedidos")
        public ResponseEntity<Pedido> criar(@RequestBody Pedido pedido) throws IOException {
            return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(pedido));
        }

        @PatchMapping("/pedidos/{numero}/status")
        public ResponseEntity<Pedido> atualizarStatus(
                @PathVariable String numero,
                @RequestBody(required = false) StatusUpdateRequest request
        ) throws IOException {
            String status = (request == null || request.status() == null) ? "" : request.status();
            return ResponseEntity.ok(service.atualizarStatus(numero, status));
        }

        @GetMapping("/dashboard")
        public ResponseEntity<DashboardResponse> dashboard() throws IOException {
            return ResponseEntity.ok(service.dashboard());
        }
    }

}
