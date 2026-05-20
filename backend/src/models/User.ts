import mongoose, { Schema, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
      required: function (this: IUser) {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    role: {
      type: String,
      enum: ['admin', 'sales'],
      default: 'sales',
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [30, 'Phone cannot exceed 30 characters'],
    },
    jobTitle: {
      type: String,
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company cannot exceed 100 characters'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [120, 'Location cannot exceed 120 characters'],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const r = ret as Record<string, unknown>;
        delete r['password'];
        return r;
      },
    },
  }
);

UserSchema.pre<HydratedDocument<IUser>>('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods['comparePassword'] = async function (
  this: { password?: string },
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
