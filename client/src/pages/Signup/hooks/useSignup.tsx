import { useState } from "react";
import { configApp } from "../../../config";
import axios from "axios";

type SignupData = {
  id: string;
  email: string;
  name: string;
  password: string;
};

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const signup = async ({
    id,
    email,
    name,
    password,
  }: SignupData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${configApp.api}/sign-up`,
        { id, email, name, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("User successfully registered");
      // Wait for 3 seconds before returning true
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return true;
    } catch (err: any) {
      setSuccess(null);
      setError(err.response.data || "Unexpected error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error, success };
}
