import { useState, useEffect } from "react";

// useState, значение которого сохраняется в localStorage
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* хранилище недоступно, не критично */
    }
  }, [key, value]);

  return [value, setValue];
}
