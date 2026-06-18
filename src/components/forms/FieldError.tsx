interface FieldErrorProps {
  message?: string;
}

export function FieldError({ message }: FieldErrorProps) {
  return <p className="field-error">{message ?? '\u00a0'}</p>;
}
