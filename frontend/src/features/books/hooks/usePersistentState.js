import { useEffect, useState } from 'react';

function readStoredValue(key, initialValue) {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  } catch {
    return initialValue;
  }
}

export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => readStoredValue(key, initialValue));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Local persistence is a convenience, not a blocker for the UI.
    }
  }, [key, value]);

  return [value, setValue];
}
