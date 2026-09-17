package com.tuapp.reservasturismo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET =
            "miclavesuperseguramiclavesupersegura";

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // FIX: incluir el rol en el token para que JwtFilter pueda usarlo
    public String generarToken(String username, String rol) {
        return Jwts.builder()
                .setSubject(username)
                .claim("rol", rol) // FIX: añadir rol como claim
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extraerUsername(String token) {
        return obtenerClaims(token).getSubject();
    }

    // FIX: nuevo método para extraer el rol del token
    public String extraerRol(String token) {
        return obtenerClaims(token).get("rol", String.class);
    }

    public boolean validarToken(String token) {
        try {
            obtenerClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims obtenerClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}