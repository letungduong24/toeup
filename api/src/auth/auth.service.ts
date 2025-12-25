import { Injectable, UnauthorizedException, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { validatePassword } from 'src/lib/bcrypt.util';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  async validateUser(signInRequest: { email: string; password: string }) {
    try {
      this.logger.debug(`Validating user: ${signInRequest.email}`);
      const user = await this.usersService.findByEmail(signInRequest.email);

      if (!user) {
        this.logger.warn(`User not found: ${signInRequest.email}`);
        return null;
      }

      // Debug: Check password fields
      if (!user.password) {
        this.logger.error('User password is null or undefined');
        return null;
      }

      this.logger.debug(`Password hash length: ${user.password?.length}, starts with: ${user.password?.substring(0, 7)}`);
      this.logger.debug(`Input password length: ${signInRequest.password?.length}`);

      const isPasswordValid = await validatePassword(
        signInRequest.password,
        user.password
      );

      if (!isPasswordValid) {
        this.logger.error(`Password validation failed for user: ${signInRequest.email}`);
        this.logger.error(`Stored password type: ${typeof user.password}`);
        this.logger.error(`Stored password length: ${user.password?.length}`);
        this.logger.error(`Stored password starts with: ${user.password?.substring(0, 30)}`);
        return null;
      }

      this.logger.debug(`Password validation successful for user: ${signInRequest.email}`);
      const { password, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch (error) {
      this.logger.error('Error validating user:', error);
      return null;
    }
  }

  async login(user: any): Promise<string> {
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return access_token;
  }

  async signUp(signUpRequest: any) {
    const user = await this.usersService.create(signUpRequest);
    if (!user) {
      throw new UnauthorizedException('Không thể tạo tài khoản');
    }
    const access_token = this.jwtService.sign({ sub: user.id, email: user.email });

    // Send verification email
    try {
      await this.sendVerificationEmail(user.id);
    } catch (error) {
      this.logger.error('Failed to send verification email on signup', error);
    }

    return {
      user,
      access_token,
    }
  }

  async validateGoogleUser(googleUser: any) {
    const { email, firstName, lastName, displayName, picture, googleId } = googleUser;

    // 1. Check if user exists by email
    let user: any = await this.usersService.findByEmail(email);

    if (user) {
      // 2. If user exists but has no googleId, link it (optional, or just logic)
      if (!user.googleId) {
        await this.usersService.update(user.id, { googleId, avatarUrl: picture });
      }

      // Auto-verify if logged in via Google
      if (!user.isVerified) {
        await this.usersService.update(user.id, { isVerified: true });
      }
    } else {
      // 3. Create new user
      const name = displayName || `${firstName || ''} ${lastName || ''}`.trim();

      user = await this.usersService.create({
        email,
        name,
        password: '',
        googleId,
        avatarUrl: picture,
        isVerified: true,
      } as any);
    }

    return user;
  }


  async sendVerificationEmail(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    // Rate limiting: 3 requests per day
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today

    // Check if last request was on a different day, reset counter
    if (user.lastVerificationRequest && user.lastVerificationRequest < today) {
      await this.usersService.update(userId, { verificationRequests: 0 });
      user.verificationRequests = 0; // update local object
    }

    if (user.verificationRequests >= 3) {
      throw new UnauthorizedException('Bạn đã gửi quá nhiều yêu cầu xác thực trong ngày. Vui lòng thử lại vào ngày mai.');
    }

    // Generate token
    const token = this.jwtService.sign({ sub: user.id, purpose: 'verify-email' }, { expiresIn: '1h' });
    const expires = new Date(now.getTime() + 3600000); // 1 hour

    // Save token and increment stats to DB
    await this.usersService.update(userId, {
      verificationToken: token,
      verificationExpires: expires,
      verificationRequests: (user.verificationRequests || 0) + 1,
      lastVerificationRequest: now
    });

    // Send email
    await this.mailService.sendVerificationEmail(user.email, token);
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.purpose !== 'verify-email') throw new UnauthorizedException('Invalid token');

      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');

      // Verify token matches DB
      if (user.verificationToken !== token) {
        throw new UnauthorizedException('Mã xác thực không hợp lệ hoặc đã được sử dụng.');
      }

      // Check expiry
      if (user.verificationExpires && new Date() > user.verificationExpires) {
        throw new UnauthorizedException('Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.');
      }

      await this.usersService.update(user.id, {
        isVerified: true,
        verificationToken: null,
        verificationExpires: null
      });
      return user;
    } catch (e) {
      this.logger.error('Verification failed', e);
      // Better error message for user
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new UnauthorizedException('Đường dẫn xác thực không hợp lệ hoặc đã hết hạn.');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Security: Don't reveal if email exists, or reveal it? Usually reveal is bad, but for UX it might be needed.
      // Based on previous code, we revealed it.
      throw new NotFoundException('Email không tồn tại trong hệ thống');
    }

    if (user.googleId && !user.password) {
      // Inform user they signed up with Google
      throw new UnauthorizedException('Tài khoản này được đăng ký bằng Google. Vui lòng đăng nhập bằng Google.');
    }

    const now = new Date();
    // Generate simple token (random string) or JWT
    // Using JWT for convenience, valid for 1 hour
    const token = this.jwtService.sign({ sub: user.id, purpose: 'reset-password' }, { expiresIn: '1h' });
    const expires = new Date(now.getTime() + 3600000); // 1 hour

    await this.usersService.update(user.id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });

    await this.mailService.sendPasswordResetEmail(user.email, token);
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      // 1. Verify JWT first
      const payload = this.jwtService.verify(token);
      if (payload.purpose !== 'reset-password') throw new UnauthorizedException('Invalid token');

      // 2. Check DB match
      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');

      if (user.resetPasswordToken !== token) {
        throw new UnauthorizedException('Invalid or used token');
      }

      // Check expiry (redundant if JWT checks it, but good for safety if we used random string)
      if (user.resetPasswordExpires && new Date() > user.resetPasswordExpires) {
        throw new UnauthorizedException('Token expired');
      }

      // 3. Update password
      // Hasu password - logic duplicated from UsersService or utilize a helper?
      // Since validatePassword uses bcrypt, we should hash it. 
      // Ideally UsersService should handle hashing on update if password is changed, 
      // OR we import hash here. Let's use bcrypt here since we imported validatePassword.
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.usersService.update(user.id, {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });

      return user;
    } catch (e) {
      this.logger.error('Reset password failed', e);
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }
}
