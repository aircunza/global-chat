import { useState } from "react";
import { useSignup } from "./hooks/useSignup";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./style/style.module.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { signup, loading, error, success: successMessage } = useSignup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signup({ id: uuidv4(), email, name, password });

    if (success) {
      window.location.href = "/login";
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h1 className={styles.signupTitle}>Create your Global Chat account</h1>
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Name"
          required
          className={styles.input}
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          required
          className={styles.input}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
          className={styles.input}
        />

        {error && <div className={styles.error}>{error}</div>}
        {successMessage && (
          <div className={styles.success}>{successMessage}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>

        <div className={styles.loginLink}>
          If you have an account, log in <Link to="/login">here</Link>
        </div>
      </form>
    </div>
  );
}
