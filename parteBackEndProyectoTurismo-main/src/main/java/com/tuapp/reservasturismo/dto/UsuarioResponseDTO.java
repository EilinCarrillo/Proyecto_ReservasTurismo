package com.tuapp.reservasturismo.dto;

public class UsuarioResponseDTO {

    private Long id;
    private String username;
    private String email;
    private String rol;

    public UsuarioResponseDTO(Long id, String username, String email, String rol) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.rol = rol;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getRol() { return rol; }
}
