import { useAuth } from "../../auth/AuthProvider";
import { ExitIcon } from "../../icons/ExitIcon";
import styles from "./style/style.module.css";

export default function Header() {
  const { logout } = useAuth();

  return (
    <header className={styles.appBar}>
      <div className={styles.menuIcon}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={styles.logo}>Global Chat</div>

      <button className={styles.logoutButton} onClick={logout}>
        <span className={styles.logoutText}>Log out</span>
        <ExitIcon />
      </button>
    </header>
  );
}
