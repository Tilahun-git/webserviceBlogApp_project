package com.blogApplication.blogApp.services.servicesImpl;


import com.blogApplication.blogApp.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendActivationMessage(String toEmail,String text,String subject) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);

        message.setText(text);

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String toEmail, Long token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Password Reset Request");
        message.setText(
                "Your password reset token is: " + token + "\n\n" +
                        "Enter this 6-digit code in the password reset form.\n" +
                        "This token is valid for 24 hours."
        );

        mailSender.send(message);
    }


}
