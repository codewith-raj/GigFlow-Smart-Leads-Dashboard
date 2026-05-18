import { User } from '../models/User';
import { AppError } from '../middlewares/errorHandler';
import { generateToken } from '../utils/jwt';
import { env } from '../config/env';
import { RegisterInput, LoginInput } from '../validations/auth.validation';
import { IUser } from '../types';

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
    // Explicitly select password since it's excluded by default
    const user = await User.findOne({ email: input.email }).select('+password');

    if (!user) {
      throw new AppError('Invalid email or password', 401);
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
}

export const authService = new AuthService();
