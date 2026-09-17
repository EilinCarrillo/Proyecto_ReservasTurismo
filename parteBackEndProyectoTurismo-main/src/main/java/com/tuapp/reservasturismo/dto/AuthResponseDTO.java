package com.tuapp.reservasturismo.dto;

public class AuthResponseDTO {

    private String token;
    private Long userId;
    private String username;
    private String rol;

    public AuthResponseDTO() {}

    public AuthResponseDTO(String token, Long userId, String username, String rol) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.rol = rol;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}