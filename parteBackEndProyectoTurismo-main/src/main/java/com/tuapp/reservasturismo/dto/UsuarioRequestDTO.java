package com.tuapp.reservasturismo.dto;

public class UsuarioRequestDTO {

    private String username;
    private String email;
    private String password;
    private String rol;

    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getRol() { return rol; }
}