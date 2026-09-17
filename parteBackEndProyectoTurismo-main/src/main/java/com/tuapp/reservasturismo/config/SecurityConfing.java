package com.tuapp.reservasturismo.config;

import com.tuapp.reservasturismo.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfing {

    private final JwtFilter jwtFilter;

    public SecurityConfing(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*")); // En producción pon tu URL del frontend
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // Rutas públicas
                        .requestMatchers("/auth/**", "/api/auth/**").permitAll()

                        // Solo ADMIN gestiona usuarios
                        .requestMatchers("/api/usuarios/**").hasRole("ADMIN")

                        // Solo ADMIN crea/edita/elimina productos y categorías
                        .requestMatchers(HttpMethod.POST,   "/productos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/productos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/productos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST,   "/categorias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/categorias/**").hasRole("ADMIN")

                        // Solo ADMIN elimina reservas y lista todas
                        .requestMatchers(HttpMethod.DELETE, "/api/reservas/**").hasRole("ADMIN")

                        // Cualquier autenticado puede ver productos, categorías y gestionar sus reservas
                        .requestMatchers(HttpMethod.GET, "/productos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/categorias/**").permitAll()
                        .requestMatchers("/api/reservas/**").authenticated()

                        // Características
                        .requestMatchers(HttpMethod.POST,   "/productos/*/caracteristicas").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/productos/*/caracteristicas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/caracteristicas/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}