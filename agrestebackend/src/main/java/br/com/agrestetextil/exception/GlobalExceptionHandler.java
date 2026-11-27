package br.com.agrestetextil.exception;

public class GlobalExceptionHandler {
    package br.com.agrestetextil.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

    @RestControllerAdvice
    public class GlobalExceptionHandler {

        @ExceptionHandler(ConflitoException.class)
        public ResponseEntity<Map<String, String>> handleConflito(ConflitoException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("erro", e.getMessage()));
        }

        @ExceptionHandler(NaoEncontradoException.class)
        public ResponseEntity<Map<String, String>> handleNaoEncontrado(NaoEncontradoException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("erro", e.getMessage()));
        }

        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException e) {
            String msg = e.getMessage() == null ? "Requisição inválida." : e.getMessage();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("erro", msg));
        }

        @ExceptionHandler(HttpMessageNotReadableException.class)
        public ResponseEntity<Map<String, String>> handleJsonInvalido(HttpMessageNotReadableException _) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("erro", "JSON inválido."));
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<Map<String, String>> handleGeral(Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro interno no servidor."));
        }
    }

}
