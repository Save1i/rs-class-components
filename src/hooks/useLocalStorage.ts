import { useState } from 'react';

export function useLocalStorage(key: string, defaultValue: string) {
  const [value, setValue] = useState(() => localStorage.getItem(key) ?? defaultValue);

  const updateValue = (nextValue: string) => {
    setValue(nextValue);
    localStorage.setItem(key, nextValue);
  };

  return [value, updateValue] as const;
}
