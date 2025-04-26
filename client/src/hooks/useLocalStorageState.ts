import { useState, useEffect } from "react";

export function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
  transform?: (raw: any) => T
) {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;

      const parsed = JSON.parse(item);
      return transform ? transform(parsed) : parsed;
    } catch (err) {
      console.error(`Error parsing localStorage[${key}]:`, err);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.error(`Error writing localStorage[${key}]:`, err);
    }
  }, [key, state]);

  const clear = () => {
    localStorage.removeItem(key);
    setState(defaultValue);
  };

  return [state, setState, clear] as const;
}
