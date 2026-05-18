import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import AuthLayout from '@/layouts/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { APP_FULL_NAME, ROLE_DESCRIPTIONS, ROLE_LABELS } from '@/constants';
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

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await authApi.register(data);
      if (res.data) {
        setAuth(res.data.user, res.data.token);
        toast.success(`Account created! Welcome, ${res.data.user.name}!`);
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Registration failed. Please try again.'));
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle={`Join your team on ${APP_FULL_NAME}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="register-form">
        <Input
          label="Full Name"
          placeholder="Your full name"
          id="register-name"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.name?.message}
          autoComplete="name"
          {...register('name')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="you@company.com"
          id="register-email"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          autoComplete="email"
          {...register('email')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Minimum 6 characters"
          id="register-password"
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-slate-200 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Account Role
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(['sales', 'admin'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setValue('role', role)}
                className={`
                  py-3 px-4 rounded-xl text-left border transition-all duration-200
                  ${
                    selectedRole === role
                      ? 'bg-violet-600/20 border-violet-500/40 ring-1 ring-violet-500/30'
                      : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                  }
                `}
              >
                <span
                  className={`block text-sm font-semibold capitalize ${
                    selectedRole === role ? 'text-violet-300' : 'text-slate-300'
                  }`}
                >
                  {ROLE_LABELS[role]}
                </span>
                <span className="block text-[11px] text-slate-500 mt-1 leading-snug">
                  {ROLE_DESCRIPTIONS[role]}
                </span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-600">
            Admin registration may be restricted in production deployments.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full mt-4"
          id="register-submit"
        >
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-6 pt-6 border-t border-slate-700/40">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
