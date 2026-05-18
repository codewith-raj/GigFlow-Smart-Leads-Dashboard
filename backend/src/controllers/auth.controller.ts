import { Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { RegisterInput, LoginInput, GoogleAuthInput } from '../validations/auth.validation';

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
}

export const authController = new AuthController();
