import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  User as UserIcon,
  Mail,
  Phone,
  Briefcase,
  Building2,
  MapPin,
  Shield,
  Lock,
  Calendar,
  KeyRound,
} from 'lucide-react';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import { ROLE_LABELS } from '@/constants';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Loader from '@/components/ui/Loader';
import UserAvatar from '@/components/profile/UserAvatar';
import PasswordVisibilityToggle from '@/components/ui/PasswordVisibilityToggle';
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';
import { getApiErrorMessage } from '@/utils/errors';
import {
  canChangePassword,
  formatLastUpdated,
  formatMemberSince,
  profileCompletionPercent,
} from '@/utils/userDisplay';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(30).optional().or(z.literal('')),
  jobTitle: z.string().max(100).optional().or(z.literal('')),
  company: z.string().max(100).optional().or(z.literal('')),
  location: z.string().max(120).optional().or(z.literal('')),
  bio: z.string().max(500).optional().or(z.literal('')),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters').max(128),
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: 'New password must differ from current password',
    path: ['newPassword'],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const ProfilePage: React.FC = () => {
  const { user, token, updateUser, setAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const { data: meData, isLoading: meLoading } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.getMe,
    staleTime: 30_000,
  });

  const profileUser = meData?.data?.user ?? user;
  const completion = profileCompletionPercent(profileUser);
  const allowPassword = canChangePassword(profileUser);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      jobTitle: '',
      company: '',
      location: '',
      bio: '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPasswordWatch = passwordForm.watch('newPassword') ?? '';

  useEffect(() => {
    if (!profileUser) return;
    profileForm.reset({
      name: profileUser.name ?? '',
      email: profileUser.email ?? '',
      phone: profileUser.phone ?? '',
      jobTitle: profileUser.jobTitle ?? '',
      company: profileUser.company ?? '',
      location: profileUser.location ?? '',
      bio: profileUser.bio ?? '',
    });
  }, [profileUser, profileForm]);

  const profileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (res) => {
      if (res.data?.user && token) {
        setAuth(res.data.user, token);
      } else if (res.data?.user) {
        updateUser(res.data.user);
      }
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Profile saved successfully');
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to update profile')),
  });

  const passwordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      passwordForm.reset();
      toast.success('Password updated successfully');
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to change password')),
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    profileMutation.mutate({
      ...data,
      phone: data.phone || undefined,
      jobTitle: data.jobTitle || undefined,
      company: data.company || undefined,
      location: data.location || undefined,
      bio: data.bio || undefined,
    });
  };

  if (meLoading && !profileUser) {
    return <Loader text="Loading profile..." />;
  }

  if (!profileUser) {
    return null;
  }

  const authLabel =
    profileUser.authProvider === 'google' ? 'Google sign-in' : 'Email & password';

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Hero */}
      <section className="panel-elevated overflow-hidden rounded-2xl border border-slate-700/40">
        <div className="h-20 bg-gradient-to-r from-red-600/20 via-slate-800/40 to-violet-600/10 sm:h-24" />
        <div className="relative px-4 pb-5 sm:px-6 sm:pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
              <UserAvatar user={profileUser} size="xl" showStatus className="-mt-1" />
              <div className="min-w-0 pb-1">
                <h1 className="truncate text-xl font-bold text-slate-50 sm:text-2xl">
                  {profileUser.name}
                </h1>
                <p className="mt-0.5 truncate text-sm text-slate-400">{profileUser.email}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge
                    label={ROLE_LABELS[profileUser.role]}
                    colorClass="bg-red-500/15 text-red-300 border-red-500/30"
                    size="sm"
                  />
                  <span className="text-xs text-slate-500">{authLabel}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <div className="w-full sm:w-48">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-slate-500">Profile complete</span>
                  <span className="font-medium text-slate-300">{completion}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Updated {formatLastUpdated(profileUser.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Sidebar summary */}
        <aside className="space-y-4 lg:order-1">
          <div className="panel-elevated rounded-2xl border border-slate-700/40 p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-slate-200">Account summary</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3 text-slate-400">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>
                  Member since{' '}
                  <span className="block font-medium text-slate-300">
                    {formatMemberSince(profileUser.createdAt)}
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>
                  Role{' '}
                  <span className="block font-medium text-slate-300">
                    {ROLE_LABELS[profileUser.role]}
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>
                  Sign-in{' '}
                  <span className="block font-medium text-slate-300">{authLabel}</span>
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-700/50 bg-slate-900/30 p-4 text-xs leading-relaxed text-slate-500">
            Keep your profile up to date so teammates recognize you on shared leads and exports.
          </div>
        </aside>

        {/* Forms */}
        <div className="space-y-6 lg:col-span-2 lg:order-2">
          <section className="panel-elevated rounded-2xl border border-slate-700/40 p-4 sm:p-6">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-700/40 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <UserIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-100">Personal information</h2>
                <p className="text-xs text-slate-500">Update how you appear across GigFlow</p>
              </div>
            </div>

            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5"
              id="profile-form"
            >
              <div className="sm:col-span-2">
                <Input
                  label="Full name"
                  leftIcon={<UserIcon className="h-4 w-4" />}
                  error={profileForm.formState.errors.name?.message}
                  {...profileForm.register('name')}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Email address"
                  type="email"
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={profileForm.formState.errors.email?.message}
                  {...profileForm.register('email')}
                />
              </div>
              <Input
                label="Phone"
                type="tel"
                placeholder="+1 555 000 0000"
                leftIcon={<Phone className="h-4 w-4" />}
                error={profileForm.formState.errors.phone?.message}
                {...profileForm.register('phone')}
              />
              <Input
                label="Job title"
                placeholder="Sales Executive"
                leftIcon={<Briefcase className="h-4 w-4" />}
                error={profileForm.formState.errors.jobTitle?.message}
                {...profileForm.register('jobTitle')}
              />
              <Input
                label="Company"
                placeholder="Acme Inc."
                leftIcon={<Building2 className="h-4 w-4" />}
                error={profileForm.formState.errors.company?.message}
                {...profileForm.register('company')}
              />
              <Input
                label="Location"
                placeholder="City, Country"
                leftIcon={<MapPin className="h-4 w-4" />}
                error={profileForm.formState.errors.location?.message}
                {...profileForm.register('location')}
              />
              <div className="sm:col-span-2">
                <Textarea
                  label="Bio"
                  placeholder="Short intro for your team (max 500 characters)"
                  hint={`${profileForm.watch('bio')?.length ?? 0}/500 characters`}
                  error={profileForm.formState.errors.bio?.message}
                  rows={4}
                  {...profileForm.register('bio')}
                />
              </div>
              <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-11 w-full sm:w-auto"
                  onClick={() => profileForm.reset()}
                  disabled={profileMutation.isPending}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="min-h-11 w-full sm:w-auto"
                  isLoading={profileMutation.isPending}
                >
                  Save changes
                </Button>
              </div>
            </form>
          </section>

          <section className="panel-elevated rounded-2xl border border-slate-700/40 p-4 sm:p-6">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-700/40 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-100">Security</h2>
                <p className="text-xs text-slate-500">Change your account password</p>
              </div>
            </div>

            {!allowPassword ? (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-4 text-sm text-amber-200/90">
                You signed in with Google. Password changes are managed through your Google account.
              </div>
            ) : (
              <form
                onSubmit={passwordForm.handleSubmit((data) => passwordMutation.mutate(data))}
                className="max-w-lg space-y-4"
                id="password-form"
              >
                <Input
                  label="Current password"
                  type={showCurrentPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  error={passwordForm.formState.errors.currentPassword?.message}
                  rightIcon={
                    <PasswordVisibilityToggle
                      visible={showCurrentPw}
                      onToggle={() => setShowCurrentPw((v) => !v)}
                    />
                  }
                  {...passwordForm.register('currentPassword')}
                />
                <Input
                  label="New password"
                  type={showNewPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  error={passwordForm.formState.errors.newPassword?.message}
                  rightIcon={
                    <PasswordVisibilityToggle
                      visible={showNewPw}
                      onToggle={() => setShowNewPw((v) => !v)}
                    />
                  }
                  {...passwordForm.register('newPassword')}
                />
                <PasswordStrengthMeter password={newPasswordWatch} />
                <Input
                  label="Confirm new password"
                  type={showConfirmPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  error={passwordForm.formState.errors.confirmPassword?.message}
                  rightIcon={
                    <PasswordVisibilityToggle
                      visible={showConfirmPw}
                      onToggle={() => setShowConfirmPw((v) => !v)}
                    />
                  }
                  {...passwordForm.register('confirmPassword')}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="min-h-11 w-full sm:w-auto"
                  isLoading={passwordMutation.isPending}
                >
                  Update password
                </Button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
