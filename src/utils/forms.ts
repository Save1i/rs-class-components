import { z } from 'zod';
import type { FormSchemaValues, FormSubmission } from '../types/forms';

export const IMAGE_MAX_SIZE = 2 * 1024 * 1024;
export const IMAGE_TYPES = ['image/png', 'image/jpeg'] as const;

export const DEFAULT_COUNTRIES = ['Belarus', 'Germany', 'Poland', 'Portugal', 'Spain', 'United States'] as const;

export function getPasswordStrength(password: string) {
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

  const score = [hasNumber, hasUppercase, hasLowercase, hasSpecialCharacter].filter(Boolean).length;

  return {
    hasNumber,
    hasUppercase,
    hasLowercase,
    hasSpecialCharacter,
    score,
    label: `${score}/4`,
  };
}

export function validateImageFile(file: File | undefined | null) {
  if (!file) {
    return 'Please upload a PNG or JPEG image';
  }

  const fileName = file.name.toLowerCase();
  const isKnownType = IMAGE_TYPES.includes(file.type as (typeof IMAGE_TYPES)[number]);
  const isKnownExtension = fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg');

  if (!isKnownType && !isKnownExtension) {
    return 'Only PNG and JPEG files are allowed';
  }

  if (file.size > IMAGE_MAX_SIZE) {
    return 'Image must be 2 MB or smaller';
  }

  return null;
}

export function fileLikeToFile(value: unknown) {
  if (typeof File !== 'undefined' && value instanceof File) {
    return value;
  }

  if (typeof FileList !== 'undefined' && value instanceof FileList) {
    return value.item(0) ?? null;
  }

  if (Array.isArray(value) && typeof File !== 'undefined' && value[0] instanceof File) {
    return value[0];
  }

  return null;
}

export function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Unable to read file'));
    };

    reader.onerror = () => reject(new Error('Unable to read file'));
    reader.readAsDataURL(file);
  });
}

export function createFormSchema(countries: readonly string[]) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, 'Name is required')
        .refine((value) => value[0] === value[0]?.toUpperCase(), 'Name should start with an uppercase letter'),
      country: z.string().trim().min(1, 'Country is required'),
      password: z.string().min(1, 'Password is required'),
      confirmPassword: z.string().min(1, 'Confirm your password'),
      imageFile: z.unknown(),
    })
    .superRefine((values, ctx) => {
      if (values.password !== values.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ['confirmPassword'],
          message: 'Passwords must match',
        });
      }

      if (!countries.includes(values.country)) {
        ctx.addIssue({
          code: "custom",
          path: ['country'],
          message: 'Choose a country from the list',
        });
      }

      const file = fileLikeToFile(values.imageFile);
      const imageError = validateImageFile(file);

      if (imageError) {
        ctx.addIssue({
          code: "custom",
          path: ['imageFile'],
          message: imageError,
        });
      }
    });
}

export function buildSubmission(
  values: FormSchemaValues,
  imageSrc: string,
  imageName: string,
  formKind: 'uncontrolled' | 'hook-form'
): FormSubmission {
  return {
    id: crypto.randomUUID(),
    formKind,
    name: values.name.trim(),
    country: values.country.trim(),
    imageSrc,
    imageName,
    passwordStrengthLabel: getPasswordStrength(values.password).label,
    createdAt: new Date().toISOString(),
  };
}
