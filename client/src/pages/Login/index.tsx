import { useEffect, useState } from "react";
import { useLogin } from "./hooks/useLogin";
import { Link, useNavigate } from "react-router-dom";
import styles from "./style/style.module.css";
import { useAuth } from "../../auth/AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useLogin();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);

    if (success) {
      window.location.href = "/home";
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.welcomeTitle}>Welcome to Global Chat!</h1>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="Email"
          className={styles.input}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          placeholder="Password"
          className={styles.input}
        />

        {error && <div className={styles.error}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className={styles.signupLink}>
          If you do not have an account, create your user{" "}
          <Link to="/sign-up">here</Link>
        </div>
      </form>
    </div>
  );
}
