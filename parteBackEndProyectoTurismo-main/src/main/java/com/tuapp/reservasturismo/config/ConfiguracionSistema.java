package com.tuapp.reservasturismo.config;

public class ConfiguracionSistema {
    private static ConfiguracionSistema instancia;
    private String nombreAgencia;

    private ConfiguracionSistema() {
        this.nombreAgencia = "Explora Mundo - Agencia de Turismo";
    }

    public static ConfiguracionSistema getInstance() {
        if (instancia == null) {
            instancia = new ConfiguracionSistema();
        }
        return instancia;
    }

    public String getNombreAgencia() { return nombreAgencia; }
}