package br.com.agrestetextil;

public class Pedido {
    private String numero;
    private String cliente;
    private int quantidade;
    private String prazo;
    private String status;
    public Pedido() {}
    public Pedido(String numero, String cliente, int quantidade, String prazo, String status) {
        this.numero = numero; this.cliente = cliente; this.quantidade = quantidade; this.prazo = prazo; this.status = status;
    }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }
    public int getQuantidade() { return quantidade; }
    public void setQuantidade(int quantidade) { this.quantidade = quantidade; }
    public String getPrazo() { return prazo; }
    public void setPrazo(String prazo) { this.prazo = prazo; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
