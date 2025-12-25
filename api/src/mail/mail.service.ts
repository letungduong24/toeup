import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private transporter: nodemailer.Transporter;

    constructor() {
        const host = process.env.SMTP_HOST || 'smtp.gmail.com';
        const port = Number(process.env.SMTP_PORT) || 587;
        const user = process.env.SMTP_USER;

        this.logger.log(`Initializing MailService with Host: ${host}, Port: ${port}, User: ${user ? '***' : 'None'}`);

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendVerificationEmail(email: string, token: string) {
        const url = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;

        this.logger.log(`Attempting to send verification email to: ${email}`);

        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            this.logger.warn('SMTP credentials not found. Logging email URL instead.');
            this.logger.log(`Verification URL for ${email}: ${url}`);
            return;
        }

        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM || '"FlashUp App" <no-reply@flashup.com>',
                to: email,
                subject: 'Xác thực tài khoản FlashUp',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Xác thực tài khoản FlashUp</h2>
                        <p>Cảm ơn bạn đã đăng ký tài khoản tại FlashUp. Vui lòng nhấp vào nút bên dưới để xác thực email của bạn:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${url}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Xác thực ngay</a>
                        </div>
                        <p style="font-size: 12px; color: #666;">Nếu nút trên không hoạt động, hãy copy đường dẫn sau và dán vào trình duyệt:</p>
                        <p style="font-size: 12px; color: #666;">${url}</p>
                    </div>
                `,
            });
            this.logger.log(`Verification email sent to ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${email}`, error);
            // Fallback for dev: log the URL
            this.logger.log(`[FALLBACK] Verification URL for ${email}: ${url}`);
        }
    }

    async sendPasswordResetEmail(email: string, token: string) {
        const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        this.logger.log(`Attempting to send password reset email to: ${email}`);

        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            this.logger.warn('SMTP credentials not found. Logging reset URL instead.');
            this.logger.log(`Password Reset URL for ${email}: ${url}`);
            return;
        }

        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM || '"FlashUp App" <no-reply@flashup.com>',
                to: email,
                subject: 'Đặt lại mật khẩu FlashUp',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Đặt lại mật khẩu</h2>
                        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản FlashUp. Vui lòng nhấp vào nút bên dưới để đặt lại mật khẩu của bạn:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${url}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Đặt lại mật khẩu</a>
                        </div>
                        <p style="font-size: 12px; color: #666;">Link này sẽ hết hạn trong 1 giờ.</p>
                        <p style="font-size: 12px; color: #666;">Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>
                        <p style="font-size: 12px; color: #666;">${url}</p>
                    </div>
                `,
            });
            this.logger.log(`Password reset email sent to ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send password reset email to ${email}`, error);
            this.logger.log(`[FALLBACK] Password Reset URL for ${email}: ${url}`);
        }
    }
}
