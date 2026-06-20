import { useEffect, useState } from 'react';

export function useLocalStorage(key: string, defaultValue: string) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) setValue(stored);
  }, [key]);

  const updateValue = (nextValue: string) => {
    setValue(nextValue);
    localStorage.setItem(key, nextValue);
  };

  return [value, updateValue] as const;
}
