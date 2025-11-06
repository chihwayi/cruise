import nodemailer from 'nodemailer';
import { format } from 'date-fns';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ''),
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to CruiseRecruit!</h1>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>
              <p>Welcome to CruiseRecruit! We're excited to have you on board.</p>
              <p>Your account has been successfully created. You can now:</p>
              <ul>
                <li>Complete your profile</li>
                <li>Upload your documents</li>
                <li>Browse and apply for job opportunities</li>
                <li>Track your applications</li>
              </ul>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:4002'}/login" class="button">Login to Your Portal</a>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br>The CruiseRecruit Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Welcome to CruiseRecruit!',
      html,
    });
  }

  async sendApplicationStatusEmail(
    email: string,
    firstName: string,
    jobTitle: string,
    status: string
  ): Promise<void> {
    const statusMessages: Record<string, string> = {
      shortlisted: 'Congratulations! Your application has been shortlisted.',
      rejected: 'Thank you for your application. Unfortunately, we have decided to move forward with other candidates.',
      hired: 'Congratulations! We are pleased to offer you the position!',
      pending: 'Your application has been received and is under review.',
    };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
            .status-shortlisted { background: #10b981; color: white; }
            .status-rejected { background: #ef4444; color: white; }
            .status-hired { background: #10b981; color: white; }
            .status-pending { background: #f59e0b; color: white; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Status Update</h1>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>
              <p>${statusMessages[status] || 'Your application status has been updated.'}</p>
              <p><strong>Position:</strong> ${jobTitle}</p>
              <p><strong>Status:</strong> <span class="status-badge status-${status}">${status.toUpperCase()}</span></p>
              <p>You can view your application status in your candidate portal.</p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:4002'}/applications" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">View Application</a>
              <p>Best regards,<br>The CruiseRecruit Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: `Application Status Update: ${jobTitle}`,
      html,
    });
  }

  async sendDocumentExpiryReminder(
    email: string,
    firstName: string,
    documentType: string,
    expiryDate: Date
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Document Expiry Reminder</h1>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>
              <div class="warning">
                <p><strong>Important:</strong> Your ${documentType} is expiring soon!</p>
                <p><strong>Expiry Date:</strong> ${format(expiryDate, 'dd/MM/yyyy')}</p>
              </div>
              <p>To ensure you remain eligible for deployment, please renew your document before it expires.</p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:4002'}/documents" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Upload Renewed Document</a>
              <p>Best regards,<br>The CruiseRecruit Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: `Action Required: ${documentType} Expiring Soon`,
      html,
    });
  }

  async sendContractNotification(
    email: string,
    firstName: string,
    contractNumber: string,
    jobTitle: string
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contract Available</h1>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>
              <p>Great news! A new contract has been prepared for you.</p>
              <p><strong>Contract Number:</strong> ${contractNumber}</p>
              <p><strong>Position:</strong> ${jobTitle}</p>
              <p>Please review and sign the contract in your candidate portal.</p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:4002'}/contracts" style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">View Contract</a>
              <p>Best regards,<br>The CruiseRecruit Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: `New Contract: ${contractNumber}`,
      html,
    });
  }
}

export default new EmailService();

