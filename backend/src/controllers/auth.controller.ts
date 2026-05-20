import { Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import {
  RegisterInput,
  LoginInput,
  GoogleAuthInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from '../validations/auth.validation';

export class AuthController {
  async register(
    req: AuthenticatedRequest & { body: RegisterInput },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { user, token } = await authService.register(req.body);
      sendSuccess(res, { user, token }, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  }

  async login(
    req: AuthenticatedRequest & { body: LoginInput },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { user, token } = await authService.login(req.body);
      sendSuccess(res, { user, token }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async googleAuth(
    req: AuthenticatedRequest & { body: GoogleAuthInput },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { user, token, isNewUser } = await authService.googleAuth(req.body);
      sendSuccess(
        res,
        { user, token, isNewUser },
        isNewUser ? 'Account created with Google' : 'Signed in with Google'
      );
    } catch (error) {
      next(error);
    }
  }

  async getMe(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await authService.getMe(req.user!.userId);
      sendSuccess(res, { user }, 'User fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(
    req: AuthenticatedRequest & { body: UpdateProfileInput },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await authService.updateProfile(req.user!.userId, req.body);
      sendSuccess(res, { user }, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async changePassword(
    req: AuthenticatedRequest & { body: ChangePasswordInput },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await authService.changePassword(req.user!.userId, req.body);
      sendSuccess(res, null, 'Password updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
