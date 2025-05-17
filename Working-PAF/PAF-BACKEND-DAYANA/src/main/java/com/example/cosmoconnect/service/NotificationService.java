package com.example.cosmoconnect.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.cosmoconnect.model.Notification;
import com.example.cosmoconnect.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    @Value("${twilio.account.sid}")
    private String twilioAccountSid;
    
    @Value("${twilio.auth.token}")
    private String twilioAuthToken;
    
    @Value("${twilio.phone.number}")
    private String twilioPhoneNumber;
    
    private final JavaMailSender emailSender;
    private final NotificationRepository notificationRepository;
    
    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }
    
    public void sendWhatsAppMessage(String to, String message) {
        Twilio.init(twilioAccountSid, twilioAuthToken);
        Message.creator(
            new PhoneNumber("whatsapp:" + to),
            new PhoneNumber("whatsapp:" + twilioPhoneNumber),
            message
        ).create();
    }
    
    public void shareCourse(String to, String courseTitle, String courseUrl, String shareMethod) {
        String message = "Check out this course: " + courseTitle + "\n" + courseUrl;
        
        if ("email".equalsIgnoreCase(shareMethod)) {
            sendEmail(to, "Course Share: " + courseTitle, message);
        } else if ("whatsapp".equalsIgnoreCase(shareMethod)) {
            sendWhatsAppMessage(to, message);
        }
    }

    public Notification createNotification(String userId, String type, String message, String link) {
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .message(message)
                .link(link)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }
} 