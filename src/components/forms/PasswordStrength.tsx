import { getPasswordStrength } from '../../utils/forms';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = getPasswordStrength(password);

  return (
    <div className="password-strength" aria-label={`Password strength ${strength.label}`}>
      <span className="password-strength__label">Strength: {strength.label}</span>
      <ul className="password-strength__list">
        <li className={strength.hasNumber ? 'is-met' : ''}>1 number</li>
        <li className={strength.hasUppercase ? 'is-met' : ''}>1 uppercase</li>
        <li className={strength.hasLowercase ? 'is-met' : ''}>1 lowercase</li>
        <li className={strength.hasSpecialCharacter ? 'is-met' : ''}>1 special character</li>
      </ul>
    </div>
  );
}
