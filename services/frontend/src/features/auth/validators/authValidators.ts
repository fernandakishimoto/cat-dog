import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'AUTH_LOGIN:validationRequired')
    .email('AUTH_LOGIN:validationEmailFormat'),
  password: z
    .string()
    .min(1, 'AUTH_LOGIN:validationRequired')
    .min(8, 'AUTH_LOGIN:validationPasswordMinLength'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'AUTH_REGISTER:validationRequired')
      .min(2, 'AUTH_REGISTER:validationNameMinLength'),
    email: z
      .string()
      .min(1, 'AUTH_REGISTER:validationRequired')
      .email('AUTH_REGISTER:validationEmailFormat'),
    password: z
      .string()
      .min(1, 'AUTH_REGISTER:validationRequired')
      .min(8, 'AUTH_REGISTER:validationPasswordMinLength'),
    confirmPassword: z
      .string()
      .min(1, 'AUTH_REGISTER:validationRequired'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'AUTH_REGISTER:validationPasswordMatch',
    path: ['confirmPassword'],
  });

export type LoginFormValuesType = z.infer<typeof loginSchema>;
export type RegisterFormValuesType = z.infer<typeof registerSchema>;
