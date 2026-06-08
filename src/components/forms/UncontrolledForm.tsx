import { useId, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { FormSubmission } from '../../types/forms';
import { buildSubmission, createFormSchema, fileLikeToFile, fileToBase64 } from '../../utils/forms';
import { FieldError } from './FieldError';
import { PasswordStrength } from './PasswordStrength';

interface UncontrolledFormProps {
  countries: string[];
  onClose: () => void;
  onSubmitSuccess: (submission: FormSubmission) => void;
}

function mapIssuesToErrors(issues: { path: ReadonlyArray<PropertyKey>; message: string }[]) {
  return issues.reduce<Record<string, string>>((acc, issue) => {
    const key = String(issue.path[0] ?? 'form');

    if (!acc[key]) {
      acc[key] = issue.message;
    }

    return acc;
  }, {});
}

export default function UncontrolledForm({ countries, onClose, onSubmitSuccess }: UncontrolledFormProps) {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const schema = createFormSchema(countries);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const fileInput = event.currentTarget.elements.namedItem('imageFile');
    const selectedFile = fileInput instanceof HTMLInputElement ? fileInput.files?.item(0) ?? null : null;
    const rawValues = {
      name: String(formData.get('name') ?? ''),
      country: String(formData.get('country') ?? ''),
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
      imageFile: selectedFile ?? formData.get('imageFile'),
    };

    const parsed = schema.safeParse(rawValues);

    if (!parsed.success) {
      setErrors(mapIssuesToErrors(parsed.error.issues));
      return;
    }

    const file = fileLikeToFile(rawValues.imageFile);

    if (!file) {
      setErrors({ imageFile: 'Please upload a PNG or JPEG image' });
      return;
    }

    const imageSrc = await fileToBase64(file);

    onSubmitSuccess(buildSubmission(parsed.data, imageSrc, file.name, 'uncontrolled'));
    formRef.current?.reset();
    setPassword('');
    setErrors({});
    onClose();
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  return (
    <form ref={formRef} className="form" autoComplete="off" onSubmit={handleSubmit}>
      <div className="form__grid">
        <div className="field">
          <label className="field__label" htmlFor={`${formId}-name`}>
            Name
          </label>
          <input id={`${formId}-name`} className="field__control" name="name" type="text" />
          <FieldError message={errors.name} />
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${formId}-country`}>
            Country
          </label>
          <input
            id={`${formId}-country`}
            className="field__control"
            name="country"
            list={`${formId}-countries`}
            placeholder="Start typing..."
          />
          <datalist id={`${formId}-countries`}>
            {countries.map((country) => (
              <option key={country} value={country} />
            ))}
          </datalist>
          <FieldError message={errors.country} />
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${formId}-imageFile`}>
            Profile image
          </label>
          <input
            id={`${formId}-imageFile`}
            className="field__control"
            name="imageFile"
            type="file"
            accept="image/png,image/jpeg"
          />
          <FieldError message={errors.imageFile} />
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${formId}-password`}>
            Password
          </label>
          <input
            id={`${formId}-password`}
            className="field__control"
            name="password"
            autoComplete="new-password"
            type="password"
            onChange={handlePasswordChange}
          />
          <FieldError message={errors.password} />
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${formId}-confirmPassword`}>
            Confirm password
          </label>
          <input
            id={`${formId}-confirmPassword`}
            className="field__control"
            name="confirmPassword"
            autoComplete="new-password"
            type="password"
          />
          <FieldError message={errors.confirmPassword} />
        </div>
      </div>

      <PasswordStrength password={password} />

      <div className="form__actions">
        <button className="button button--ghost" type="button" onClick={onClose}>
          Cancel
        </button>
        <button className="button button--primary" type="submit">
          Submit uncontrolled
        </button>
      </div>
    </form>
  );
}
