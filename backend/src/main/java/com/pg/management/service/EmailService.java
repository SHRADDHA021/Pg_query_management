package com.pg.management.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendRegistrationEmail(String toEmail, String name) {
        sendHtmlEmail(toEmail, "Registration Successful - PG Management",
                buildRegistrationEmailBody(name));
    }

    public void sendVerificationEmail(String toEmail, String name, String roomNumber) {
        sendHtmlEmail(toEmail, "Account Verified - PG Management",
                buildVerificationEmailBody(name, roomNumber));
    }

    public void sendFeeReminderEmail(String toEmail, String name, int month, int year, double amount, String dueDate) {
        sendHtmlEmail(toEmail, "Fee Payment Reminder - PG Management",
                buildFeeReminderEmailBody(name, month, year, amount, dueDate));
    }

    public void sendComplaintUpdateEmail(String toEmail, String name, String category, String status, String adminNote) {
        sendHtmlEmail(toEmail, "Complaint Update - PG Management",
                buildComplaintUpdateEmailBody(name, category, status, adminNote));
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("Email sent to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    private String buildRegistrationEmailBody(String name) {
        return """
            <html><body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
            <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:10px;">
              <h2 style="color:#6366f1;">Welcome to PG Management System!</h2>
              <p>Dear <strong>%s</strong>,</p>
              <p>Your registration has been received successfully. Your account is currently <strong>pending verification</strong> by the admin.</p>
              <p>You will be notified once your account is verified and a room is assigned to you.</p>
              <p style="color:#888;">This is an automated email. Please do not reply.</p>
            </div></body></html>
            """.formatted(name);
    }

    private String buildVerificationEmailBody(String name, String roomNumber) {
        return """
            <html><body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
            <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:10px;">
              <h2 style="color:#22c55e;">Account Verified! ✅</h2>
              <p>Dear <strong>%s</strong>,</p>
              <p>Your account has been <strong>verified</strong> by the admin. You can now log in to the PG Management System.</p>
              <p>Your assigned room: <strong>%s</strong></p>
              <p>You can now access your dashboard to view complaints, fee status, and mess menu.</p>
              <p style="color:#888;">This is an automated email. Please do not reply.</p>
            </div></body></html>
            """.formatted(name, roomNumber != null ? roomNumber : "To be assigned");
    }

    private String buildFeeReminderEmailBody(String name, int month, int year, double amount, String dueDate) {
        String[] months = {"", "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"};
        return """
            <html><body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
            <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:10px;">
              <h2 style="color:#f59e0b;">Fee Payment Reminder ⚠️</h2>
              <p>Dear <strong>%s</strong>,</p>
              <p>This is a reminder that your rent payment for <strong>%s %d</strong> is due.</p>
              <table style="width:100%%;border-collapse:collapse;margin:15px 0;">
                <tr style="background:#f8f9fa;"><td style="padding:10px;">Amount Due</td><td style="padding:10px;font-weight:bold;">₹%.2f</td></tr>
                <tr><td style="padding:10px;">Due Date</td><td style="padding:10px;color:#ef4444;font-weight:bold;">%s</td></tr>
              </table>
              <p>Please make the payment before the due date to avoid being marked overdue.</p>
              <p style="color:#888;">This is an automated email. Please do not reply.</p>
            </div></body></html>
            """.formatted(name, months[month], year, amount, dueDate);
    }

    private String buildComplaintUpdateEmailBody(String name, String category, String status, String adminNote) {
        String statusColor = status.equals("RESOLVED") ? "#22c55e" : status.equals("IN_PROGRESS") ? "#f59e0b" : "#6366f1";
        return """
            <html><body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
            <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:10px;">
              <h2 style="color:%s;">Complaint Status Update</h2>
              <p>Dear <strong>%s</strong>,</p>
              <p>Your complaint regarding <strong>%s</strong> has been updated.</p>
              <p>New Status: <strong style="color:%s;">%s</strong></p>
              %s
              <p style="color:#888;">This is an automated email. Please do not reply.</p>
            </div></body></html>
            """.formatted(statusColor, name, category, statusColor, status,
                adminNote != null && !adminNote.isEmpty()
                    ? "<p>Admin Note: <em>" + adminNote + "</em></p>" : "");
    }
}
