package com.tuapp.reservasturismo.service.email;

import com.tuapp.reservasturismo.model.Reserva;
import com.tuapp.reservasturismo.model.Usuario;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${turismo.mail.remitente}")
    private String nombreRemitente;

    @Value("${spring.mail.username}")
    private String emailRemitente;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarConfirmacionReserva(Usuario usuario, Reserva reserva) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setFrom(emailRemitente, nombreRemitente);
            helper.setTo(usuario.getEmail());
            helper.setSubject("✅ Confirmación de tu reserva #" + reserva.getId() + " - TurAventura");
            helper.setText(construirCuerpoCorreo(usuario, reserva), true);

            System.out.println("📧 Intentando enviar correo a: " + usuario.getEmail());
            mailSender.send(mensaje);
            System.out.println("✅ Correo enviado exitosamente a: " + usuario.getEmail());

        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            System.err.println("⚠️ No se pudo enviar el correo: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String construirCuerpoCorreo(Usuario usuario, Reserva reserva) {
        String nombreProducto = reserva.getProducto() != null
                ? reserva.getProducto().getNombre() : "Producto #" + reserva.getId();
        String descripcion = reserva.getProducto() != null
                ? reserva.getProducto().getDescripcion() : "-";
        String precio = reserva.getProducto() != null && reserva.getProducto().getPrecio() != null
                ? String.format("$%,.0f", reserva.getProducto().getPrecio()) : "-";

        return """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #1a73e8; padding: 24px; text-align: center;">
                <h1 style="color: white; margin: 0;">TurAventura</h1>
                <p style="color: #d0e8ff; margin: 4px 0 0;">Agencia de Turismo</p>
              </div>
              <div style="padding: 32px;">
                <h2 style="color: #1a73e8;">¡Hola, %s! Tu reserva está confirmada ✅</h2>
                <p style="color: #444;">Gracias por elegir TurAventura. Aquí tienes el resumen:</p>
                <div style="background-color: #f8f9fa; border-left: 4px solid #1a73e8; padding: 20px; border-radius: 4px; margin: 20px 0;">
                  <table style="width: 100%%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #666; width: 40%%;">📋 Número de reserva</td>
                      <td style="padding: 8px 0; font-weight: bold;">#%d</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666;">📍 Destino</td>
                      <td style="padding: 8px 0; font-weight: bold;">%s</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666;">📝 Descripción</td>
                      <td style="padding: 8px 0;">%s</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666;">👥 Personas</td>
                      <td style="padding: 8px 0;">%d</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666;">💰 Precio por persona</td>
                      <td style="padding: 8px 0; font-weight: bold; color: #1a73e8;">%s</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666;">📌 Estado</td>
                      <td style="padding: 8px 0;">
                        <span style="background-color: #e6f4ea; color: #137333; padding: 2px 10px; border-radius: 12px;">%s</span>
                      </td>
                    </tr>
                  </table>
                </div>
                <p style="color: #444;">¡Que disfrutes tu viaje! 🌟</p>
              </div>
              <div style="background-color: #f1f3f4; padding: 16px; text-align: center;">
                <p style="color: #888; font-size: 12px; margin: 0;">© 2025 TurAventura · Correo automático, por favor no respondas.</p>
              </div>
            </div>
            """.formatted(
                usuario.getUsername(),
                reserva.getId(),
                nombreProducto,
                descripcion,
                reserva.getCantidadPersonas(),
                precio,
                reserva.getEstado()
        );
    }
}