package br.com.agrestetextil.dto;

public record DashboardResponse() {
    package br.com.agrestetextil.dto;

    public record DashboardResponse(
            long totalPedidos,
            long recebidos,
            long prontos,
            long emProducao,
            long atrasados
    ) {}

}
