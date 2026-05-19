import { User } from '../models/User';
import { AppError } from '../middlewares/errorHandler';
import { generateToken } from '../utils/jwt';
import { env } from '../config/env';
import { RegisterInput, LoginInput, GoogleAuthInput } from '../validations/auth.validation';
import { IUser, UserRole } from '../types';
import { verifyGoogleIdToken } from '../utils/google';

export class AuthService {
  async register(input: RegisterInput): Promise<{ user: IUser; token: string }> {
    if (input.role === 'admin' && !env.ALLOW_ADMIN_REGISTRATION) {
      throw new AppError(
        'Admin registration is disabled. Contact your administrator.',
        403
      );
    }

    const existing = await User.findOne({ email: input.email });
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const user = await User.create(input);
    const token = generateToken(user._id.toString(), user.email, user.role);

    return { user, token };
  }

  async login(input: LoginInput): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email: input.email }).select('+password');

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.password) {
      throw new AppError('This account uses Google sign-in. Continue with Google.', 401);
    }

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user._id.toString(), user.email, user.role);
    return { user, token };
  }

  async getMe(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async googleAuth(input: GoogleAuthInput): Promise<{ user: IUser; token: string; isNewUser: boolean }> {
    const payload = await verifyGoogleIdToken(input.credential);
    const googleId = payload.sub!;
    const email = payload.email!.toLowerCase();
    const name = payload.name?.trim() || email.split('@')[0];
    const avatar = payload.picture;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    let isNewUser = false;

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = user.password ? 'local' : 'google';
        if (avatar) user.avatar = avatar;
        await user.save();
      }
    } else {
      const role: UserRole = input.role ?? 'sales';
      if (role === 'admin' && !env.ALLOW_ADMIN_REGISTRATION) {
        throw new AppError(
          'Admin registration is disabled. Contact your administrator.',
          403
        );
      }

      user = await User.create({
        name,
        email,
        googleId,
        avatar,
        authProvider: 'google',
        role,
      });
      isNewUser = true;
    }

    const token = generateToken(user._id.toString(), user.email, user.role);
    return { user, token, isNewUser };
  }
}

export const authService = new AuthService();
