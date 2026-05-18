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
import AuthRoleSelect from '@/components/auth/AuthRoleSelect';
import PasswordVisibilityToggle from '@/components/ui/PasswordVisibilityToggle';
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';
import { getApiErrorMessage } from '@/utils/errors';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'sales']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'sales' },
  });

  const selectedRole = watch('role');
  const password = watch('password') ?? '';

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await authApi.register(data);
      if (res.data) {
        setAuth(res.data.user, res.data.token);
        toast.success(`Welcome aboard, ${res.data.user.name}!`);
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Registration failed. Please try again.'));
    }
  };

  return (
    <AuthLayout
      variant="register"
      title="Create Account"
      subtitle="Join with Google or set up email access in under a minute."
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      <AuthSocialButtons mode="register" role={selectedRole} />

      <AuthDivider label="or register with email" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="register-form">
        <AuthOutlinedInput
          label="Full Name"
          id="register-name"
          autoComplete="name"
          error={errors.name?.message}
          inputClassName="auth-input-register"
          {...register('name')}
        />

        <AuthOutlinedInput
          label="Email"
          type="email"
          id="register-email"
          autoComplete="email"
          error={errors.email?.message}
          inputClassName="auth-input-register"
          {...register('email')}
        />

        <div className="space-y-2">
          <AuthOutlinedInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="register-password"
            error={errors.password?.message}
            inputClassName="auth-input-register"
            rightElement={
              <PasswordVisibilityToggle
                visible={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                id="register-password-toggle"
              />
            }
            {...register('password')}
          />
          <PasswordStrengthMeter password={password} />
        </div>

        <AuthRoleSelect value={selectedRole} onChange={(r) => setValue('role', r)} />

        <button
          type="submit"
          disabled={isSubmitting}
          id="register-submit"
          className="
            w-full py-3.5 px-6 rounded-xl text-sm font-semibold text-white mt-2
            bg-gradient-to-r from-rose-600 via-red-600 to-orange-600
            bg-[length:200%_auto] auth-shine-btn
            disabled:opacity-60 disabled:cursor-not-allowed
            active:scale-[0.98] auth-cta-register
          "
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
