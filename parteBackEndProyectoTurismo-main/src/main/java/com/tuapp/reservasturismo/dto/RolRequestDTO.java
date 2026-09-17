package com.tuapp.reservasturismo.dto;

public class RolRequestDTO {
    private String rol;           // "ADMIN" o "USER"
    private String tokenAdmin;    // token del admin que realiza la acción

    public RolRequestDTO() {}

    public String getRol()        { return rol; }
    public String getTokenAdmin() { return tokenAdmin; }

    public void setRol(String rol)              { this.rol = rol; }
    public void setTokenAdmin(String tokenAdmin){ this.tokenAdmin = tokenAdmin; }
}