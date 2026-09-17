package com.tuapp.reservasturismo.dto;

public class LoginResponseDTO {
    private String mensaje;
    private String token;
    private Long   usuarioId;
    private String username;
    private String email;
    private String rol;

    public LoginResponseDTO() {}

    public LoginResponseDTO(String mensaje, String token,
                            Long usuarioId, String username,
                            String email, String rol) {
        this.mensaje   = mensaje;
        this.token     = token;
        this.usuarioId = usuarioId;
        this.username  = username;
        this.email     = email;
        this.rol       = rol;
    }

    public String getMensaje()   { return mensaje; }
    public String getToken()     { return token; }
    public Long   getUsuarioId() { return usuarioId; }
    public String getUsername()  { return username; }
    public String getEmail()     { return email; }
    public String getRol()       { return rol; }

    public void setMensaje(String mensaje)   { this.mensaje = mensaje; }
    public void setToken(String token)       { this.token = token; }
    public void setUsuarioId(Long id)        { this.usuarioId = id; }
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email)       { this.email = email; }
    public void setRol(String rol)           { this.rol = rol; }
}