import { useMemo, useState } from 'react';
import { useForm, useWatch, type FieldError, type Resolver } from 'react-hook-form';
import type { FormSubmission, FormValues } from '../../types/forms';
import { buildSubmission, createFormSchema, fileLikeToFile, fileToBase64 } from '../../utils/forms';
import { FieldError as FieldErrorMessage } from './FieldError';
import { PasswordStrength } from './PasswordStrength';

interface ControlledFormProps {
  countries: string[];
  onClose: () => void;
  onSubmitSuccess: (submission: FormSubmission) => void;
}

function mapErrorsToFormState(issues: Array<{ path: ReadonlyArray<PropertyKey>; message: string }>) {
  return issues.reduce<Record<string, FieldError>>((acc, issue) => {
    const name = String(issue.path[0] ?? 'form');

    if (!acc[name]) {
      acc[name] = {
        type: 'manual',
        message: issue.message,
      };
    }

    return acc;
  }, {});
}

export default function ControlledForm({ countries, onClose, onSubmitSuccess }: ControlledFormProps) {
  const schema = useMemo(() => createFormSchema(countries), [countries]);

  const [showPassword, SetshowPassword] = useState<string>('password')

  const onClickToshowPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(showPassword == "password") {
      SetshowPassword("text");
    }else {
      SetshowPassword("password");
    }
  }

  const resolver: Resolver<FormValues> = async (values) => {
    const parsed = schema.safeParse(values);

    if (parsed.success) {
      return {
        values: values as never,
        errors: {} as never,
      };
    }

    return {
      values: {} as never,
      errors: mapErrorsToFormState(parsed.error.issues) as never,
    };
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      country: '',
      password: '',
      confirmPassword: '',
      imageFile: null,
    },
    resolver,
  });

  const passwordValue = useWatch({ control, name: 'password' }) ?? '';

  const submitForm = handleSubmit(async (values) => {
    const file = fileLikeToFile(values.imageFile);

    if (!file) {
      return;
    }

    const imageSrc = await fileToBase64(file);

    onSubmitSuccess(buildSubmission(values, imageSrc, file.name, 'hook-form'));
    reset();
    onClose();
  });

  return (
    <form className="form" autoComplete="off" onSubmit={submitForm}>
      <div className="form__grid">
        <div className="field">
          <label className="field__label" htmlFor="hook-name">
            Name
          </label>
          <input id="hook-name" className="field__control" type="text" {...register('name')} />
          <FieldErrorMessage message={errors.name?.message} />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="hook-country">
            Country
          </label>
          <select className='field__control' {...register("country", {required: true})}>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          <FieldErrorMessage message={errors.country?.message} />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="hook-imageFile">
            Profile image
          </label>
          <input
            id="hook-imageFile"
            className="field__control"
            type="file"
            accept="image/png,image/jpeg"
            {...register('imageFile')}
          />
          <FieldErrorMessage message={errors.imageFile?.message} />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="hook-password">
            Password
          </label>
          <input
            id="hook-password"
            className="field__control"
            autoComplete="new-password"
            type={showPassword}
            {...register('password')}
          />
          <button className='password-show' onClick={onClickToshowPassword}>👁️</button>
          <FieldErrorMessage message={errors.password?.message} />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="hook-confirmPassword">
            Confirm password
          </label>
          <input
            id="hook-confirmPassword"
            className="field__control"
            autoComplete="new-password"
            type="password"
            {...register('confirmPassword')}
          />
          <FieldErrorMessage message={errors.confirmPassword?.message} />
        </div>
      </div>

      <PasswordStrength password={passwordValue} />

      <div className="form__actions">
        <button className="search-button" type="button" onClick={onClose}>
          Cancel
        </button>
        <button className="search-button" type="submit" disabled={!isValid || isSubmitting}>
          Submit RHF
        </button>
      </div>
    </form>
  );
}
