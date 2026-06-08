export type FormKind = 'uncontrolled' | 'hook-form';

export interface FormValues {
  name: string;
  country: string;
  password: string;
  confirmPassword: string;
  imageFile: File | FileList | null;
}

export interface FormSubmission {
  id: string;
  formKind: FormKind;
  name: string;
  country: string;
  imageSrc: string;
  imageName: string;
  passwordStrengthLabel: string;
  createdAt: string;
}

export interface FormSchemaValues {
  name: string;
  country: string;
  password: string;
  confirmPassword: string;
  imageFile: unknown;
}
