import { useState } from "react";
import { configApp } from "../../../config";
import axios from "axios";
import { useAuthStorage } from "../../../hooks/useAuthStorage";

export const useLogin = () => {
  const { saveAuth } = useAuthStorage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(
        `${configApp.api}/login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      saveAuth(res.data);
      return true;
    } catch (err: any) {
      setError(err.response.data || "Unexpected error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
