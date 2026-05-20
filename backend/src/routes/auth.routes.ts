import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validations/auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), authController.register.bind(authController));
router.post('/login', validate(loginSchema), authController.login.bind(authController));
router.post('/google', validate(googleAuthSchema), authController.googleAuth.bind(authController));
router.get('/me', authenticate, authController.getMe.bind(authController));
router.patch(
  '/profile',
  authenticate,
  validate(updateProfileSchema),
  authController.updateProfile.bind(authController)
);
router.patch(
  '/password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword.bind(authController)
);

export default router;
