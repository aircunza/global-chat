import { ILoginResponse } from "../types/ILoginResponse";

const STORAGE_KEY = "auth.user";

export function useAuthStorage() {
  const saveAuth = (data: ILoginResponse) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const getAuth = (): ILoginResponse | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        session: {
          ...parsed.session,
          expiresAt: new Date(parsed.session.expiresAt), // ensure it's a Date object
        },
      };
    } catch (err) {
      console.error("Error parsing auth data:", err);
      return null;
    }
  };

  const clearAuth = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return { saveAuth, getAuth, clearAuth };
}
