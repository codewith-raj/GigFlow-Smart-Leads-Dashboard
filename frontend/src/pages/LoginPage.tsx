import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import AuthLayout from '@/layouts/AuthLayout';
import AuthOutlinedInput from '@/components/auth/AuthOutlinedInput';
import AuthDivider from '@/components/auth/AuthDivider';
import AuthSocialButtons from '@/components/auth/AuthSocialButtons';
import PasswordVisibilityToggle from '@/components/ui/PasswordVisibilityToggle';
import { getApiErrorMessage } from '@/utils/errors';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await authApi.login(data);
      if (res.data) {
        setAuth(res.data.user, res.data.token);
        toast.success(`Welcome back, ${res.data.user.name}!`, { id: 'login-success' });
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Login failed. Please try again.'), { id: 'login-error' });
    }
  };

  return (
    <AuthLayout
      variant="login"
      title="Sign In"
      subtitle="Use your email or continue with Google."
      footerText="Don't have an account?"
      footerLinkText="Create one"
      footerLinkTo="/register"
    >
      <AuthSocialButtons mode="login" />

      <AuthDivider label="or sign in with email" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="login-form">
        <AuthOutlinedInput
          label="Email"
          type="email"
          id="login-email"
          autoComplete="email"
          error={errors.email?.message}
          inputClassName="auth-input-login"
          {...register('email')}
        />

        <AuthOutlinedInput
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="login-password"
          autoComplete="current-password"
          error={errors.password?.message}
          inputClassName="auth-input-login"
          rightElement={
            <PasswordVisibilityToggle
              visible={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              id="login-password-toggle"
            />
          }
          {...register('password')}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          id="login-submit"
          className="
            w-full py-3.5 px-6 rounded-xl text-sm font-semibold
            text-slate-950 bg-gradient-to-r from-sky-100 via-white to-sky-50
            hover:from-white hover:to-sky-100
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/20
            active:scale-[0.98] auth-cta-login
          "
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
